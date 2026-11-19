# Exalmar · Next.js sin base de datos

Versión 2.0.0: sitio estático en Next.js, listo para localhost y Vercel. No utiliza Turso, SQLite, API, migraciones, contraseñas ni variables obligatorias.

## Si ya tienes la versión anterior

No copies únicamente encima: pueden quedar las rutas antiguas que exigían Turso. En el ZIP se incluye `ACTUALIZAR_SIN_BASE.mjs`, junto a la carpeta `exalmar-nextjs`.

1. Extrae el ZIP en una carpeta aparte, diferente de tu proyecto actual.
2. Abre una terminal en esa carpeta extraída, donde está el actualizador.
3. Ejecuta:

```powershell
node .\ACTUALIZAR_SIN_BASE.mjs "C:\Users\LENOVO\Desktop\exalmar-nextjs"
```

El actualizador crea un respaldo de los archivos que sustituye en una carpeta vecina. Conserva `.git`, los archivos de entorno locales y los antiguos datos locales. Sustituye `src/`, elimina las antiguas carpetas `scripts/` y `database/`, actualiza las pruebas y copia la nueva configuración.

Después vuelve a abrir tu proyecto habitual y ejecuta:

```powershell
cd "C:\Users\LENOVO\Desktop\exalmar-nextjs"
npm.cmd install
npm.cmd run build
```

Para subir los cambios a tu repositorio:

```powershell
git add -A
git commit -m "Eliminar base de datos y preparar despliegue estatico"
git push origin main
```

Si prefieres actualizar manualmente, conserva `.git` y sustituye por completo las carpetas `src/` y `tests/` por las nuevas. Elimina `scripts/` y `database/` de la versión anterior y reemplaza `package.json`, `package-lock.json`, `next.config.ts`, `tsconfig.json`, `vercel.json`, `.gitignore`, `.env.example` y `README.md`. No hace falta borrar tus archivos de datos anteriores.

## Ejecutar en localhost desde una carpeta nueva

Requiere Node.js 24 LTS y npm. Dentro de `exalmar-nextjs`, donde está `package.json`:

```powershell
npm.cmd install
npm.cmd run dev
```

Abre http://localhost:3000. En macOS/Linux puedes utilizar `npm` en lugar de `npm.cmd`.

## Funcionamiento sin base

- Inicio, Nosotros, FAQ, Soporte y `/admin` son páginas estáticas.
- El formulario guarda solicitudes en `localStorage` del navegador.
- El panel `/admin` permite probar estados, respuestas y edición del catálogo.
- Los cambios aparecen en Inicio y Soporte del mismo navegador y dominio, incluso en otras pestañas.
- No se comparten solicitudes ni modificaciones con otros visitantes o dispositivos.
- Cambiar de localhost al dominio Vercel crea otro espacio de almacenamiento.
- Borrar los datos del navegador elimina estos registros locales.
- `/admin` es una demostración sin autenticación. No gestiona datos centralizados ni modifica el contenido publicado para otros visitantes.
- El formulario no envía solicitudes ni correos a Exalmar. `prios@exalmar.com.pe` permanece disponible como contacto directo.

Estos límites también se indican en la interfaz.

## Desplegar en Vercel

Configuración incluida:

| Ajuste                 | Valor         |
| ---------------------- | ------------- |
| Framework              | Next.js       |
| Node.js                | 24.x          |
| Install Command        | npm install   |
| Build Command          | npm run build |
| Output Directory       | out           |
| Variables obligatorias | Ninguna       |

`vercel.json` ya contiene el comando de compilación y el directorio de salida. Si en el panel de Vercel habías configurado valores manuales, verifica que coincidan con estos.

El comando anterior `npm run vercel-build` también funciona: ahora solo ejecuta `next build`, sin comprobaciones de credenciales ni migraciones.

Después de actualizar GitHub, Vercel puede desplegar el nuevo commit automáticamente. También puedes pulsar Redeploy para el commit actualizado. Repetir el despliegue del commit antiguo conserva el error anterior.

Las variables antiguas `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` y `SESSION_SECRET` ya no se usan. No necesitas configurarlas para publicar esta versión.

Opcionalmente, define `NEXT_PUBLIC_SITE_URL` si utilizas un dominio propio. Si no existe, el sitemap usa el dominio productivo proporcionado por Vercel.

## Estructura

| Ruta                       | Responsabilidad                              |
| -------------------------- | -------------------------------------------- |
| `src/app/`                 | Páginas y estilos de Next.js                 |
| `src/components/`          | Componentes de interfaz por módulo           |
| `src/content/`             | Información institucional y catálogo inicial |
| `src/lib/browser-store.ts` | Lectura y guardado local en el navegador     |
| `src/lib/validation.ts`    | Validación del formulario y ediciones        |
| `src/lib/use-refresh.ts`   | Actualización entre pestañas y componentes   |
| `public/assets/`           | Logo y fotografías                           |
| `tests/`                   | Pruebas del almacenamiento local             |
| `next.config.ts`           | Exportación estática                         |
| `vercel.json`              | Configuración de despliegue                  |

## Verificación

```powershell
npm.cmd test
npm.cmd run build
npm.cmd run typecheck
```

La compilación genera `out/`. Las pruebas verifican guardado, actualización de reportes, modificación de productos, rechazo de ediciones obsoletas y errores de almacenamiento bloqueado o dañado.

Se comprobó `npm run vercel-build` con `VERCEL=1` y sin variables de base de datos. No se realizó ningún cambio directamente en tu repositorio de GitHub ni en tu cuenta de Vercel; debes subir los archivos actualizados.

## Referencia institucional

https://www.exalmar.com.pe/
