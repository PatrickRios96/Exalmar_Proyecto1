"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/client";
import { useAutoRefresh } from "@/lib/use-refresh";
import type { Product } from "@/lib/types";
import Icon from "../ui/Icon";
export default function ProductCatalog() {
  const [products, setProducts] = useState<Product[]>([]),
    [error, setError] = useState("");
  const load = useCallback(async () => {
    try {
      const data = await api<{ products: Product[] }>("/api/catalog");
      setProducts(data.products);
      setError("");
    } catch (err) {
      setError((err as Error).message);
    }
  }, []);
  useEffect(() => {
    void load();
  }, [load]);
  useAutoRefresh(load);
  return (
    <section className="section shell">
      <span className="eyebrow">CONOCE CADA PRODUCTO</span>
      <h2>Información a tu alcance.</h2>
      {error && (
        <p role="status">
          {error}{" "}
          <button className="small-button" onClick={load}>
            Reintentar
          </button>
        </p>
      )}
      <div className="live-products">
        {!products.length && !error && <p>Cargando productos…</p>}
        {products.map((p) => (
          <article className="catalog-card" key={p.id}>
            <div>
              <Icon
                name={
                  p.category === "directo"
                    ? "fish"
                    : p.id === "aceite"
                      ? "drop"
                      : "grain"
                }
              />
              <span>
                {p.category === "directo" ? "Congelados" : "Harina y aceite"}
              </span>
            </div>
            <h3>{p.name}</h3>
            <p>{p.description}</p>
            <details>
              <summary>Información adicional</summary>
              <p>{p.details}</p>
            </details>
            <Link href={"/soporte?producto=" + p.id}>
              Consultar o reportar producto
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
