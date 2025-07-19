// app/notifications/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import DashboardLayout from "../../components/DashboardLayout";
import NotificationsList from "@/components/NotificationsList";

export default async function NotificationsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/sign-in");

  return (
    <DashboardLayout>
      <NotificationsList />
    </DashboardLayout>
  );
}
