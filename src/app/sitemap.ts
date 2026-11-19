import { siteUrl } from "@/lib/site-url";
import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  return ["", "/nosotros", "/faq", "/soporte"].map((p) => ({ url: base + p }));
}
