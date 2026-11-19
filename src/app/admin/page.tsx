import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import AdminPanel from "@/components/admin/AdminPanel";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Administración",
  robots: { index: false, follow: false },
};
export default async function Admin() {
  if (!(await isAdmin())) redirect("/admin/login");
  return <AdminPanel />;
}
