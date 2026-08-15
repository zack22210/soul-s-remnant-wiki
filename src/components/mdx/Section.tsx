export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="my-6">
      <h3 className="text-heading-tertiary text-xl font-bold">{title}</h3>
      <div className="mt-3">{children}</div>
    </section>
  );
}
