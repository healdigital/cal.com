import { _generateMetadata } from "app/_utils";
import type { Metadata } from "next";
import type { ReactElement } from "react";
import { MentorsPageClient } from "~/thotis/components/MentorsPageClient";

export const generateMetadata = async (): Promise<Metadata> =>
  await _generateMetadata(
    (t) => t("thotis_mentors_page_title"),
    (t) => t("thotis_mentors_page_description"),
    undefined,
    undefined,
    "/thotis/mentors"
  );

export default function MentorsPage(): ReactElement {
  return <MentorsPageClient />;
}
