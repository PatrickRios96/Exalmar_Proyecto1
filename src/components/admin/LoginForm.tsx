"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/client";
export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    const data = Object.fromEntries(new FormData(event.currentTarget));
    try {
      await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      });
      router.replace("/admin");
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="section shell">
      <form className="login-card" onSubmit={submit}>
        <span className="eyebrow">ADMINISTRACIÓN</span>
        <h1>Ingresa al panel.</h1>
        <p>Gestiona solicitudes y actualiza los productos de Exalmar.</p>
        <label>
          Correo de administración
          <input name="email" type="email" autoComplete="username" required />
        </label>
        <label>
          Contraseña
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </label>
        <button className="button blue" disabled={busy}>
          {busy ? "Ingresando…" : "Ingresar"}
        </button>
        <p role="alert" className="status-error">
          {error}
        </p>
      </form>
    </section>
  );
}
