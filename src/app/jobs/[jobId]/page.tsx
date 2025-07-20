import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import DashboardLayout from "../../../components/DashboardLayout";
import JobDetail from "@/components/JobDetail";

interface Props {
  params: Promise<{ jobId: string }>; // ← Changed to Promise
}

export default async function JobDetailPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/sign-in");
  }

  const { jobId } = await params; // ← Await params before accessing properties

  return (
    <DashboardLayout>
      <JobDetail jobId={jobId} />
    </DashboardLayout>
  );
}
