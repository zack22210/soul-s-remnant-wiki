import Link from "next/link";
import Image from "next/image";
import { ChevronRight, ExternalLink, Menu } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { HOME_NAVIGATION_CONFIG, NAVIGATION_CONFIG } from "@/config/navigation";
import type { NavGroup } from "@/lib/content";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { CollapsibleNavGroup } from "@/components/collapsible-nav-group";
import { LanguageSwitcher } from "@/components/language-switcher";
import { getGameName, getSiteName, siteConfig } from "@/config/site";

export function localizeHref(href: string, locale: string) {
  if (locale === "en") return href;
  return `/${locale}${href === "/" ? "" : href}`;
}

export async function SiteHeader({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "nav" });
  const ui = await getTranslations({ locale, namespace: "shared" });
  const header = (
    <div className="flex items-center justify-between gap-2 sm:gap-4">
      <Link href={localizeHref("/", locale)} className="flex min-w-0 items-center gap-2 sm:gap-3">
        {siteConfig.media.hero ? <Image
          src="/android-chrome-192x192.png"
          alt=""
          width={36}
          height={36}
          className="h-8 w-8 shrink-0 rounded-xl border border-border sm:h-9 sm:w-9"
          priority
        /> : <span aria-hidden="true" className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[hsl(var(--nav-theme))] text-sm font-black text-white sm:h-9 sm:w-9">{getGameName().slice(0, 1).toUpperCase()}</span>}
        <span className="truncate text-sm font-bold tracking-wide text-foreground">{getSiteName()}</span>
      </Link>
      <nav className="hidden items-center gap-1 md:flex">
        {HOME_NAVIGATION_CONFIG.map((item) => (
          <Link key={item.key} href={localizeHref(item.path, locale)} className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground">
            {t(item.key)}
          </Link>
        ))}
      </nav>
      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        <LanguageSwitcher locale={locale} />
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="outline" size="icon" aria-label={ui("menu")} className="touch-target h-9 w-9">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent className="mobile-drawer border-border bg-background text-foreground">
            <SheetTitle className="pr-8 text-left text-sm font-semibold text-foreground">{ui("menu")}</SheetTitle>
            <div className="mt-4 grid gap-1">
              {HOME_NAVIGATION_CONFIG.map((item) => (
                <Link
                  key={item.key}
                  href={localizeHref(item.path, locale)}
                  className="rounded-lg px-3 py-3.5 text-base font-semibold text-foreground hover:bg-muted"
                >
                  {t(item.key)}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
  return (
    <header className="site-header sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-3 py-2.5 sm:px-6 sm:py-3 lg:px-8">{header}</div>
    </header>
  );
}

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="mb-4 flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground sm:mb-7 sm:gap-2">
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="flex min-w-0 items-center gap-1.5 sm:gap-2">
          {index > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />}
          {item.href ? (
            <Link className="max-w-[14rem] truncate hover:text-foreground sm:max-w-none" href={item.href}>{item.label}</Link>
          ) : (
            <span className="max-w-[12rem] truncate text-foreground sm:max-w-[28rem]">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export async function WikiSidebar({ locale, navGroups, currentPath }: { locale: string; navGroups: NavGroup[]; currentPath?: string }) {
  const t = await getTranslations({ locale, namespace: "shared" });
  const isActive = (href: string) => currentPath === href;
  const isHomepage = !currentPath;
  return (
    <aside className="space-y-4 sm:space-y-6 lg:sticky lg:top-24 lg:self-start">
      {navGroups.length > 0 ? <section className="rounded-2xl border border-border bg-card/60 p-4 shadow-sm sm:p-5">
        <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground sm:mb-4">{t("wikiNavigation")}</h3>
        <nav className="space-y-1" aria-label={t("wikiNavigation")}>
          {navGroups.map((group) => (
            <CollapsibleNavGroup
              key={group.slug}
              title={group.title}
              icon={isHomepage ? null : <span className="grid h-4 w-4 place-items-center rounded text-[10px] font-bold text-[hsl(var(--nav-theme))]">{group.title[0]}</span>}
              count={group.count}
              currentPath={currentPath}
            >
              <ul className="space-y-1">
                {group.links.map((link) => {
                  const isOverview = link.href === `/${group.slug}`;
                  return (
                  <li key={link.href}>
                    <Link
                      href={localizeHref(link.href, locale)}
                      title={link.fullTitle}
                      className={`flex items-start gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors ${isActive(link.href) ? "bg-[hsl(var(--nav-theme)/0.15)] font-semibold text-[hsl(var(--nav-theme))]" : "text-muted-foreground hover:bg-muted hover:text-foreground"} ${isOverview ? "font-medium" : ""}`}
                    >
                      <span className="line-clamp-2 min-w-0 flex-1 leading-snug">{link.label}</span>
                      {link.badge && <Badge variant="secondary" className="ml-auto h-5 shrink-0 border-border px-1.5 text-[10px]">{link.badge}</Badge>}
                    </Link>
                  </li>
                  );
                })}
              </ul>
            </CollapsibleNavGroup>
          ))}
        </nav>
      </section> : null}
      <section className="rounded-2xl border border-border bg-card/60 p-4 sm:p-5">
        <h3 className="mb-3 text-sm font-bold text-foreground">{t("activeCodes")}</h3>
        <div className="space-y-3 text-sm">
          <div className="rounded-xl bg-muted p-3">
            <p className="font-bold text-foreground">{t("tipStartTitle")}</p>
            <p className="mt-1 text-muted-foreground">{t("tipStartDescription")}</p>
          </div>
          <div className="rounded-xl bg-muted p-3">
            <p className="font-bold text-foreground">{t("tipChoicesTitle")}</p>
            <p className="mt-1 text-muted-foreground">{t("tipChoicesDescription")}</p>
          </div>
          {NAVIGATION_CONFIG[0] ? <Link href={localizeHref(NAVIGATION_CONFIG[0].path, locale)} className="inline-flex items-center gap-1 text-sm font-semibold text-[hsl(var(--nav-theme))]">
            {t("viewAllCodes")} <ChevronRight className="h-4 w-4" />
          </Link> : null}
        </div>
      </section>
    </aside>
  );
}

export async function PrimaryWikiNavigation({ locale, currentPath }: { locale: string; currentPath?: string }) {
  const t = await getTranslations({ locale, namespace: "shared" });
  const nav = await getTranslations({ locale, namespace: "nav" });
  return (
    <section className="rounded-2xl border border-border bg-card/60 p-4 shadow-sm sm:p-5">
      <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground sm:mb-4">{t("wikiNavigation")}</h2>
      <nav className="space-y-1" aria-label={t("wikiNavigation")}>
        {HOME_NAVIGATION_CONFIG.map((item) => {
          const active = currentPath === item.path || currentPath?.startsWith(`${item.path}/`);
          return (
            <Link
              key={item.key}
              href={localizeHref(item.path, locale)}
              aria-current={active ? "page" : undefined}
              className={`flex items-center justify-between rounded-lg px-2.5 py-2 text-sm font-semibold transition-colors ${active ? "bg-[hsl(var(--nav-theme)/0.12)] text-[hsl(var(--nav-theme))]" : "text-foreground hover:bg-muted hover:text-[hsl(var(--nav-theme))]"}`}
            >
              <span>{nav(item.key)}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          );
        })}
      </nav>
    </section>
  );
}

export async function SiteFooter({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "footer" });
  const site = await getTranslations({ locale, namespace: "site" });
  return (
    <footer className="mt-10 border-t border-border bg-card/30 pb-safe sm:mt-16">
      <div className="mx-auto max-w-7xl px-3 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mb-8 rounded-2xl border border-border bg-muted/40 p-4 sm:mb-10 sm:p-5">
          <div className="font-bold text-foreground">{site("name")}</div>
          <p className="mt-1 text-sm text-muted-foreground">{t("description")}</p>
          {siteConfig.links.store ? <Link href={siteConfig.links.store} className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[hsl(var(--nav-theme))]">
            {t("playGame")} <ExternalLink className="h-4 w-4" />
          </Link> : null}
        </div>
        <p className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground sm:mb-8">{site("legalNotice")}</p>
        <div className="grid gap-6 sm:gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <h3 className="font-bold text-foreground">{t("aboutTitle")}</h3>
            <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">{t("about")}</p>
          </div>
          <FooterList
            title={t("quickLinks")}
            links={[
              [t("playGame"), siteConfig.links.store || ""],
              [t("officialYoutube"), siteConfig.links.youtube || ""],
              [t("communityGroup"), siteConfig.links.community || ""],
              [t("vvBuilder"), siteConfig.links.official || ""],
            ]}
          />
          <FooterList
            title={t("guides")}
            links={[
              ...NAVIGATION_CONFIG.slice(0, 4).map((item) => [item.key.replace(/(^|\s)\w/g, (letter) => letter.toUpperCase()), item.path]),
              [t("privacyPolicy"), "/privacy-policy"],
              [t("termsOfService"), "/terms-of-service"],
            ]}
          />
        </div>
        <p className="mt-10 border-t border-border pt-6 text-xs text-muted-foreground">{t("copyright")}</p>
      </div>
    </footer>
  );
}

function FooterList({ title, links }: { title: string; links: string[][] }) {
  const visibleLinks = links.filter(([, href]) => Boolean(href));
  if (visibleLinks.length === 0) return null;
  return (
    <div>
      <h4 className="font-semibold text-foreground">{title}</h4>
      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
        {visibleLinks.map(([label, href], index) => (
          <li key={`${label}-${href}-${index}`}>
            {href ? <Link className="hover:text-foreground" href={href}>{label}</Link> : <span>{label}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function TrailerEmbed({ videoId, title = "Official game video" }: { videoId: string; title?: string }) {
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&playsinline=1&rel=0`;
  const previewDocument = `<!doctype html><html><head><meta name="viewport" content="width=device-width"><style>*{box-sizing:border-box}html,body{margin:0;width:100%;height:100%;overflow:hidden;background:#081a3a}a{position:relative;display:block;width:100%;height:100%}img{width:100%;height:100%;object-fit:cover}.play{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);display:grid;place-items:center;width:74px;height:52px;border-radius:14px;background:#e62117;color:white;font:32px/1 Arial,sans-serif;box-shadow:0 8px 28px #0008}.play span{margin-left:4px}</style></head><body><a href="${embedUrl}" aria-label="Play ${title}"><img src="/images/gameplay-overview.webp" alt="${title}"><span class="play"><span>▶</span></span></a></body></html>`;
  return (
    <div className="overflow-hidden rounded-2xl border border-border shadow-lg">
      <iframe
        src={embedUrl}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="aspect-video w-full"
      />
    </div>
  );
}

export function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
