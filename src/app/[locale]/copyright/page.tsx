import { LegalPage } from "@/components/legal-page";
import { getGameName, getSiteName } from "@/config/site";

export default function CopyrightPage() {
  return (
    <LegalPage title="Copyright">
      <p>{getGameName()}, its logos, characters, and game media belong to their respective rights holders.</p>
      <p>{getSiteName()} is an unofficial fan wiki used for commentary, education, and guide presentation.</p>
      <p>If you own rights to content displayed here and have a concern, please contact the site operator for review.</p>
    </LegalPage>
  );
}
