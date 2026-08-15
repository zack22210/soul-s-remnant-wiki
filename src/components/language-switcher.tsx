"use client";

import { usePathname, useRouter } from "next/navigation";
import { Check, ChevronDown, Globe } from "lucide-react";
import { routing, type Locale } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function LanguageSwitcher({ locale }: { locale: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const displayNames = new Intl.DisplayNames([locale], { type: "language" });
  const localeLabel = (value: string) => displayNames.of(value) || value;

  if (!routing.locales.includes(locale as Locale) || routing.locales.length <= 1) return null;

  const handleSwitch = (nextLocale: Locale) => {
    if (nextLocale === locale) return;
    let nextPath = pathname;

    if (locale !== routing.defaultLocale) nextPath = nextPath.replace(`/${locale}`, "") || "/";
    if (nextLocale !== routing.defaultLocale) nextPath = `/${nextLocale}${nextPath === "/" ? "" : nextPath}`;

    document.cookie = `NEXT_LOCALE=${nextLocale};path=/;max-age=${60 * 60 * 24 * 365};SameSite=Lax`;
    router.push(nextPath);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          aria-label={`Language: ${localeLabel(locale)}`}
          className="h-9 gap-1.5 px-2 text-xs font-medium text-muted-foreground hover:text-foreground sm:px-3"
        >
          <Globe className="h-4 w-4 shrink-0" />
          <span className="hidden sm:inline">{localeLabel(locale)}</span>
          <ChevronDown className="hidden h-3.5 w-3.5 opacity-70 sm:inline" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px]">
        {routing.locales.map((nextLocale) => (
          <DropdownMenuItem key={nextLocale} onClick={() => handleSwitch(nextLocale)} className="flex items-center justify-between gap-3">
            <span>{localeLabel(nextLocale)}</span>
            {nextLocale === locale ? <Check className="h-4 w-4 text-[hsl(var(--nav-theme))]" /> : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
