// app/applications/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import ApplicationsList from "@/components/ApplicationsList";

export default async function ApplicationsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/sign-in");

  return (
    <DashboardLayout>
      <ApplicationsList />
    </DashboardLayout>
  );
}
