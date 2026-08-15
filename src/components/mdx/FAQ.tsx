export function FAQ({ question, children }: { question: string; children: React.ReactNode }) {
  return (
    <div className="my-4 rounded-lg border border-border bg-card/70 p-4">
      <h4 className="text-heading-tertiary font-bold">{question}</h4>
      <div className="text-body mt-2 text-sm">{children}</div>
    </div>
  );
}
