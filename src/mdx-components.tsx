import Link from "next/link";
import type { MDXComponents } from "mdx/types";
import { MdxParagraph } from "@/components/mdx/MdxParagraph";
import { Callout, Result, Spoiler } from "@/components/mdx/Callout";
import { Step, Steps } from "@/components/mdx/Steps";
import { Checklist } from "@/components/mdx/Checklist";

function toHeadingId(children: React.ReactNode): string {
  const text = String(children).replace(/<[^>]*>/g, "").trim();
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...defaultComponents,
    ...components,
  };
}

const defaultComponents: MDXComponents = {
  Callout,
  Result,
  Spoiler,
  Steps,
  Step,
  Checklist,
  h2: ({ children, id }) => {
    const headingId = id || toHeadingId(children);
    return (
      <h2 id={headingId} className="text-heading-secondary mt-8 scroll-m-24 border-b border-border pb-3 text-xl font-bold tracking-tight first:mt-0 sm:mt-10 sm:scroll-m-20 sm:text-2xl">
        {children}
      </h2>
    );
  },
  h3: ({ children, id }) => {
    const headingId = id || toHeadingId(children);
    return <h3 id={headingId} className="text-heading-tertiary mt-6 text-lg font-semibold sm:mt-8 sm:text-xl">{children}</h3>;
  },
  p: MdxParagraph,
  ul: ({ children }) => <ul className="text-body my-5 ml-5 list-disc space-y-2 marker:text-[hsl(var(--nav-theme))]">{children}</ul>,
  ol: ({ children }) => <ol className="text-body my-5 ml-5 list-decimal space-y-2 marker:text-[hsl(var(--nav-theme))]">{children}</ol>,
  li: ({ children }) => <li className="pl-1 leading-7">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
  a: ({ href = "", children }) => (
    <Link className="break-words font-medium text-[hsl(var(--nav-theme))] underline-offset-4 hover:underline" href={href}>
      {children}
    </Link>
  ),
  img: ({ src = "", alt = "" }) => (
    <img src={src} alt={alt} className="my-6 h-auto w-full rounded-xl border border-border" loading="lazy" />
  ),
  pre: ({ children }) => (
    <pre className="mobile-scroll-x my-6 rounded-xl border border-border bg-muted/60 p-4 text-sm leading-6 text-foreground [&>code]:rounded-none [&>code]:bg-transparent [&>code]:p-0 [&>code]:text-[0.9em]">
      {children}
    </pre>
  ),
  code: ({ children, className }) => (
    <code className={className ?? "rounded bg-muted px-1.5 py-0.5 font-mono text-[0.9em] text-foreground"}>
      {children}
    </code>
  ),
  table: ({ children }) => (
    <div className="mobile-scroll-x my-6 rounded-xl border border-border bg-card sm:my-7">
      <table className="w-full min-w-[28rem] text-sm sm:min-w-full">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="text-meta bg-muted/70 text-left text-xs uppercase tracking-[0.18em]">{children}</thead>,
  th: ({ children }) => <th className="whitespace-nowrap px-3 py-2.5 font-semibold sm:px-4 sm:py-3">{children}</th>,
  td: ({ children }) => <td className="text-body border-t border-border px-3 py-2.5 sm:px-4 sm:py-3">{children}</td>,
  blockquote: ({ children }) => (
    <blockquote className="my-6 rounded-xl border border-[hsl(var(--nav-theme-light))] bg-[hsl(var(--nav-theme))]/10 p-4 text-sm text-foreground sm:my-7 sm:p-5">
      {children}
    </blockquote>
  ),
};
