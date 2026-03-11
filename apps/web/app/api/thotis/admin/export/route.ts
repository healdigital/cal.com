import { getServerSession } from "@calcom/features/auth/lib/getServerSession";
import { generateCSV, type Mentor } from "@calcom/features/thotis/components/AdminDashboardUtils";
import { AdminAuditLogRepository } from "@calcom/features/thotis/repositories/AdminAuditLogRepository";
import { UserPermissionRole } from "@calcom/prisma/enums";
import { profileService } from "@calcom/trpc/server/routers/thotis/_shared";
import { buildLegacyRequest } from "@lib/buildLegacyCtx";
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";

const EXPORT_PAGE_SIZE = 500;

async function getAllAmbassadorRows(): Promise<
  Awaited<ReturnType<typeof profileService.searchProfiles>>["profiles"]
> {
  const profiles: Awaited<ReturnType<typeof profileService.searchProfiles>>["profiles"] = [];
  let page = 1;
  let total = 0;

  do {
    const result = await profileService.searchProfiles({
      page,
      pageSize: EXPORT_PAGE_SIZE,
    });

    profiles.push(...result.profiles);
    total = result.total;
    page += 1;
  } while (profiles.length < total);

  return profiles;
}

export async function GET(): Promise<Response> {
  const session = await getServerSession({
    req: buildLegacyRequest(await headers(), await cookies()),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user?.role !== UserPermissionRole.ADMIN) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const profiles = await getAllAmbassadorRows();
    const mentors: Mentor[] = profiles.map((profile) => ({
      averageRating: profile.averageRating,
      cancelledSessions: profile.cancelledSessions,
      completedSessions: profile.completedSessions,
      field: profile.field,
      id: profile.id,
      totalSessions: profile.totalSessions,
      university: profile.university,
    }));

    const csv = generateCSV(mentors);
    const auditLogRepository = new AdminAuditLogRepository();

    await auditLogRepository.createLog({
      action: "CSV_EXPORTED",
      adminUserEmail: session.user.email,
      adminUserId: session.user.id,
      adminUserName: session.user.name,
      metadata: {
        mentorCount: mentors.length,
      },
      resourceDisplayName: "Thotis platform stats",
      resourceId: "thotis-platform-stats",
      resourceType: "PLATFORM",
    });

    return new Response(csv, {
      headers: {
        "Cache-Control": "no-store",
        "Content-Disposition": 'attachment; filename="thotis_platform_stats.csv"',
        "Content-Type": "text/csv; charset=utf-8",
      },
      status: 200,
    });
  } catch (error) {
    console.error("Failed to export Thotis ambassador CSV:", error);
    return NextResponse.json({ error: "Failed to export CSV" }, { status: 500 });
  }
}
