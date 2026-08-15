import { BookOpen, CalendarDays, Gamepad2, MessageCircle, MonitorPlay, ScrollText, ShoppingCart, Star, Tags, Trophy, Users, Wrench, type LucideIcon } from "lucide-react";
import generated from "./navigation.generated.json";

type GeneratedNavigation = {
  categories: Array<{ key: string }>;
  featured: Array<{ key: string; path: string }>;
};

const navigation = generated as GeneratedNavigation;

const ICONS: Record<string, LucideIcon> = {
  achievements: Trophy,
  characters: Users,
  community: MessageCircle,
  details: Tags,
  guide: BookOpen,
  media: MonitorPlay,
  platforms: Gamepad2,
  purchase: ShoppingCart,
  release: CalendarDays,
  reviews: Star,
  requirements: Wrench,
};

const fallbackIcon = ScrollText;

export const NAVIGATION_CONFIG: ReadonlyArray<{
  key: string;
  path: string;
  icon: LucideIcon;
  isContentType: boolean;
}> = navigation.categories.map((category) => ({
  key: category.key,
  path: `/${category.key}`,
  icon: ICONS[category.key] || fallbackIcon,
  isContentType: true,
}));

// Player-first navigation for the header and the compact homepage sidebar.
// The full content taxonomy above remains the source of truth for routes,
// sitemap generation, and article-page navigation.
export const HOME_NAVIGATION_CONFIG: ReadonlyArray<{ key: string; path: string }> =
  navigation.featured.length > 0
    ? navigation.featured
    : navigation.categories.slice(0, 5).map((category) => ({ key: category.key, path: `/${category.key}` }));

export const CONTENT_TYPES = NAVIGATION_CONFIG.filter((item) => item.isContentType).map((item) => item.path.replace(/^\//, ""));
