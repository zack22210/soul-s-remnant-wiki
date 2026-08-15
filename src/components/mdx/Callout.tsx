import { CircleAlert, Info, Lightbulb, ShieldCheck } from "lucide-react";

const icons = { info: Info, tip: Lightbulb, warning: CircleAlert, result: ShieldCheck } as const;

export function Callout({ children, type = "info", title }: { children: React.ReactNode; type?: keyof typeof icons; title?: string }) {
  const Icon = icons[type] ?? Info;
  return (
    <aside className="my-6 flex gap-3 rounded-xl bg-[hsl(var(--nav-theme)/0.09)] p-4 text-sm sm:p-5" data-callout={type}>
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-[hsl(var(--nav-theme))]" />
      <div className="min-w-0">
        {title && <strong className="text-heading-tertiary mb-1 block">{title}</strong>}
        <div className="text-body [&>p]:my-0">{children}</div>
      </div>
    </aside>
  );
}

export function Result({ children, title = "Result" }: { children: React.ReactNode; title?: string }) {
  return <Callout type="result" title={title}>{children}</Callout>;
}

export function Spoiler({ children, summary = "Reveal spoiler" }: { children: React.ReactNode; summary?: string }) {
  return (
    <details className="group my-6 rounded-xl border border-border bg-card/70">
      <summary className="text-heading-tertiary cursor-pointer list-none px-4 py-3 font-semibold marker:hidden sm:px-5">{summary}</summary>
      <div className="text-body border-t border-border px-4 py-4 text-sm leading-7 sm:px-5">
        {children}
      </div>
    </details>
  );
}
