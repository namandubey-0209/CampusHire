import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import AdminStudentDetail from "@/components/AdminStudentDetail";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function StudentPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/sign-in");
  if (session.user.role !== "admin") redirect("/dashboard");

  const { id } = await params;
  return (
    <DashboardLayout>
      <AdminStudentDetail studentId={id} />
    </DashboardLayout>
  );
}
