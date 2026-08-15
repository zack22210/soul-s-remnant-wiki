import type { LucideIcon } from "lucide-react";
import { CalendarDays, GitBranch, MapPinned, Monitor, ShieldAlert, Users } from "lucide-react";
import type { ContentItem } from "@/lib/content";

const PRESENTATIONS: Array<{ match: (item: ContentItem) => boolean; icon: LucideIcon; label: string; image?: string }> = [
  { match: (item) => item.slug.includes("mission") || item.slug.includes("walkthrough"), icon: MapPinned, label: "Mission Guide" },
  { match: (item) => item.slug.includes("boss"), icon: ShieldAlert, label: "Boss Guide" },
  { match: (item) => item.slug.includes("ending"), icon: GitBranch, label: "Ending Guide" },
  { match: (item) => item.slug.includes("character"), icon: Users, label: "Character Guide" },
  { match: (item) => item.contentType === "platforms", icon: Monitor, label: "Platform Guide" },
  { match: (item) => item.contentType === "release", icon: CalendarDays, label: "Release Guide" },
];

export interface ArticlePresentation {
  icon: LucideIcon;
  label: string;
  image?: string;
}

export function getArticlePresentation(item: ContentItem): ArticlePresentation {
  return PRESENTATIONS.find((presentation) => presentation.match(item)) ?? { icon: MapPinned, label: "Game Guide" };
}

export function estimateReadingTime(item: Pick<ContentItem, "metadata">, sourceWordCount = 0) {
  const estimatedWords = sourceWordCount || `${item.metadata.title} ${item.metadata.description} ${item.metadata.summary ?? ""}`.split(/\s+/).length * 8;
  return Math.max(2, Math.ceil(estimatedWords / 220));
}
