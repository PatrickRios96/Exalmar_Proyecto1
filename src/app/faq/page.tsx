import { PageHero } from "@/components/ui/Sections";
import FAQList from "@/components/faq/FAQList";
export const metadata = { title: "Preguntas frecuentes" };
export default function FAQ() {
  return (
    <>
      <PageHero
        tag="FAQ"
        title={
          <>
            Respuestas claras.
            <br />
            Todo más sencillo.
          </>
        }
        description="Encuentra información sobre Exalmar, sus productos, sostenibilidad y los canales de ayuda."
      />
      <FAQList />
    </>
  );
}
