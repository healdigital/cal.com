"use client";

import type { MentorProfileDto } from "@calcom/lib/dto/thotis/ThotisApiSchemas";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import classNames from "@calcom/ui/classNames";
import { UserAvatar } from "@calcom/ui/components/avatar";
import { Button } from "@calcom/ui/components/button";
import { Icon } from "@calcom/ui/components/icon";
import { useMemo } from "react";

export type StudentProfileWithUser = MentorProfileDto;

export type ProfileCardProps = {
  student: StudentProfileWithUser;
  onBookSession?: () => void;
  showBookButton?: boolean;
  className?: string;
};

export const ProfileCard = ({
  student,
  onBookSession,
  showBookButton = true,
  className,
}: ProfileCardProps) => {
  const { t } = useLocale();
  const { user } = student;
  const rating = Number(student.averageRating) ?? 0;
  const totalRatings = student.totalRatings ?? 0;

  // Format ratings to 1 decimal place if it has decimals
  const formattedRating = Number(rating).toFixed(1).replace(/\.0$/, "");

  const avatarUser = useMemo(() => {
    const org = user.profile?.organization ?? user.profiles?.[0]?.organization;
    const profile: { id: null; username: string; organizationId: null; organization: null } = {
      id: null,
      username: user.username ?? "",
      organizationId: null,
      organization: null,
    };
    return {
      name: user.name,
      username: user.username,
      avatarUrl: user.avatarUrl ?? null,
      profile: org
        ? {
            id: 0,
            username: user.username ?? "",
            organizationId: org.id,
            organization: {
              id: org.id,
              slug: org.slug,
              name: org.slug || "",
              requestedSlug: null as string | null,
              calVideoLogo: null as string | null,
              bannerUrl: null as string | null,
              logoUrl: org.logoUrl ?? undefined,
            },
          }
        : profile,
    };
  }, [user]);

  return (
    <div
      className={classNames(
        "bg-default group border-subtle relative flex w-full flex-col overflow-hidden rounded-md border p-5 transition-shadow hover:shadow-md",
        className
      )}
      data-testid="mentor-card">
      <div className="mb-4 flex items-start justify-between">
        <UserAvatar size="lg" user={avatarUser} className="h-16 w-16" />
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-1.5 rounded-full bg-green-50 px-2 py-1 dark:bg-green-900/20">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-xs font-medium text-green-700 dark:text-green-400">
              {t("thotis_available")}
            </span>
          </div>
          {student.matchScore !== undefined && (
            <div className="flex items-center gap-1.5 rounded-full bg-blue-50 px-2 py-1 dark:bg-blue-900/20">
              <Icon name="sparkles" className="h-3 w-3 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-bold text-blue-700 dark:text-blue-400">
                {student.matchScore}% {t("thotis_match")}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="mb-1">
        <h3 className="text-emphasis text-lg font-semibold leading-tight">
          {user.name || t("thotis_mentor")}
        </h3>
      </div>

      <div className="mb-3 flex flex-wrap gap-2 text-sm text-subtle">
        {student.university && (
          <div className="flex items-center gap-1">
            <Icon name="building" className="h-4 w-4 shrink-0" />
            <span className="truncate">{student.university}</span>
          </div>
        )}
        {student.currentYear && (
          <span className="text-subtle/50">• {t("thotis_year", { count: student.currentYear })}</span>
        )}
      </div>

      {student.degree && <div className="mb-3 text-sm text-subtle">{student.degree}</div>}

      {student.bio && <p className="text-default mb-4 line-clamp-3 text-sm leading-relaxed">{student.bio}</p>}

      <div className="mt-auto flex items-center justify-between pt-2">
        <div className="flex items-center gap-1">
          <Icon name="star" className="h-4 w-4 fill-orange-400 text-orange-400" />
          <span className="text-emphasis text-sm font-medium">{formattedRating}</span>
          <span className="text-subtle text-sm">({totalRatings})</span>
        </div>

        {showBookButton && (
          <Button color="primary" size="sm" onClick={onBookSession} EndIcon="arrow-right">
            {t("thotis_book_session")}
          </Button>
        )}
      </div>
    </div>
  );
};
