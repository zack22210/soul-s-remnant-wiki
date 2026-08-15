export function CardGrid({ children }: { children: React.ReactNode }) {
  return <div className="my-4 grid gap-3 sm:grid-cols-2 sm:gap-4">{children}</div>;
}

export function Card({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <div className="rounded-xl border border-border bg-card/70 p-4">
      {title && <h4 className="text-heading-tertiary font-bold">{title}</h4>}
      <div className="text-body mt-2 text-sm">{children}</div>
    </div>
  );
}
