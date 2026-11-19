import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import LoginForm from "@/components/admin/LoginForm";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Ingreso de administración",
  robots: { index: false, follow: false },
};
export default async function Login() {
  if (await isAdmin()) redirect("/admin");
  return <LoginForm />;
}
