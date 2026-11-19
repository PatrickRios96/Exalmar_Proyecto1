import { PageHero } from "@/components/ui/Sections";
import SupportPortal from "@/components/support/SupportPortal";
export const metadata = { title: "Soporte y reportes" };
export default async function Support({
  searchParams,
}: {
  searchParams: Promise<{ producto?: string }>;
}) {
  const params = await searchParams;
  return (
    <>
      <PageHero
        tag="Soporte"
        title="Tu producto. Tu reporte."
        description="Registra observaciones de calidad y solicita datos adicionales. Consulta el seguimiento desde este mismo portal."
      />
      <SupportPortal initialProduct={params.producto || ""} />
    </>
  );
}
