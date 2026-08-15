"use client";

import type { ComponentProps } from "react";
import { useArticleParagraphIndex } from "@/components/ads/article-mdx-scope";
import { InArticleMobileAd } from "@/components/ads/in-article-mobile-ad";

export function MdxParagraph({ children }: ComponentProps<"p">) {
  const indexRef = useArticleParagraphIndex();
  const paragraphIndex = indexRef ? indexRef.current++ : -1;
  const showInArticleAd = indexRef !== null && paragraphIndex === 1;

  return (
    <>
      <p className="text-body my-5 leading-8">{children}</p>
      {showInArticleAd ? <InArticleMobileAd /> : null}
    </>
  );
}
