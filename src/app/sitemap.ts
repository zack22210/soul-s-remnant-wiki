import type { MetadataRoute } from "next";
import { getAllContentPaths } from "@/lib/content";
import { CONTENT_TYPES } from "@/config/navigation";
import { routing } from "@/i18n/routing";
import { getSiteUrl } from "@/config/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();

  // Static paths that always exist
  const staticPaths = ["/", "/privacy-policy", "/terms-of-service", "/copyright", "/about", ...CONTENT_TYPES.map((ct) => `/${ct}`)];

  // Dynamic paths: scan actual MDX content files
  const contentPaths = await getAllContentPaths("en");
  const dynamicPaths = contentPaths.map((item) => `/${[item.contentType, ...item.slug].join("/")}`);

  const paths = [...staticPaths, ...dynamicPaths];

  return routing.locales.flatMap((locale) =>
    paths.map((path) => ({
      url: `${siteUrl}${locale === "en" ? "" : `/${locale}`}${path === "/" ? "" : path}`,
      lastModified: new Date(),
      changeFrequency: path === "/" ? ("daily" as const) : ("weekly" as const),
      priority: path === "/" ? 1 : CONTENT_TYPES.some((type) => path === `/${type}`) ? 0.8 : 0.6,
    })),
  );
}
