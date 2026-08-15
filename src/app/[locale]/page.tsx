import type { Metadata } from "next";
import Image from "next/image";
import { getMessages } from "next-intl/server";
import { JsonLd, WikiSidebar } from "@/components/site";
import { getAllContent, getDynamicNavigation, type ContentItem, CONTENT_TYPES } from "@/lib/content";
import { routing, type Locale } from "@/i18n/routing";
import en from "@/locales/en.json";
import HomePageClient from "./HomePageClient";
import { getSiteName, getSiteUrl, siteConfig } from "@/config/site";

const siteUrl = getSiteUrl();

type Messages = typeof en;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const messages = (await getMessages({ locale })) as Messages;
  const image = siteConfig.media.hero ? `${siteUrl}${siteConfig.media.hero}` : undefined;
  const title = messages.home.meta.title || getSiteName();
  const description = messages.home.meta.description;
  return {
    title,
    description,
    alternates: { canonical: locale === "en" ? "/" : `/${locale}`, languages: Object.fromEntries(routing.locales.map((lang) => [lang, lang === "en" ? "/" : `/${lang}`])) },
    openGraph: { title, description, url: locale === "en" ? siteUrl : `${siteUrl}/${locale}`, siteName: getSiteName(), images: image ? [{ url: image }] : undefined },
    twitter: { card: "summary_large_image", title, description, images: image ? [image] : undefined },
  };
}

export default async function LocaleHomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const loc = locale as Locale;
  const messages = (await getMessages({ locale })) as Messages;
  const navGroups = getDynamicNavigation(loc);
  const localizedUrl = locale === "en" ? siteUrl : `${siteUrl}/${locale}`;
  const webSite = { "@context": "https://schema.org", "@type": "WebSite", name: getSiteName(), url: localizedUrl, description: messages.site.description, inLanguage: locale, ...(siteConfig.media.hero ? { image: `${siteUrl}${siteConfig.media.hero}` } : {}), publisher: { "@type": "Organization", name: getSiteName(), url: siteUrl } };

  // 动态加载所有 content 目录下的文章
  const allArticles: ContentItem[] = [];
  for (const contentType of CONTENT_TYPES) {
    const items = await getAllContent(contentType, loc);
    allArticles.push(...items);
  }

  // Keep the homepage update list concise; the category pages retain every article.
  const recentArticles = [...allArticles]
    .sort((a, b) => {
      const dateA = a.metadata.lastModified || a.metadata.date;
      const dateB = b.metadata.lastModified || b.metadata.date;
      return dateB.localeCompare(dateA);
    })
    .slice(0, 3);

  return (
    <main className="relative isolate mx-auto max-w-7xl px-3 py-6 sm:px-6 sm:py-10 lg:px-8">
      <JsonLd data={webSite} />
      {siteConfig.media.hero ? (
        <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[calc(100svh-4rem)] min-h-[44rem] w-screen -translate-x-1/2 overflow-hidden">
          <Image
            src={siteConfig.media.hero}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,hsl(var(--background)/0.18)_0%,hsl(var(--background)/0.44)_58%,hsl(var(--background))_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,transparent_0%,hsl(var(--background)/0.18)_52%,hsl(var(--background)/0.7)_100%)]" />
        </div>
      ) : null}
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-10">
        <div className="min-w-0">
          <HomePageClient home={messages.home} nav={messages.nav} locale={locale} articles={allArticles} recentArticles={recentArticles} />
        </div>
        <div className="min-w-0">
          <WikiSidebar locale={locale} navGroups={navGroups} />
        </div>
      </div>
    </main>
  );
}
