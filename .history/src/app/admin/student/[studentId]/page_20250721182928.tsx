// app/student/profile/[studentId]/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import StudentProfile from "@/components/StudentProfile";

interface PageProps {
  params: Promise<{
    studentId: string;
  }>;
}

export default async function ProfilePage({ params }: PageProps) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/sign-in");

  const { studentId } = await params;

  return (
    <DashboardLayout>
      <StudentProfile userId={studentId} editable={false} />
    </DashboardLayout>
  );
}
