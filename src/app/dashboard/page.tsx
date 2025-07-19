// src/app/dashboard/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import DashboardLayout from "../../components/DashboardLayout";
import StudentDashboard from "@/components/StudentDashboard";
import AdminDashboard from "@/components/AdminDashboard";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/sign-in");
  }

  const userRole = session.user.role;

  return (
    <DashboardLayout>
      {userRole === "student" ? <StudentDashboard /> : <AdminDashboard />}
    </DashboardLayout>
  );
}
