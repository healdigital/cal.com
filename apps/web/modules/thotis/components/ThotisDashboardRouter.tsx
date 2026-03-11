"use client";

import type { ReactElement } from "react";
import { AdminDashboard } from "~/thotis/components/AdminDashboard";
import { MentorDashboard } from "~/thotis/components/MentorDashboard";
import { StudentDashboard } from "~/thotis/components/StudentDashboard";

interface ThotisDashboardRouterProps {
  hasMentorProfile: boolean;
  userRole: string;
  userId: number;
  userEmail: string;
}

export function ThotisDashboardRouter({
  hasMentorProfile,
  userRole,
  userId,
  userEmail,
}: ThotisDashboardRouterProps): ReactElement {
  if (userRole === "ADMIN") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-10">
          <AdminDashboard />
        </div>
      </div>
    );
  }

  if (hasMentorProfile) {
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
