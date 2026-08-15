#!/usr/bin/env python3
"""Replace seoscout's Jina Reader extraction with local Trafilatura extraction."""

from __future__ import annotations

import argparse
import re
import textwrap
from pathlib import Path


IMPORT_OLD = "import asyncio\nimport aiohttp\nimport time\n"
IMPORT_NEW = "import asyncio\nimport aiohttp\nimport os\nimport time\n\nimport trafilatura\n"

BR_LANG_OLD = "    'pt': 'Portuguese (Brazil)',\n"
BR_LANG_NEW = "    'pt': 'Portuguese (Brazil)',\n    'br': 'Portuguese (Brazil)',\n"

LIMITS_OLD = """        semaphore = asyncio.Semaphore(self.config.JINA_CONCURRENCY)
        rate_limiter = TokenBucket(self.config.JINA_RPM)
"""
LIMITS_NEW = """        semaphore = asyncio.Semaphore(
            int(os.getenv("WEB_EXTRACT_CONCURRENCY", "5"))
        )
        rate_limiter = TokenBucket(int(os.getenv("WEB_EXTRACT_RPM", "60")))
"""

FETCH_PATTERN = re.compile(
    r"                # 使用 Jina Reader\n"
    r".*?"
    r"                        cleaned_content = self\.cleaner\.clean\(content\)\n",
    re.DOTALL,
)

FETCH_NEW = """                # Fetch the source directly and extract main text locally.
                # Trafilatura is open source and needs no API key or hosted service.
                headers = {
                    "User-Agent": os.getenv(
                        "WEB_EXTRACT_USER_AGENT",
                        "Mozilla/5.0 (compatible; seoscout/1.0; +https://github.com/libin257/seoscout)",
                    ),
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,text/plain;q=0.8,*/*;q=0.5",
                    "Accept-Language": "en-US,en;q=0.8",
                }
                proxy_url = self.config.get_proxy_url_for_stage("extract")
                timeout = aiohttp.ClientTimeout(
                    total=int(os.getenv("WEB_EXTRACT_TIMEOUT", "45"))
                )

                async with aiohttp.ClientSession(timeout=timeout) as session:
                    async with session.get(
                        item.url,
                        headers=headers,
                        proxy=proxy_url,
                        allow_redirects=True,
                    ) as response:
                        if response.status != 200:
                            if attempt < self.config.WEB_EXTRACT_RETRIES - 1:
                                await asyncio.sleep(2 ** attempt)
                                continue
                            return (item, "")

                        content_type = response.headers.get("Content-Type", "").lower()
                        if "text/" not in content_type and "html" not in content_type and "xml" not in content_type:
                            return (item, "")

                        html = await response.text(errors="replace")
                        extracted = await asyncio.to_thread(
                            trafilatura.extract,
                            html,
                            url=str(response.url),
                            output_format="markdown",
                            include_links=True,
                            include_tables=True,
                            favor_precision=True,
                            deduplicate=True,
                        )
                        if not extracted or len(extracted.strip()) < 500:
                            if attempt < self.config.WEB_EXTRACT_RETRIES - 1:
                                await asyncio.sleep(2 ** attempt)
                                continue
                            return (item, "")

                        cleaned_content = self.cleaner.clean(extracted)
"""


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f"Expected one {label} block, found {count}")
    return text.replace(old, new, 1)


def replace_pattern_once(text: str, pattern: re.Pattern[str], new: str, label: str) -> str:
    text, count = pattern.subn(lambda _: new, text, count=1)
    if count != 1:
        raise RuntimeError(f"Expected one {label} block, found {count}")
    return text


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path, help="Path to the seoscout checkout")
    args = parser.parse_args()

    web_file = args.source / "seoscout" / "core" / "web.py"
    text = web_file.read_text(encoding="utf-8")
    already_patched = "import trafilatura" in text and "Fetch the source directly" in text
    if already_patched:
        print(f"Trafilatura patch already applied: {web_file}")
    else:
        text = replace_once(text, IMPORT_OLD, IMPORT_NEW, "import")
        text = replace_once(text, LIMITS_OLD, LIMITS_NEW, "rate-limit")
        text = replace_pattern_once(
            text, FETCH_PATTERN, textwrap.indent(FETCH_NEW, "    "), "fetch"
        )
        web_file.write_text(text, encoding="utf-8")
        print(f"Applied Trafilatura extraction patch: {web_file}")

    translate_file = args.source / "seoscout" / "translate.py"
    translate_text = translate_file.read_text(encoding="utf-8")
    if "'br': 'Portuguese (Brazil)'" not in translate_text:
        translate_text = replace_once(
            translate_text, BR_LANG_OLD, BR_LANG_NEW, "Brazilian Portuguese language"
        )
        translate_file.write_text(translate_text, encoding="utf-8")
        print(f"Added br locale mapping: {translate_file}")


if __name__ == "__main__":
    main()
