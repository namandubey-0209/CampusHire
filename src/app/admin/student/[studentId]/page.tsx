// app/student/profile/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import DashboardLayout from "../../../../components/DashboardLayout";
import StudentProfile from "@/components/StudentProfile";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/sign-in");

  return (
    <DashboardLayout>
      <StudentProfile userId={session.user._id as string} editable />
    </DashboardLayout>
  );
}
