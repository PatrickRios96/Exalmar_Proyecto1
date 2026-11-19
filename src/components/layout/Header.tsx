"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Icon from "../ui/Icon";
import { api } from "@/lib/client";
import type { Me } from "@/lib/types";
export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false),
    [admin, setAdmin] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    api<Me>("/api/me")
      .then((me) => setAdmin(me.admin))
      .catch(() => {});
  }, [pathname]);
  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  return (
    <>
      <a className="skip" href="#main">
        Saltar al contenido
      </a>
      <header className="header">
        <div className="shell nav">
          <Link href="/" aria-label="Exalmar, inicio">
            <img
              className="logo"
              src="/assets/exalmar-logo.png"
              width="261"
              height="84"
              alt="Pesquera Exalmar S.A.A."
            />
          </Link>
          <button
            ref={button}
            className="menu-toggle"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            aria-controls="navigation"
            onClick={() => setOpen(!open)}
          >
            <Icon name={open ? "close" : "menu"} />
          </button>
          <nav
            id="navigation"
            className={open ? "open" : ""}
            aria-label="Principal"
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                setOpen(false);
                button.current?.focus();
              }
            }}
          >
            {[
              ["/", "Inicio"],
              ["/nosotros", "Nosotros"],
              ["/faq", "FAQ"],
              ["/soporte", "Soporte"],
              ...(admin ? [["/admin", "Administración"]] : []),
            ].map(([href, text]) => (
              <Link
                href={href}
                key={href}
                aria-current={pathname === href ? "page" : undefined}
              >
                {text}
              </Link>
            ))}
          </nav>
          <Link className="nav-contact" href="/soporte">
            <Icon name="mail" />
            Hablemos
          </Link>
        </div>
      </header>
    </>
  );
}
