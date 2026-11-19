import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "./globals.css";
import "./forms.css";
import "./next-ui.css";
export const metadata: Metadata = {
  title: { default: "Pesquera Exalmar", template: "%s | Pesquera Exalmar" },
  description: "Productos del mar, sostenibilidad y soporte de Exalmar.",
  icons: { icon: "/assets/exalmar-logo.png" },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
