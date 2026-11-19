import Link from "next/link";
export const metadata = {
  title: "Panel de demostración",
  robots: { index: false, follow: false },
};
export default function Login() {
  return (
    <section className="section shell">
      <h1>Panel local de demostración</h1>
      <p>
        Esta versión funciona sin servidor de datos y no requiere contraseña.
        Los cambios se guardan solo en este navegador.
      </p>
      <Link className="button blue" href="/admin">
        Abrir panel local
      </Link>
    </section>
  );
}
