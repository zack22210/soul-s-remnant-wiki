import type { Metadata, Viewport } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { JsonLd, SiteFooter, SiteHeader } from "@/components/site";
import { routing } from "@/i18n/routing";
import { getGameName, getSiteName, getSiteUrl, siteConfig } from "@/config/site";
import en from "@/locales/en.json";

const siteUrl = getSiteUrl();
const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#07111f",
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const image = siteConfig.media.hero ? `${siteUrl}${siteConfig.media.hero}` : undefined;
  const siteName = getSiteName();
  return {
    metadataBase: new URL(siteUrl),
    title: { default: siteName, template: `%s — ${siteName}` },
    description: en.site.description,
    icons: siteConfig.media.hero ? {
      icon: [
        { url: "/favicon.ico" },
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    } : undefined,
    manifest: siteConfig.media.hero ? "/manifest.json" : undefined,
    openGraph: { type: "website", locale, url: siteUrl, siteName, images: image ? [{ url: image, alt: getGameName() }] : undefined },
    twitter: { card: "summary_large_image", title: siteName, description: en.site.description, images: image ? [image] : undefined },
  };
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const messages = await getMessages();
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: getSiteName(),
    url: siteUrl,
    ...(siteConfig.media.hero ? { logo: `${siteUrl}/android-chrome-512x512.png`, image: `${siteUrl}${siteConfig.media.hero}` } : {}),
  };

  return (
    <html lang={locale} className="dark">
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <NextIntlClientProvider messages={messages}>
          <JsonLd data={organization} />
          <SiteHeader locale={locale} />
          {children}
          <SiteFooter locale={locale} />
        </NextIntlClientProvider>
      </body>
      {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
    </html>
  );
}
