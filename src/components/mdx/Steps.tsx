export function Steps({ children }: { children: React.ReactNode }) {
  return <ol className="my-6 space-y-3 [counter-reset:guide-step]">{children}</ol>;
}

export function Step({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <li className="text-body relative list-none rounded-xl bg-muted/60 py-3 pl-14 pr-4 text-sm leading-7 before:absolute before:left-3 before:top-3 before:grid before:h-8 before:w-8 before:place-items-center before:rounded-full before:bg-[hsl(var(--nav-theme))] before:font-bold before:text-white before:content-[counter(guide-step)] [counter-increment:guide-step]">
      {title && <strong className="text-heading-tertiary mb-0.5 block">{title}</strong>}
      <div>{children}</div>
    </li>
  );
}
