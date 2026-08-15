import { LegalPage } from "@/components/legal-page";
import { getGameName, getSiteName } from "@/config/site";

export default function TermsOfServicePage() {
  return (
    <LegalPage title="Terms of Service">
      <p>{getSiteName()} is an independent fan-made guide hub for {getGameName()}. Content is provided for informational and entertainment purposes only.</p>
      <p>Game systems, platform availability, prices, and updates may change without notice. Verify important information through the game&apos;s official developer, publisher, and storefront pages.</p>
      <p>By using this site, you agree not to misuse it, attempt unauthorized access, or present this fan wiki as an official property.</p>
    </LegalPage>
  );
}
