export function signalUpdate() {
  if (typeof window !== "undefined")
    window.dispatchEvent(new Event("exalmar-updates"));
}
export const formatDate = (value: string) =>
  new Intl.DateTimeFormat("es-PE", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Lima",
  }).format(new Date(value));
