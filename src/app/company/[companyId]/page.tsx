// src/app/company/[companyId]/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import DashboardLayout from "../../../components/DashboardLayout";
import CompanyDetail from "../../../components/CompanyDetail";

interface Props {
  params: Promise<{ companyId: string }>;
}

export default async function CompanyPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/sign-in");

  const { companyId } = await params;  

  return (
    <DashboardLayout>
      <CompanyDetail companyId={companyId} />
    </DashboardLayout>
  );
}
