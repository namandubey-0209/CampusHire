import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import DashboardLayout from "../../../components/DashboardLayout";
import JobDetail from "@/components/JobDetail";

interface Props {
  params: { jobId: string };
}

export default async function JobDetailPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/sign-in");
  }

  return (
    <DashboardLayout>
      <JobDetail jobId={params.jobId} />
    </DashboardLayout>
  );
}
