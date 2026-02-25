"use client";

import AdminDashboard from "~/thotis/components/AdminDashboard";
import { MentorDashboard } from "~/thotis/components/MentorDashboard";
import { StudentDashboard } from "~/thotis/components/StudentDashboard";
import { trpc } from "@calcom/trpc/react";

interface ThotisDashboardRouterProps {
  userRole: string;
  userId: number;
  userEmail: string;
}

export function ThotisDashboardRouter({ userRole, userId, userEmail }: ThotisDashboardRouterProps) {
  const { data: profile, isLoading: isLoadingProfile } = trpc.thotis.profile.get.useQuery();

  if (isLoadingProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-emphasis" />
      </div>
    );
  }

  if (userRole === "ADMIN") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-10">
          <AdminDashboard />
        </div>
      </div>
    );
  }

  if (profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-10">
          <MentorDashboard userId={userId} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-10">
        <StudentDashboard email={userEmail} />
      </div>
    </div>
  );
}
