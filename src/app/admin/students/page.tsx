// src/app/admin/students/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import AdminStudentsTable from "../../../components/AdminStudentsTable"

export default async function AdminStudentsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/sign-in");
  if (session.user.role !== "admin") redirect("/dashboard");

  return (
    <DashboardLayout>
      <AdminStudentsTable />
    </DashboardLayout>
  );
}
