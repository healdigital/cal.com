import { _generateMetadata } from "app/_utils";
import type { Metadata } from "next";
import type { ReactElement } from "react";
import { MySessionsPageClient } from "~/thotis/components/MySessionsPageClient";

export const generateMetadata = async (): Promise<Metadata> =>
  await _generateMetadata(
    (t) => t("thotis_my_sessions_page_title"),
    (t) => t("thotis_my_sessions_page_description"),
    undefined,
    undefined,
    "/thotis/my-sessions"
  );

export default function MySessionsPage(): ReactElement {
  return <MySessionsPageClient />;
}
