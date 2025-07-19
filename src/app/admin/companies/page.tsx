import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import AdminCompaniesManager from "@/components/AdminCompaniesManager";

export default async function AdminCompaniesPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/sign-in");
  }

  if (session.user.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <DashboardLayout>
      <AdminCompaniesManager />
    </DashboardLayout>
  );
}
