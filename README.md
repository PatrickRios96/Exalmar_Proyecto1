# Exalmar · Next.js

Proyecto completo en **Next.js 16.4.6, React y TypeScript**, preparado para ejecutar en localhost y desplegar manualmente en Vercel. Incluye Inicio, Nosotros, FAQ, Soporte y administración en `/admin`.

## 1. Arranque local

Instala Node.js 22 LTS (22.13 o superior) o Node.js 24 LTS. npm viene incluido.

Extrae el ZIP y abre una terminal dentro de `exalmar-nextjs`, donde está `package.json`.

```bash
npm install
npm run dev
```

Abre **http://localhost:3000**.

En el primer arranque se crean automáticamente:

- `.env.local`, con una clave aleatoria de administración y un secreto de sesión.
- `data/exalmar.db`, la base SQLite para las pruebas locales.
- Las tablas de reportes, catálogo y control de intentos de ingreso.

No necesitas instalar MySQL, PostgreSQL, Docker ni crear cuentas externas para probar localmente.

Para detener el servidor, pulsa **Ctrl+C** en la terminal.

### Administración local

Abre **http://localhost:3000/admin**. El portal te dirigirá a la pantalla de ingreso.

El correo inicial es `admin@exalmar.local`. La contraseña se genera en el primer arranque y aparece en la terminal. Para consultarla otra vez, abre otra terminal en el proyecto:

```bash
npm run admin:info
```

Puedes cambiar `ADMIN_EMAIL` y `ADMIN_PASSWORD` en `.env.local`; reinicia el servidor después. La contraseña debe tener al menos 16 caracteres. Este usuario local no es una cuenta corporativa real.

### Si el puerto 3000 está ocupado

```bash
npm run dev -- --port 3001
```

En ese caso abre http://localhost:3001. Utiliza siempre la misma dirección (localhost o 127.0.0.1) para conservar el historial del navegador.

## 2. Qué probar

1. En `/soporte`, elige un producto y registra un reporte de calidad o una consulta sobre información adicional.
2. Comprueba el código y el registro en **Mis solicitudes**.
3. Ingresa a `/admin`, abre el reporte con **Gestionar**, cambia su estado y escribe una respuesta.
4. Vuelve a Soporte: el seguimiento se actualiza automáticamente, como máximo a los 15 segundos o al recuperar el foco.
5. En Administración, abre **Información de productos**, modifica la descripción o los datos adicionales y guarda.
6. Revisa el cambio en Inicio y en el formulario de Soporte.
7. Detén y vuelve a iniciar el servidor. Los datos continúan en `data/exalmar.db`.

Las solicitudes se vinculan a una cookie firmada de este navegador. Otro navegador no muestra ese historial. No hay registro de cuentas para los solicitantes. La administración puede ver las solicitudes de todos los navegadores.

Si eliminas las cookies, cambias el secreto de sesión o pasas de localhost a otro dominio, el historial anterior deja de asociarse a ese navegador, pero los registros siguen disponibles para la administración. La cookie de visitante dura 30 días y la sesión administrativa 8 horas.

El correo `prios@exalmar.com.pe` permanece como canal de contacto. **No se envían correos automáticos**; el estado y las respuestas se consultan en el portal.

## 3. Organización del código

| Carpeta o archivo           | Responsabilidad                                                        |
| --------------------------- | ---------------------------------------------------------------------- |
| `src/app/page.tsx`          | Inicio                                                                 |
| `src/app/nosotros/page.tsx` | Contenido institucional                                                |
| `src/app/faq/page.tsx`      | Preguntas frecuentes                                                   |
| `src/app/soporte/page.tsx`  | Formulario y seguimiento                                               |
| `src/app/admin/`            | Panel protegido y pantalla de ingreso                                  |
| `src/app/api/`              | Rutas HTTP de reportes, catálogo, sesiones y administración            |
| `src/components/layout/`    | Header y Footer compartidos                                            |
| `src/components/home/`      | Pilares de sostenibilidad                                              |
| `src/components/products/`  | Catálogo actualizado desde la base                                     |
| `src/components/support/`   | Formulario y solicitudes del visitante                                 |
| `src/components/admin/`     | Ingreso, gestión de solicitudes y edición de productos                 |
| `src/components/faq/`       | Búsqueda y filtros de preguntas                                        |
| `src/components/ui/`        | Iconos y secciones reutilizables                                       |
| `src/content/`              | Contenido institucional y productos iniciales                          |
| `src/lib/`                  | Base de datos, validación, cookies firmadas y actualización automática |
| `public/assets/`            | Logo y fotografías                                                     |
| `database/`                 | Migraciones SQL versionadas                                            |
| `scripts/`                  | Preparación local y migraciones                                        |
| `tests/`                    | Pruebas unitarias y recorrido HTTP local                               |
| `.env.example`              | Nombres de variables de configuración                                  |
| `next.config.ts`            | Configuración de Next.js                                               |
| `vercel.json`               | Compilación para Vercel                                                |

Toda la interfaz utiliza componentes React/TSX. No depende de Vinext, Cloudflare D1, herramientas de ChatGPT ni autenticación de ChatGPT.

## 4. Comandos

| Comando                    | Uso                                                                                |
| -------------------------- | ---------------------------------------------------------------------------------- |
| `npm run dev`              | Prepara el entorno local y arranca Next.js                                         |
| `npm run build`            | Compila la aplicación para producción                                              |
| `npm start`                | Ejecuta una compilación existente                                                  |
| `npm run admin:info`       | Muestra las credenciales del entorno local                                         |
| `npm run typecheck`        | Comprueba TypeScript                                                               |
| `npm test`                 | Prueba validaciones y firmas de sesión                                             |
| `npm run test:local`       | Prueba el recorrido HTTP contra un servidor local ya iniciado                      |
| `npm run test:integration` | Prepara datos locales y levanta un servidor temporal para probar el recorrido HTTP |
| `npm run db:migrate`       | Aplica migraciones a la base indicada por las variables de entorno                 |
| `npm run db:migrate:local` | Aplica migraciones exclusivamente a la base SQLite local                           |
| `npm run vercel-build`     | Comprueba configuración de Vercel, migra la base remota y compila                  |

Para `test:local`, mantén `npm run dev` abierto en otra terminal. Las pruebas de integración solo aceptan localhost y una base `file:`; agregan solicitudes de prueba al entorno local. El paquete descargable no contiene esos datos.

Las migraciones ya aplicadas no se deben editar. Para cambios futuros, agrega un nuevo archivo SQL numerado en `database/`.

## 5. Despliegue manual en Vercel

### Base de datos persistente

SQLite local funciona para las pruebas. En Vercel debes usar una base remota **Turso/libSQL**, porque el disco local de una función no conserva la base entre despliegues e instancias.

Crea una base Turso y consigue:

- `TURSO_DATABASE_URL`, por ejemplo `libsql://NOMBRE-DE-TU-BASE.turso.io`.
- `TURSO_AUTH_TOKEN`, el token de acceso a esa base.

Puedes utilizar el panel de Turso o su integración en Vercel Marketplace. Revisa el plan y los límites vigentes de la base antes de contratarla.

Los datos de localhost y los de Vercel son independientes. Este proyecto crea la estructura remota, pero no copia los reportes de prueba locales a producción.

### Variables de producción

Configura estas variables en Vercel, nunca en archivos públicos ni en `NEXT_PUBLIC_*` salvo la dirección del sitio:

| Variable               | Valor para Vercel                                               |
| ---------------------- | --------------------------------------------------------------- |
| `TURSO_DATABASE_URL`   | URL remota de Turso, nunca `file:`                              |
| `TURSO_AUTH_TOKEN`     | Token de la base remota                                         |
| `ADMIN_EMAIL`          | Correo que usarás para entrar a `/admin`                        |
| `ADMIN_PASSWORD`       | Contraseña única, mínimo 16 caracteres                          |
| `SESSION_SECRET`       | Secreto aleatorio, mínimo 32 caracteres                         |
| `NEXT_PUBLIC_SITE_URL` | Opcional: dirección definitiva `https://TU-PROYECTO.vercel.app` |

Genera un secreto nuevo para producción desde la terminal:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

Si no defines `NEXT_PUBLIC_SITE_URL`, el sitemap utiliza el dominio productivo que Vercel expone al proyecto. Para un dominio personalizado, configura esa variable con la dirección correspondiente y vuelve a desplegar.

### Opción A: desde GitHub y el panel de Vercel

1. Crea un repositorio con el contenido de `exalmar-nextjs`; `package.json` debe quedar en la raíz del repositorio.
2. No subas `.env.local`, `data/`, `node_modules/`, `.next/` ni contraseñas. `.gitignore` ya los excluye.
3. En Vercel, crea un proyecto e importa ese repositorio.
4. Selecciona **Next.js**. Si subiste una carpeta contenedora, ajusta **Root Directory** a la carpeta que contiene `package.json`.
5. Antes de desplegar, agrega las variables anteriores en **Environment Variables**. Usa los valores de producción.
6. La configuración incluida ejecuta `npm run vercel-build`. No establezcas un directorio de salida estático.
7. Despliega. El proceso aplica las migraciones SQL a Turso y compila Next.js.
8. Abre la dirección `*.vercel.app` asignada y prueba `/soporte` y `/admin` con las credenciales de producción.

Si necesitas crear el proyecto antes de conectar la base desde Marketplace, agrega la integración y las variables después y ejecuta **Redeploy** cuando estén listas.

### Opción B: manual desde la terminal, sin GitHub

Dentro de la carpeta del proyecto:

```bash
npx vercel login
npx vercel link
```

Luego configura las variables desde el panel de Vercel, o de manera interactiva:

```bash
npx vercel env add TURSO_DATABASE_URL production
npx vercel env add TURSO_AUTH_TOKEN production
npx vercel env add ADMIN_EMAIL production
npx vercel env add ADMIN_PASSWORD production
npx vercel env add SESSION_SECRET production
```

Cada comando solicita su valor. No pegues secretos en el código ni los incluyas en capturas o repositorios.

Publica con:

```bash
npx vercel --prod
```

Para desplegar una versión de prueba de Vercel, configura también variables para **Preview**, preferiblemente con otra base de datos de prueba. Los reportes de Preview y producción no deben mezclarse accidentalmente.

### Dirección gratuita y plan de alojamiento

Vercel asigna una dirección terminada en `.vercel.app`. No necesitas comprar un dominio propio para utilizarla.

El dominio asignado no significa que todo uso de Vercel sea gratuito. **Hobby está limitado a uso personal no comercial**; para la operación corporativa de Exalmar corresponde revisar un plan empresarial compatible. Este paquete no contrata planes ni crea recursos en tu cuenta.

## 6. Verificaciones realizadas

- Compilación real con `next build`.
- Validación TypeScript.
- Pruebas de formularios, estados, fechas y firma de cookies.
- Recorrido HTTP local: ingreso al panel, guardado SQLite, aislamiento del historial, respuesta administrativa, actualización del catálogo, rechazo de versiones obsoletas y cierre de sesión.

No se ha realizado el despliegue en tu cuenta Vercel ni configurado una base remota. La validación local no sustituye la comprobación de esas variables al desplegar.

## 7. Referencias

- Sitio institucional de referencia: https://www.exalmar.com.pe/
- Next.js, instalación: https://nextjs.org/docs/app/getting-started/installation
- Vercel, dominio asignado: https://vercel.com/docs/domains/working-with-domains
- Vercel, plan Hobby: https://vercel.com/docs/plans/hobby
- Turso en Vercel: https://vercel.com/marketplace/tursocloud/database
- Cliente libSQL: https://tursodatabase.github.io/libsql-client-ts/
