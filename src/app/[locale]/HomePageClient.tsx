"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, Boxes, ChevronRight, CircleHelp, Code2, Compass, Flame, Map as MapIcon, ScrollText, Shield, Skull, Swords, Trophy, Users, Zap, type LucideIcon } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FixedSidebarAds } from "@/components/ads/fixed-sidebar-ads";
import { HomeBottomAd } from "@/components/ads/home-bottom-ad";
import { NativeBannerAd } from "@/components/ads/native-banner-ad";
import { StickyAdBanner } from "@/components/ads/sticky-ad-banner";
import { TrailerEmbed, localizeHref } from "@/components/site";
import { NAVIGATION_CONFIG } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import type { ContentItem } from "@/lib/content";

type Home = {
  hero: { title: string; eyebrow: string; description: string; stats: string[]; primaryCta: string; primaryHref: string; videoLabel: string };
  updates: { title: string; browse: string };
  start: { title: string; imageCaption: string; cards: Array<{ number: string; title: string; description: string }> };
  popular: { title: string; quickLinks: string[] };
  aboutGame: { title: string; paragraphs: string[]; stats: Array<{ label: string; value: string }>; cta: string };
  browseTopics: { title: string; description: string };
  explore: {
    title: string;
    description: string;
    readFullGuide: string;
    modules: Array<{
      order?: number;
      name: string;
      description: string;
      href: string;
      displayType: string;
      highlights?: Array<{ label: string; detail?: string; badge?: string }>;
      references?: string[];
    }>;
  };
  faq: { title: string; description: string; items: Array<{ question: string; answer: string }> };
  finalCta: { title: string; description: string; primary: string; primaryHref: string; secondary: string };
};
type Nav = Record<string, string>;

const icons: LucideIcon[] = [BookOpen, Shield, Compass, Boxes, Flame, Code2, Swords, MapIcon, Users, Trophy, Skull, Zap, CircleHelp, ScrollText];


function getFeaturedArticleImage(article: ContentItem) {
  return article.metadata.image
    ? { src: article.metadata.image, alt: article.metadata.title }
    : null;
}

export default function HomePageClient({ home, nav, locale, articles, recentArticles }: { home: Home; nav: Nav; locale: string; articles: ContentItem[]; recentArticles: ContentItem[] }) {
  return (
    <div className="space-y-10 sm:space-y-14 lg:space-y-16">
      <FixedSidebarAds />
      <StickyAdBanner />

      {/* Hero Section */}
      <section className="text-center">
        <div className="mx-auto mb-4 flex max-w-4xl flex-col items-center gap-2 sm:mb-5 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">{home.hero.title}</h1>
          <span className="inline-flex items-center rounded-md border border-[hsl(var(--nav-theme))] bg-[hsl(var(--nav-theme))] px-2.5 py-0.5 text-xs font-semibold text-primary-foreground sm:-translate-y-1.5">{home.hero.eyebrow}</span>
        </div>

        {/* Official media — immediately under hero title */}
        {siteConfig.media.youtubeVideoId ? (
          <div className="mx-auto mt-5 w-full max-w-4xl sm:mt-6" aria-label={home.hero.videoLabel}>
            <TrailerEmbed videoId={siteConfig.media.youtubeVideoId} title={`${siteConfig.gameName} official game video`} />
          </div>
        ) : null}

        <p className="text-body mx-auto mt-5 max-w-3xl text-sm leading-relaxed sm:mt-6 sm:text-base">{home.hero.description}</p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5">{home.hero.stats.map((stat) => <span key={stat} className="text-meta inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">{stat}</span>)}</div>
        <div className="mx-auto mt-5 flex w-full max-w-sm justify-center px-1 sm:mt-6 sm:px-0">
          <Button asChild size="lg" className="h-auto min-h-11 w-full whitespace-normal rounded-xl px-6 py-3 text-center shadow-md sm:w-auto sm:min-w-64 sm:px-10">
            <Link href={localizeHref(home.hero.primaryHref || "/about", locale)}>{home.hero.primaryCta}</Link>
          </Button>
        </div>
      </section>

      <NativeBannerAd />

      {/* 最近更新 + 新手教程 两栏布局 */}
      {(recentArticles.length > 0 || home.start.cards.length > 0) && <section className="grid gap-6 sm:gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        {/* Latest three MDX articles; the full archive remains one click away. */}
        {recentArticles.length > 0 && <Card className="border-border bg-card/70 p-4 sm:p-5">
          <h2 className="text-heading-secondary mb-4 text-lg font-bold sm:text-xl">{home.updates.title}</h2>
          <div className="space-y-3">
            {recentArticles.map((article) => (
              <Link
                key={`/${article.contentType}/${article.slug}`}
                href={localizeHref(`/${article.contentType}/${article.slug}`, locale)}
                className="block rounded-xl border border-border bg-background p-3.5 transition hover:border-[hsl(var(--nav-theme-light))] sm:p-4"
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <Badge className="bg-[hsl(var(--nav-theme))] text-primary-foreground">{article.contentType.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</Badge>
                  <span className="text-meta shrink-0 text-xs">{article.metadata.date}</span>
                </div>
                <p className="font-semibold leading-snug text-foreground">{article.metadata.title}</p>
              </Link>
            ))}
          </div>
          <Button asChild className="mt-5 w-full" variant="outline">
            <Link href={localizeHref(`/${NAVIGATION_CONFIG[0]?.key || "about"}`, locale)}>{home.updates.browse}</Link>
          </Button>
        </Card>}

        {/* 右侧：新手教程 4 步卡片 */}
        {home.start.cards.length > 0 && <div>
          <h2 className="text-heading-secondary text-2xl font-bold tracking-tight sm:text-3xl">{home.start.title}</h2>
          {siteConfig.media.journey ? <figure className="relative mt-4 aspect-[16/7] overflow-hidden rounded-2xl sm:mt-5">
            <Image
              src={siteConfig.media.journey}
              alt={home.start.imageCaption}
              fill
              sizes="(max-width: 1024px) 100vw, 52vw"
              className="object-cover"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[hsl(215_55%_14%/0.9)] to-transparent px-4 pb-3 pt-10 text-left text-xs font-semibold text-white sm:px-5 sm:pb-4 sm:text-sm">
              {home.start.imageCaption}
            </figcaption>
          </figure> : null}
          <div className="mt-4 grid gap-3 sm:mt-5 sm:grid-cols-2">
            {home.start.cards.map((card) => (
              <div key={card.number} className="rounded-2xl border border-border bg-card/70 p-4 sm:p-5">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-[hsl(var(--nav-theme))] text-sm font-bold text-primary-foreground">{card.number}</span>
                <h3 className="text-heading-tertiary mt-3 font-bold sm:mt-4">{card.title}</h3>
                <p className="text-body mt-2 text-sm leading-6">{card.description}</p>
              </div>
            ))}
          </div>
        </div>}
      </section>}

      {/* Dynamic Content Section — auto-scrolling carousel */}
      {articles.length > 0 && (
        <section>
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-heading-secondary text-2xl font-bold tracking-tight sm:text-3xl">{home.popular.title}</h2>
            </div>
            {home.popular.quickLinks && home.popular.quickLinks.length > 0 && (
              <div className="hidden gap-2 md:flex">{home.popular.quickLinks.map((link) => <Badge key={link} variant="outline" className="border-border px-3 py-1 text-muted-foreground">{link}</Badge>)}</div>
            )}
          </div>
          <div className="relative mt-5 overflow-hidden sm:mt-6">
            {/* Gradient fade edges */}
            <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-8 bg-gradient-to-r from-background to-transparent sm:w-12" />
            <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-8 bg-gradient-to-l from-background to-transparent sm:w-12" />
            <div className="flex gap-3 animate-auto-scroll pb-4 sm:gap-4">
              {/* Render cards twice for seamless infinite loop */}
              {[...articles, ...articles].map((article, index) => {
                const Icon = icons[index % icons.length];
                const featuredImage = getFeaturedArticleImage(article);
                return (
                  <Link key={`${index}-${article.contentType}/${article.slug}`} href={localizeHref(`/${article.contentType}/${article.slug}`, locale)} className="group w-[220px] min-w-[220px] max-w-[300px] flex-shrink-0 overflow-hidden rounded-2xl border border-border bg-card/70 transition hover:border-[hsl(var(--nav-theme-light))] sm:w-[260px] sm:min-w-[260px]">
                    {featuredImage && (
                      <div className="relative aspect-video overflow-hidden">
                        <Image src={featuredImage.src} alt={featuredImage.alt} fill sizes="260px" className="object-cover transition duration-500 ease-out group-hover:scale-[1.03]" />
                      </div>
                    )}
                    <div className="p-4 sm:p-5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="grid h-10 w-10 place-items-center rounded-xl bg-muted text-[hsl(var(--nav-theme))]"><Icon className="h-5 w-5" /></span>
                      {article.metadata.badge && <Badge variant="secondary">{article.metadata.badge}</Badge>}
                    </div>
                    <h3 className="text-heading-tertiary mt-3 text-base font-bold group-hover:text-[hsl(var(--nav-theme))] sm:mt-4 sm:text-lg">{article.metadata.title}</h3>
                    <p className="text-body mt-2 text-sm leading-6 line-clamp-3">{article.metadata.description}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* About Game (curated, stays in JSON) */}
      <section className="grid gap-6 rounded-2xl border border-border bg-card/60 p-4 sm:gap-8 sm:rounded-3xl sm:p-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <h2 className="text-heading-secondary text-2xl font-bold tracking-tight sm:text-3xl">{home.aboutGame.title}</h2>
          {home.aboutGame.paragraphs.map((p) => (
            <p key={p} className="text-body mt-4 text-sm leading-7 sm:mt-5 sm:text-base sm:leading-8">{p}</p>
          ))}
          {NAVIGATION_CONFIG[0] ? <Button asChild className="mt-5 w-full sm:mt-6 sm:w-auto">
            <Link href={localizeHref(NAVIGATION_CONFIG[0].path, locale)}>{home.aboutGame.cta}</Link>
          </Button> : null}
        </div>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-2">
          {home.aboutGame.stats.filter((_, index) => [0, 1, 3, 4].includes(index)).map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-border bg-background p-3 sm:p-4">
              <p className="text-meta text-[10px] uppercase tracking-[0.18em] sm:text-xs">{stat.label}</p>
              <p className="mt-1.5 text-lg font-bold text-foreground sm:mt-2 sm:text-xl">{stat.value}</p>
            </div>
          ))}
        </div>
      </section>

      {NAVIGATION_CONFIG.length > 0 && <section className="rounded-2xl border border-border bg-card/60 p-4 sm:rounded-3xl sm:p-6">
        <div className="max-w-2xl">
          <h2 className="text-heading-secondary text-2xl font-bold tracking-tight sm:text-3xl">{home.browseTopics.title}</h2>
          <p className="text-body mt-2 text-sm leading-6 sm:text-base">{home.browseTopics.description}</p>
        </div>
        <nav className="mt-5 grid gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-4" aria-label={home.browseTopics.title}>
          {NAVIGATION_CONFIG.map((topic) => {
            const Icon = topic.icon;
            return (
              <Link key={topic.key} href={localizeHref(topic.path, locale)} className="group flex min-h-14 items-center gap-3 rounded-xl bg-background px-3.5 py-3 text-sm font-semibold text-foreground transition hover:bg-muted hover:text-[hsl(var(--nav-theme))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <Icon className="h-4 w-4 shrink-0 text-[hsl(var(--nav-theme))]" />
                <span className="min-w-0 flex-1">{nav[topic.key as keyof Nav]}</span>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </Link>
            );
          })}
        </nav>
      </section>}

      {/* 8 Module Sections (full-width stacked, matching reference site style) */}
      {home.explore.modules && home.explore.modules.length > 0 && (
        <section>
          <h2 className="text-heading-secondary text-2xl font-bold tracking-tight sm:text-3xl">{home.explore.title}</h2>
          <p className="text-body mt-2 text-sm sm:text-base">{home.explore.description}</p>

          {/* Quick nav pills */}
          <div className="mobile-scroll-x mt-4 flex flex-nowrap gap-2 pb-1 sm:mt-5 sm:flex-wrap sm:pb-0">
            {home.explore.modules.map((mod, index) => {
              const moduleOrder = mod.order ?? index + 1;
              return (
              <a
                key={moduleOrder}
                href={`#explore-${moduleOrder}`}
                className="shrink-0 rounded-full border border-border bg-card/70 px-3.5 py-1.5 text-sm text-muted-foreground transition hover:border-[hsl(var(--nav-theme-light))] hover:text-[hsl(var(--nav-theme))]"
              >
                {mod.name}
              </a>
              );
            })}
          </div>

          {/* Stacked module content sections */}
          <div className="mt-6 space-y-4 sm:mt-8 sm:space-y-6">
            {home.explore.modules.map((mod, index) => {
              const moduleOrder = mod.order ?? index + 1;
              return (
                <div id={`explore-${moduleOrder}`} key={moduleOrder} className="scroll-mt-24 overflow-hidden rounded-2xl border border-border bg-card/70">
                {/* Module header */}
                <div className="border-b border-border bg-muted/30 px-4 py-3.5 sm:px-6 sm:py-4">
                  <h3 className="text-heading-tertiary text-base font-bold sm:text-lg">{mod.name}</h3>
                  <p className="text-body mt-1 text-sm leading-6 sm:leading-7">{mod.description}</p>
                </div>

                {/* Module preview — styled per displayType */}
                <div className="px-4 py-4 sm:px-6 sm:py-5">
                  {/* code-cards: show active codes */}
                  {mod.displayType === "code-cards" && mod.highlights && mod.highlights.length > 0 && (
                    <div className="space-y-3">
                      {mod.highlights.map((h, i) => (
                        <div key={i} className="flex flex-col gap-2 rounded-xl border border-border bg-muted p-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-4">
                          <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                            <code className="w-fit rounded-lg bg-background px-3 py-1.5 font-mono text-sm font-bold text-foreground">{h.label}</code>
                            <span className="text-body text-sm">{h.detail}</span>
                          </div>
                          {"badge" in h && typeof h.badge === "string" && h.badge && <Badge className="w-fit shrink-0 bg-emerald-600 text-[10px] text-white">{h.badge}</Badge>}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* step-by-step: numbered step cards */}
                  {mod.displayType === "step-by-step" && mod.highlights && mod.highlights.length > 0 && (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {mod.highlights.map((h, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[hsl(var(--nav-theme))] text-xs font-bold text-primary-foreground">{h.label}</span>
                          <span className="text-body text-sm leading-6">{h.detail}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* tier-grid: S/A/B/C colored cards */}
                  {mod.displayType === "tier-grid" && mod.highlights && mod.highlights.length > 0 && (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      {mod.highlights.map((h, i) => {
                        const tierColor =
                          h.label === "S" ? "border-amber-500/40 bg-amber-500/10" :
                          h.label === "A" ? "border-emerald-500/40 bg-emerald-500/10" :
                          h.label === "B" ? "border-blue-500/40 bg-blue-500/10" :
                          h.label === "C" ? "border-zinc-500/40 bg-zinc-500/10" :
                          "border-border bg-muted";
                        const tierText =
                          h.label === "S" ? "text-amber-400" :
                          h.label === "A" ? "text-emerald-400" :
                          h.label === "B" ? "text-blue-400" :
                          h.label === "C" ? "text-zinc-400" :
                          "text-muted-foreground";
                        return (
                          <div key={i} className={`rounded-xl border p-4 ${tierColor}`}>
                            <span className={`text-sm font-bold ${tierText}`}>{h.label} Tier</span>
                            <p className="text-body mt-1.5 text-xs leading-5">{h.detail}</p>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* card-list: icon + name cards */}
                  {mod.displayType === "card-list" && mod.highlights && mod.highlights.length > 0 && (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {mod.highlights.map((h, i) => (
                        <div key={i} className="flex items-center gap-3 rounded-xl border border-border bg-muted p-3">
                          <span className="text-xl">{h.label}</span>
                          <span className="text-body text-sm font-medium">{h.detail}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <Link
                    href={localizeHref(mod.href || NAVIGATION_CONFIG[0]?.path || "/about", locale)}
                    className="mt-5 inline-flex min-h-11 items-center text-sm font-semibold text-[hsl(var(--nav-theme))] underline-offset-4 hover:underline"
                  >
                    {home.explore.readFullGuide} <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <HomeBottomAd />

      {/* FAQ (curated, stays in JSON) */}
      {home.faq.items.length > 0 ? <section>
        <h2 className="text-heading-secondary text-2xl font-bold tracking-tight sm:text-3xl">{home.faq.title}</h2>
        <p className="text-body mt-2 text-sm sm:text-base">{home.faq.description}</p>
        <Accordion type="single" collapsible className="mt-5 rounded-2xl border border-border bg-card/70 px-4 sm:mt-6 sm:px-5">
          {home.faq.items.map((item, index) => (
            <AccordionItem key={item.question} value={`item-${index}`}>
              <AccordionTrigger className="text-heading-tertiary text-left text-sm sm:text-base">{item.question}</AccordionTrigger>
              <AccordionContent className="text-body text-sm leading-7 sm:text-base">{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section> : null}

      {/* Final CTA (curated, stays in JSON) */}
      <section className="relative isolate overflow-hidden rounded-2xl bg-[hsl(var(--nav-theme))] px-5 py-14 text-center text-white shadow-xl sm:rounded-3xl sm:px-8 sm:py-20">
        {siteConfig.media.finalCta ? <Image src={siteConfig.media.finalCta} alt="" fill sizes="(max-width: 1280px) 100vw, 1200px" className="-z-20 object-cover" /> : null}
        <div className="absolute inset-0 -z-10 bg-[hsl(215_55%_12%/0.78)]" />
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-4xl">{home.finalCta.title}</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-blue-50/90 sm:text-base">{home.finalCta.description}</p>
        <div className="mx-auto mt-6 flex w-full max-w-sm justify-center px-1 sm:mt-7 sm:px-0">
          <Button asChild size="lg" className="h-auto min-h-11 w-full whitespace-normal bg-[hsl(var(--nav-theme-light))] px-6 py-3 text-center font-bold text-[hsl(215_55%_16%)] shadow-lg hover:bg-[hsl(43_91%_66%)] sm:w-auto sm:min-w-64 sm:px-10">
            <Link href={localizeHref(home.finalCta.primaryHref || "/about", locale)}>{home.finalCta.primary}<ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
        {siteConfig.links.store && home.finalCta.secondary ? <Link href={siteConfig.links.store} className="mt-4 inline-flex text-sm font-semibold text-white/90 underline decoration-white/40 underline-offset-4 transition hover:text-white">{home.finalCta.secondary}</Link> : null}
      </section>
    </div>
  );
}
