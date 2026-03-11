import { getServerSession } from "@calcom/features/auth/lib/getServerSession";
import { getTranslation } from "@calcom/lib/server/i18n";
import { UserPermissionRole } from "@calcom/prisma/enums";
import { buildLegacyRequest } from "@lib/buildLegacyCtx";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { AmbassadorManagement } from "~/thotis/components/AmbassadorManagement";

export default async function AmbassadorsPage() {
  const session = await getServerSession({ req: buildLegacyRequest(await headers(), await cookies()) });

  if (session?.user?.role !== UserPermissionRole.ADMIN) {
    redirect("/");
  }

  const t = await getTranslation(session?.user?.locale ?? "fr", "common");

  return (
    <div className="min-h-screen bg-subtle">
      <div className="container mx-auto px-4 py-10">
        <div className="mb-6 flex items-center gap-4">
          <a
            href="/thotis/admin"
            className="flex items-center text-sm text-subtle hover:text-emphasis transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t("back_to_dashboard", "Retour au dashboard")}
          </a>
        </div>
        <h1 className="mb-6 text-2xl font-bold text-emphasis">{t("thotis_admin_page_title")}</h1>
        <AmbassadorManagement />
      </div>
    </div>
  );
}
