"use client";

import { useState } from "react";
import { ChevronDown, X } from "lucide-react";

interface Heading {
  id: string;
  text: string;
  level: number;
}

/**
 * 移动端：标题和正文之间显示可折叠 TOC 面板
 * 桌面端：隐藏（侧边栏有单独的 heading 链接）
 */
export function MobileTOC({ headings, label, sectionsLabel = "sections" }: { headings: Heading[]; label: string; sectionsLabel?: string }) {
  const [open, setOpen] = useState(false);

  if (headings.length === 0) return null;

  return (
    <div className="mb-5 rounded-2xl border border-border bg-card/70 p-3.5 sm:mb-6 sm:p-4 lg:hidden">
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          className="flex min-h-10 items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground sm:text-sm"
        >
          <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
          <span className="truncate">{label} · {headings.length} {sectionsLabel}</span>
        </button>
        {open && (
          <button onClick={() => setOpen(false)} className="touch-target grid place-items-center text-muted-foreground hover:text-foreground" aria-label="Close TOC">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      {open && (
        <nav className="mt-3 max-h-[50vh] space-y-1 overflow-y-auto overscroll-contain border-t border-border pt-3">
          {headings.map((h) => (
            <a
              key={h.id}
              href={`#${h.id}`}
              onClick={() => setOpen(false)}
              className={`block rounded-lg px-2 py-2 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground ${
                h.level === 3 ? "pl-5 sm:pl-6" : ""
              }`}
            >
              {h.text}
            </a>
          ))}
        </nav>
      )}
    </div>
  );
}

/**
 * 桌面端侧边栏中的 TOC（可折叠）
 * 移动端隐藏
 */
export function SidebarTOC({ headings, label, currentPathname }: { headings: Heading[]; label: string; currentPathname: string }) {
  const [open, setOpen] = useState(true);

  if (headings.length === 0) return null;

  return (
    <div className="hidden lg:block rounded-2xl border border-border bg-card/70 p-5">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between"
      >
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">{label}</h3>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <ul className="mt-3 space-y-1 border-t border-border pt-3">
          {headings.map((h) => (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                className={`block rounded-lg px-2 py-1.5 text-sm transition ${
                  h.level === 3 ? "pl-6" : ""
                } text-muted-foreground hover:bg-muted hover:text-foreground`}
              >
                {h.text}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
