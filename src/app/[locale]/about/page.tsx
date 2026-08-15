import { LegalPage } from "@/components/legal-page";
import { getGameName, getSiteName, siteConfig } from "@/config/site";

export default function AboutPage() {
  return (
    <LegalPage title="About">
      <p>{getSiteName()} is an independent fan-made guide hub for {getGameName()}. Its categories are based on reviewed player search demand and available evidence.</p>
      <p>We are not affiliated with the game&apos;s developer, publisher, storefront, or platform holders. Our goal is to provide accurate, practical, and clearly sourced guides.</p>
      {!siteConfig.domain ? <p>This template has not been assigned a production domain yet.</p> : null}
    </LegalPage>
  );
}
