import AdminPanel from "@/components/admin/AdminPanel";
export const metadata = {
  title: "Administración local",
  robots: { index: false, follow: false },
};
export default function Admin() {
  return <AdminPanel />;
}
