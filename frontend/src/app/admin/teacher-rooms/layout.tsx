"use client";

import AdminLayout from "../../../components/admin/AdminLayout";
import AuthGuard from "../AuthGuard";

export default function TeacherRoomsLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <AdminLayout>
        {children}
      </AdminLayout>
    </AuthGuard>
  );
}
