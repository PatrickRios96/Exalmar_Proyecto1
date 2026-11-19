import { PageHero } from "@/components/ui/Sections";
import SupportPortal from "@/components/support/SupportPortal";
export const metadata = { title: "Soporte y reportes" };
export default function Support() {
  return (
    <>
      <PageHero
        tag="Soporte"
        title="Tu producto. Tu reporte."
        description="Prueba el formulario y el seguimiento local. Los registros de esta demostración se guardan en tu navegador."
      />
      <SupportPortal />
    </>
  );
}
