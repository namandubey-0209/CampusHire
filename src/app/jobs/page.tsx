// app/jobs/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import DashboardLayout from "../../components/DashboardLayout";
import JobsList from "@/components/jobList";

export default async function JobsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/sign-in");
  }

  return (
    <DashboardLayout>
      <JobsList />
    </DashboardLayout>
  );
}
