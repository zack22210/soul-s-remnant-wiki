"use client";

import { useId, useState } from "react";
import { ChevronRight } from "lucide-react";

interface CollapsibleNavGroupProps {
  title: string;
  icon: React.ReactNode;
  count?: number;
  defaultOpen?: boolean;
  currentPath?: string;
  children: React.ReactNode;
}

export function CollapsibleNavGroup({ title, icon, count, defaultOpen, currentPath, children }: CollapsibleNavGroupProps) {
  // Auto-open if currentPath matches a link in this group
  const shouldOpen = defaultOpen ?? (currentPath ? hasMatchingLink(children, currentPath) : false);
  const [open, setOpen] = useState(shouldOpen);
  const contentId = useId();

  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={contentId}
        onClick={() => setOpen((current) => !current)}
        className="group flex min-h-10 w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm font-semibold text-foreground transition-colors hover:bg-muted hover:text-[hsl(var(--nav-theme))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {icon}
        <span className="min-w-0 flex-1">{title}</span>
        {count !== undefined && <span className="text-xs font-medium tabular-nums text-muted-foreground">{count}</span>}
        <ChevronRight className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${open ? "rotate-90" : ""}`} />
      </button>
      <div id={contentId} hidden={!open} className="mt-1 pl-2">
        {children}
      </div>
    </div>
  );
}

/** Check if any <Link href="..."> inside children matches currentPath */
function hasMatchingLink(children: React.ReactNode, currentPath: string): boolean {
  if (!children) return false;
  if (Array.isArray(children)) return children.some((c) => hasMatchingLink(c, currentPath));
  if (typeof children === "object" && children !== null && "props" in children) {
    const props = (children as React.ReactElement).props;
    const href = props.href as string | undefined;
    if (href && (href === currentPath || currentPath.startsWith(href + "/"))) return true;
    if (props.children) return hasMatchingLink(props.children, currentPath);
  }
  return false;
}
