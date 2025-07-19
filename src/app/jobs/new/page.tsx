// page to create a new job// app/jobs/new/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import DashboardLayout from "../../../components/DashboardLayout";
import CreateJobForm from "@/components/CreateJobForm";

export default async function NewJobPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/sign-in");
  }

  if (session.user.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <DashboardLayout>
      <CreateJobForm />
    </DashboardLayout>
  );
}
