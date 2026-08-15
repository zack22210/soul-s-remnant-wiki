import config from "../../wiki.config.json";

export type WikiConfig = {
  schemaVersion: number;
  gameName: string;
  topic: string;
  domain: string | null;
  defaultLocale: string;
  targetArticleCount: number;
  locales: string[];
  links: Record<"official" | "store" | "youtube" | "community", string | null>;
  media: Record<"youtubeVideoId" | "hero" | "trailerPoster" | "journey" | "finalCta", string | null>;
};

export const siteConfig = config as WikiConfig;

export const isConfigured = Boolean(siteConfig.gameName.trim() && siteConfig.topic.trim());

export function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || siteConfig.domain || "http://localhost:3000").replace(/\/$/, "");
}

export function getSiteName() {
  return siteConfig.gameName ? `${siteConfig.gameName} Wiki` : "Game Wiki Template";
}

export function getGameName() {
  return siteConfig.gameName || "Your Game";
}
