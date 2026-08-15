import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ContentItem } from "@/lib/content";
import { localizeHref } from "@/components/site";

export function MoreInSection({ locale, title, items }: { locale: string; title: string; items: ContentItem[] }) {
  if (items.length === 0) return null;
  return (
    <section className="rounded-2xl border border-border bg-card/60 p-4 sm:p-5">
      <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">{title}</h2>
      <nav className="mt-3 space-y-1 border-t border-border pt-3" aria-label={title}>
        {items.slice(0, 5).map((item) => (
          <Link
            key={item.slug}
            href={localizeHref(`/${item.contentType}/${item.slug}`, locale)}
            className="group flex items-start gap-2 rounded-lg px-2 py-2 text-sm font-medium leading-snug text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <span className="min-w-0 flex-1">{item.metadata.navTitle ?? item.metadata.title}</span>
            <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
          </Link>
        ))}
      </nav>
    </section>
  );
}
