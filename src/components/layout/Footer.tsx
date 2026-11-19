import Link from "next/link";
export default function Footer() {
  return (
    <footer>
      <div className="shell footer-grid">
        <div>
          <Link href="/" aria-label="Exalmar, inicio">
            <img
              className="footer-logo"
              src="/assets/exalmar-logo.png"
              width="261"
              height="84"
              alt="Pesquera Exalmar"
            />
          </Link>
          <p>
            Conectados con el mar.
            <br />
            Comprometidos con el futuro.
          </p>
        </div>
        <div>
          <h2>Explora Exalmar</h2>
          <Link href="/">Inicio</Link>
          <Link href="/nosotros">Nosotros</Link>
          <Link href="/faq">Preguntas frecuentes</Link>
        </div>
        <div>
          <h2>Estamos para ayudarte</h2>
          <Link href="/soporte">Centro de soporte</Link>
          <a href="mailto:prios@exalmar.com.pe">prios@exalmar.com.pe</a>
          <Link href="/admin">Administración</Link>
          <span>Perú</span>
        </div>
        <div>
          <h2>Información institucional</h2>
          <p>
            Contenido elaborado con referencia al sitio oficial de Pesquera
            Exalmar.
          </p>
          <a
            className="source-link"
            href="https://www.exalmar.com.pe/"
            target="_blank"
            rel="noopener noreferrer"
          >
            www.exalmar.com.pe
          </a>
        </div>
      </div>
      <div className="shell footer-bottom">
        <span>© {new Date().getFullYear()} Pesquera Exalmar S.A.A.</span>
        <span>
          <a
            href="https://www.exalmar.com.pe/politica-de-privacidad/"
            target="_blank"
            rel="noopener"
          >
            Privacidad
          </a>{" "}
          · El mar nos une.
        </span>
      </div>
    </footer>
  );
}
