export function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main className="mx-auto max-w-3xl px-3 py-8 sm:px-6 sm:py-12 lg:px-8">
      <article className="rounded-2xl border border-border bg-card/70 p-4 sm:rounded-3xl sm:p-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">{title}</h1>
        <div className="mt-6 space-y-5 text-sm leading-7 text-muted-foreground sm:mt-8 sm:text-base sm:leading-8">{children}</div>
      </article>
    </main>
  );
}
