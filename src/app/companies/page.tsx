// app/companies/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import DashboardLayout from "../../components/DashboardLayout";
import CompaniesList from "@/components/CompaniesList";

export default async function CompaniesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/sign-in");

  return (
    <DashboardLayout>
      <CompaniesList />
    </DashboardLayout>
  );
}
