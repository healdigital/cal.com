import { getServerSession } from "@calcom/features/auth/lib/getServerSession";
import { buildLegacyRequest } from "@lib/buildLegacyCtx";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function MentorDashboardPage() {
  const session = await getServerSession({
    req: buildLegacyRequest(await headers(), await cookies()),
  });

  if (!session?.user) {
    redirect("/auth/login?callbackUrl=/thotis/dashboard");
  }

  redirect("/thotis/dashboard");
}
