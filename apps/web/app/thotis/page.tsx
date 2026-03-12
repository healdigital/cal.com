import { _generateMetadata } from "app/_utils";
import type { Metadata } from "next";
import type { ReactElement } from "react";
import { ThotisLandingPageClient } from "~/thotis/components/ThotisLandingPageClient";

export const generateMetadata = async (): Promise<Metadata> =>
  await _generateMetadata(
    (t) => t("thotis_landing_page_title"),
    (t) => t("thotis_landing_page_description"),
    undefined,
    undefined,
    "/thotis"
  );

export default function ThotisLandingPage(): ReactElement {
  return <ThotisLandingPageClient />;
}
