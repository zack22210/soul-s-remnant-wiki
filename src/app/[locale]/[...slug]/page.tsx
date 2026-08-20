import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CalendarDays, ChevronRight, Clock3, Swords } from "lucide-react";
import { getMessages } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { getAllContent, getAllContentPaths, getContent, type ContentItem } from "@/lib/content";
import { ArticleFooterAds } from "@/components/ads/article-footer-ads";
import { FixedSidebarAds } from "@/components/ads/fixed-sidebar-ads";
import { InArticleMobileAd } from "@/components/ads/in-article-mobile-ad";
import { StickyAdBanner } from "@/components/ads/sticky-ad-banner";
import { Breadcrumbs, JsonLd, PrimaryWikiNavigation, localizeHref } from "@/components/site";
import { MoreInSection } from "@/components/article-sidebar";
import { MobileTOC, SidebarTOC } from "@/components/table-of-contents";
import { CONTENT_TYPES } from "@/config/navigation";
import { routing, type Locale } from "@/i18n/routing";
import en from "@/locales/en.json";
import { estimateReadingTime, getArticlePresentation } from "@/lib/article-presentation";
import { getGameName, getSiteName, getSiteUrl, siteConfig } from "@/config/site";

const siteUrl = getSiteUrl();
type Messages = typeof en;

function languageAlternates(pathname: string) {
  return Object.fromEntries(routing.locales.map((locale) => [locale, locale === "en" ? pathname : `/${locale}${pathname}`]));
}

function localizedUrl(pathname: string, locale: Locale) {
  return `${siteUrl}${locale === "en" ? "" : `/${locale}`}${pathname}`;
}

export async function generateStaticParams() {
  const paths = await getAllContentPaths("en");
  const listingPages = CONTENT_TYPES.map((ct) => ({ slug: [ct] }));
  return [...listingPages, ...paths.map((item) => ({ slug: [item.contentType, ...item.slug] }))];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale; slug: string[] }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const messages = (await getMessages({ locale })) as Messages;
  if (slug.length === 1 && CONTENT_TYPES.includes(slug[0])) {
    const ct = slug[0];
    const ctTitle = ct.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    const ctMessages = (messages as unknown as Record<string, Record<string, string>>)[ct];
    const title = ctMessages?.overviewTitle || `${ctTitle} — ${getSiteName()}`;
    const description = ctMessages?.overviewDescription || `Browse all ${ctTitle.toLowerCase()} guides for ${getGameName()}.`;
    const pathname = `/${ct}`;
    const image = siteConfig.media.hero ? `${siteUrl}${siteConfig.media.hero}` : undefined;
    return { title, description, alternates: { canonical: locale === "en" ? pathname : `/${locale}${pathname}`, languages: languageAlternates(pathname) }, openGraph: { title, description, url: localizedUrl(pathname, locale), siteName: getSiteName(), images: image ? [image] : undefined }, twitter: { card: "summary_large_image", title, description, images: image ? [image] : undefined } };
  }
  const [contentType, ...articleSlug] = slug;
  const item = await getContent(contentType, articleSlug, locale);
  if (!item) return { title: "Not Found" };
  const pathname = `/${contentType}/${articleSlug.join("/")}`;
  const imagePath = item.metadata.image || siteConfig.media.hero;
  const image = imagePath ? (imagePath.startsWith("http") ? imagePath : `${siteUrl}${imagePath}`) : undefined;
  return { title: item.metadata.title, description: item.metadata.description, alternates: { canonical: locale === "en" ? pathname : `/${locale}${pathname}`, languages: languageAlternates(pathname) }, openGraph: { type: "article", title: item.metadata.title, description: item.metadata.description, url: localizedUrl(pathname, locale), siteName: getSiteName(), images: image ? [image] : undefined }, twitter: { card: "summary_large_image", title: item.metadata.title, description: item.metadata.description, images: image ? [image] : undefined } };
}

export default async function SlugPage({ params }: { params: Promise<{ locale: Locale; slug: string[] }> }) {
  const { locale, slug } = await params;
  if (slug.length === 1) return <NavigationPage locale={locale} contentType={slug[0]} />;
  return <DetailPage locale={locale} contentType={slug[0]} slug={slug.slice(1)} />;
}

async function NavigationPage({ locale, contentType }: { locale: Locale; contentType: string }) {
  if (!CONTENT_TYPES.includes(contentType)) notFound();
  const messages = (await getMessages({ locale })) as Messages;
  const items = await getAllContent(contentType, locale);
  const listData = { "@context": "https://schema.org", "@type": "ItemList", name: `${contentType} — ${getSiteName()}`, itemListElement: items.map((item, index) => ({ "@type": "ListItem", position: index + 1, url: localizedUrl(`/${contentType}/${item.slug}`, locale), name: item.metadata.title })) };

  // 读取分类标题（优先用 locale JSON 里的，没有就转 slug）
  const sectionTitle = (messages as unknown as Record<string, Record<string, string>>)[contentType]?.overviewTitle
    || contentType.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const sectionDesc = (messages as unknown as Record<string, Record<string, string>>)[contentType]?.overviewDescription || "";

  return (
    <main className="mx-auto max-w-7xl px-3 py-6 sm:px-6 sm:py-10 lg:px-8">
      <JsonLd data={listData} />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-10">
        <article className="min-w-0">
          <Breadcrumbs items={[{ label: messages.shared.home, href: localizeHref("/", locale) }, { label: sectionTitle }]} />
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl">{sectionTitle}</h1>
          {sectionDesc && <p className="text-body mt-4 text-base leading-7 sm:mt-5 sm:text-lg sm:leading-8">{sectionDesc}</p>}
          {items.length > 0 && (
            <div className="mt-8 grid gap-3 sm:mt-10 sm:grid-cols-2 sm:gap-4">
              {items.map((item) => {
                const presentation = getArticlePresentation(item);
                const Icon = presentation.icon;
                return (
                <Link
                  key={`/${contentType}/${item.slug}`}
                  href={localizeHref(`/${contentType}/${item.slug}`, locale)}
                  className="group rounded-2xl border border-border bg-card/70 p-4 transition hover:-translate-y-0.5 hover:border-[hsl(var(--nav-theme-light))] sm:p-5"
                >
                  {presentation.image && (
                    <div className="relative -mx-4 -mt-4 mb-4 aspect-[16/7] overflow-hidden rounded-t-2xl sm:-mx-5 sm:-mt-5">
                      <Image src={presentation.image} alt="" fill sizes="(max-width: 640px) 100vw, 42vw" className="object-cover transition duration-500 ease-out group-hover:scale-[1.025]" />
                    </div>
                  )}
                  <div className="mb-3 flex items-center justify-between gap-3 sm:mb-4">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-muted text-[hsl(var(--nav-theme))]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <Badge variant="secondary">{item.metadata.badge ?? presentation.label}</Badge>
                  </div>
                  <h3 className="text-heading-tertiary text-base font-bold group-hover:text-[hsl(var(--nav-theme))] sm:text-lg">{item.metadata.title}</h3>
                  <p className="text-body mt-2 min-h-[3rem] text-sm leading-6">{item.metadata.description}</p>
                  <span className="mt-4 inline-flex items-center text-sm font-semibold text-[hsl(var(--nav-theme))]">
                    {messages.shared.readMore}
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </span>
                </Link>
                );
              })}
            </div>
          )}
          {items.length === 0 && <p className="mt-8 text-muted-foreground">{messages.shared.noGuidesAvailable}</p>}
        </article>
        <aside className="hidden space-y-4 lg:sticky lg:top-24 lg:block lg:self-start">
          <PrimaryWikiNavigation locale={locale} currentPath={`/${contentType}`} />
        </aside>
      </div>
    </main>
  );
}

async function DetailPage({ locale, contentType, slug }: { locale: Locale; contentType: string; slug: string[] }) {
  if (!CONTENT_TYPES.includes(contentType)) notFound();
  const messages = (await getMessages({ locale })) as Messages;
  const item = await getContent(contentType, slug, locale);
  if (!item) notFound();
  const pathname = `/${contentType}/${slug.join("/")}`;
  const tocLabel = messages.shared.tableOfContents || messages.shared.inThisSection || "Table of Contents";
  const sectionLabel = contentType.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const articleImagePath = item.metadata.image || siteConfig.media.hero;
  const articleImage = articleImagePath ? (articleImagePath.startsWith("http") ? articleImagePath : `${siteUrl}${articleImagePath}`) : undefined;
  const articleData = { "@context": "https://schema.org", "@type": "Article", headline: item.metadata.title, description: item.metadata.description, ...(articleImage ? { image: articleImage } : {}), inLanguage: locale, datePublished: item.metadata.date, dateModified: item.metadata.lastModified ?? item.metadata.date, mainEntityOfPage: localizedUrl(pathname, locale), author: { "@type": "Organization", name: getSiteName(), url: siteUrl }, publisher: { "@type": "Organization", name: getSiteName(), url: siteUrl } };
  const breadcrumbData = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: localizedUrl("/", locale) }, { "@type": "ListItem", position: 2, name: sectionLabel, item: localizedUrl(`/${contentType}`, locale) }, { "@type": "ListItem", position: 3, name: item.metadata.title, item: localizedUrl(pathname, locale) }] };

  const relatedLabel = messages.shared.relatedGuides || "Related Guides";
  const allInSection = await getAllContent(contentType, locale);
  const moreInSection = allInSection.filter((related) => related.slug !== slug.join("/")).slice(0, 5);
  const presentation = getArticlePresentation(item);
  const readingMinutes = estimateReadingTime(item, item.wordCount);

  return (
    <>
      <FixedSidebarAds />
      <main className="mx-auto max-w-7xl px-3 py-6 sm:px-6 sm:py-10 lg:px-8">
      <JsonLd data={articleData} />
      <JsonLd data={breadcrumbData} />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-10">
        <article className="min-w-0">
          <Breadcrumbs
            items={[
              { label: messages.shared.home, href: localizeHref("/", locale) },
              { label: sectionLabel, href: localizeHref(`/${contentType}`, locale) },
              { label: item.metadata.title },
            ]}
          />
          <div className="max-w-[72ch]">
            <Badge className="bg-[hsl(var(--nav-theme))] text-primary-foreground">{presentation.label}</Badge>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl">{item.metadata.title}</h1>
            <div className="text-meta mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
              <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-4 w-4" />{item.metadata.lastModified ?? item.metadata.date}</span>
              <span className="inline-flex items-center gap-1.5"><Clock3 className="h-4 w-4" />{readingMinutes} min read</span>
            </div>
          </div>
          <StickyAdBanner />
          <p className="text-body mt-4 max-w-[72ch] text-base leading-7 sm:mt-5 sm:text-lg sm:leading-8">
            {item.metadata.summary ?? item.metadata.description}
          </p>
          {presentation.image && (
            <figure className="relative mt-6 aspect-[16/7] max-w-[72ch] overflow-hidden rounded-2xl sm:mt-8">
              <Image src={presentation.image} alt={`${item.metadata.title} gameplay scene`} fill sizes="(max-width: 1024px) 100vw, 760px" className="object-cover" priority />
            </figure>
          )}
          <MobileTOC headings={item.headings} label={tocLabel} sectionsLabel={messages.shared.sections} />
          <InArticleMobileAd />
          <div className="prose-invert mt-8 max-w-[72ch] sm:mt-10">
            <item.MDXContent />
          </div>
          <ArticleFooterAds />
          <ArticleCards locale={locale} contentType={contentType} currentSlug={slug.join("/")} relatedLabel={relatedLabel} />
        </article>
        <aside className="hidden space-y-4 lg:sticky lg:top-24 lg:block lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:pr-1">
          <SidebarTOC headings={item.headings} label={tocLabel} currentPathname={pathname} />
          <MoreInSection locale={locale} title={`${messages.shared.moreInSection} ${sectionLabel}`} items={moreInSection} />
        </aside>
      </div>
      </main>
    </>
  );
}

async function ArticleCards({ locale, contentType, currentSlug, relatedLabel }: { locale: string; contentType: string; currentSlug: string; relatedLabel: string }) {
  // 动态获取同分类其他文章（排除当前文章）
  const allItems = await getAllContent(contentType, locale as Locale);
  const related = allItems.filter((item) => item.slug !== currentSlug).slice(0, 4);

  if (related.length === 0) return null;

  return (
    <div className="mt-10 space-y-8 sm:mt-12 lg:hidden">
      <section>
        <h3 className="text-heading-secondary text-lg font-bold sm:text-xl">{relatedLabel}</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 sm:gap-4">
          {related.map((item) => (
            <SmallCard
              key={item.slug}
              icon={<Swords className="h-5 w-5" />}
              title={item.metadata.title}
              description={item.metadata.description}
              href={localizeHref(`/${contentType}/${item.slug}`, locale)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function SmallCard({ title, description, href, icon }: { title: string; description: string; href: string; icon?: React.ReactNode }) {
  return (
    <Link href={href} className="block rounded-2xl border border-border bg-card/70 p-4 transition hover:border-[hsl(var(--nav-theme-light))] sm:p-5">
      {icon && <div className="mb-3 text-[hsl(var(--nav-theme))]">{icon}</div>}
      <h4 className="text-heading-tertiary font-bold">{title}</h4>
      <p className="text-body mt-2 text-sm leading-6">{description}</p>
    </Link>
  );
}
