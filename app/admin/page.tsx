import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminLogin from "@/components/admin/AdminLogin";
import { isAuthenticated } from "@/lib/auth";
import { readResume } from "@/lib/resume";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const authed = await isAuthenticated();
  if (!authed) {
    return <AdminLogin />;
  }
  const data = readResume();
  return <AdminDashboard initial={data} />;
}
