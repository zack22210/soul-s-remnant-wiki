import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <main className="mx-auto grid min-h-[60vh] max-w-3xl place-items-center px-3 py-12 text-center sm:px-4 sm:py-16">
      <div className="w-full rounded-2xl border border-border bg-card/70 p-5 sm:rounded-3xl sm:p-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">Page not found</h1>
        <p className="mt-4 text-sm text-muted-foreground sm:text-base">The guide you are looking for may have moved or has not been added yet.</p>
        <Button asChild className="mt-6 w-full sm:w-auto"><Link href="/guide">Browse Guides</Link></Button>
      </div>
    </main>
  );
}
