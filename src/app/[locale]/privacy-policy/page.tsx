import { LegalPage } from "@/components/legal-page";
import { getGameName, getSiteName } from "@/config/site";

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <p>{getSiteName()} provides informational guides for {getGameName()}. We do not request storefront credentials, game-account passwords, or private payment information.</p>
      <p>Basic analytics, advertising, and hosting providers may process standard technical information such as device type, browser, approximate region, and visited pages.</p>
      <p>External links may lead to official developer, publisher, storefront, video, or community services. Those services are governed by their own privacy policies.</p>
    </LegalPage>
  );
}
