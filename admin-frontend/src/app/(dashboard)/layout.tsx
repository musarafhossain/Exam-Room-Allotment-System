"use client";

import AdminLayout from "../../components/admin/AdminLayout";
import AuthGuard from "../AuthGuard";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <AdminLayout>
        {children}
      </AdminLayout>
    </AuthGuard>
  );
}
