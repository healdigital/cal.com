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
        <h1 className="mb-6 text-2xl font-bold text-emphasis">{t("thotis_admin_page_title")}</h1>
        <AmbassadorManagement />
      </div>
    </div>
  );
}
