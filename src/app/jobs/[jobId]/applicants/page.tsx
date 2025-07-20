// app/jobs/[jobId]/applicants/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import DashboardLayout from "../../../../components/DashboardLayout";
import JobApplicants from "@/components/JobApplicants";

interface Props {
  params: Promise<{ jobId: string }>; // ← Changed to Promise
}

export default async function JobApplicantsPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/sign-in");
  }

  if (session.user.role !== "admin") {
    redirect("/dashboard");
  }

  const { jobId } = await params; // ← Await params before accessing properties

  return (
    <DashboardLayout>
      <JobApplicants jobId={jobId} />
    </DashboardLayout>
  );
}
