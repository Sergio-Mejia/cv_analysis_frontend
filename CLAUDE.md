# CLAUDE.md

Guía de trabajo para este repositorio. Léela completa antes de escribir o modificar código.

---

## 1. Contexto del proyecto

Aplicación web que **analiza hojas de vida (CV) usando inteligencia artificial**.

Flujo principal:

1. El usuario sube uno o varios archivos (CV en PDF/imagen).
2. El **backend** procesa el archivo y devuelve un análisis estructurado.
3. El frontend recibe ese resultado y lo usa para **prellenar un formulario** que el usuario puede revisar, editar y confirmar.

El frontend (este repo) es responsable de: carga de archivos, orquestación del estado de análisis, presentación de resultados y el formulario final. **No** ejecuta la inferencia de IA; eso vive en el backend.

---

## 2. Stack tecnológico

- **Framework:** Next.js (App Router) + React
- **Lenguaje:** TypeScript (modo estricto)
- **Componentes:** shadcn/ui (sobre Radix)
- **Estilos:** Tailwind CSS
- **Formularios:** TanStack Form (`@tanstack/react-form`)
- **Validación:** Zod (vía Standard Schema adapter de TanStack Form) — *si no lo quieres, quítalo y usa validadores nativos de TanStack Form*
- **Gestor de paquetes:** **pnpm** (obligatorio — no usar npm ni yarn)

---

## 3. Reglas de TypeScript (no negociables)

- **`strict: true`** siempre. No relajar el `tsconfig`.
- **Prohibido `any`.** Si no conoces el tipo, usa `unknown` y haz *narrowing* explícito, o define la interfaz correcta.
- **Todo dato con forma propia se modela con `interface`** (props de componentes, respuestas de API, entidades de dominio, estado de hooks).
  - Usa `type` solo para uniones, intersecciones, utilitarios o alias de primitivos.
- **Nunca tipar props inline con objetos anónimos.** Extrae una `interface` con nombre (`interface CvUploadProps { ... }`).
- Preferir tipos derivados a duplicar: `Pick`, `Omit`, `ReturnType`, etc.
- Los datos que cruzan el límite con el backend se **validan en runtime** (Zod) y el tipo de TS se **infiere del schema** (`z.infer`), para que tipo y validación no se desincronicen.
- Nada de imports con extensión, nada de `// @ts-ignore` (si es inevitable, usar `// @ts-expect-error` con comentario justificando).

---

## 4. Estructura de archivos

Organización **por features** dentro de `src/`. Lo compartido vive en carpetas transversales; lo específico de una feature vive junto a la feature.

```
src/
├── app/                         # App Router: rutas, layouts, route handlers
│   ├── layout.tsx
│   ├── page.tsx
│   └── analyze/
│       └── page.tsx
│
├── components/
│   ├── ui/                      # shadcn/ui (generado por el CLI, no editar a mano salvo necesidad)
│   └── common/                  # componentes compartidos entre features (Header, Spinner, etc.)
│
├── features/
│   └── cv-analysis/             # todo lo de la feature vive aquí
│       ├── components/          # CvUpload, AnalysisResult, CvForm, campos, etc.
│       ├── hooks/               # useCvAnalysis (máquina de estados del flujo)
│       ├── services/            # llamadas al backend de esta feature
│       ├── schemas/             # schemas Zod + tipos inferidos
│       └── types/               # interfaces propias de la feature
│
├── hooks/                       # hooks reutilizables globales
├── lib/                         # utilidades puras y sin estado (cn, formatters, apiClient)
├── services/                    # cliente HTTP base y config de API
├── types/                       # tipos globales/compartidos (ApiResponse<T>, etc.)
├── config/                      # constantes, env, endpoints
└── styles/                      # globals.css
```

Convenciones de la estructura:

- Si algo se usa **solo dentro de una feature**, va dentro de `features/<feature>/`. No lo subas a global "por si acaso".
- Si algo se usa en **dos o más features**, promuévelo a la carpeta transversal correspondiente (`components/common`, `hooks`, `lib`).
- Cada feature es autocontenida: se entiende leyendo solo su carpeta.

---

## 5. Convenciones de nombres

- **Archivos de componentes:** `kebab-case.tsx` → `cv-upload.tsx`. El componente exportado en `PascalCase` → `export function CvUpload()`.
- **Hooks:** `use-cv-analysis.ts` → `useCvAnalysis`.
- **Services:** `cv-analysis.service.ts`.
- **Schemas:** `cv-form.schema.ts`.
- **Types:** `cv.types.ts`, `api.types.ts`.
- **Interfaces de props:** `<Componente>Props` (ej. `AnalysisResultProps`).
- Un componente por archivo (subcomponentes privados pequeños pueden convivir si no se reutilizan fuera).
- **Named exports** por defecto. Evita `export default` salvo donde Next lo exige (`page.tsx`, `layout.tsx`).

---

## 6. Buenas prácticas de Next.js (App Router)

- **Server Components por defecto.** Marca `"use client"` solo cuando el componente necesite estado, efectos, listeners o APIs del navegador (la subida de archivos, TanStack Form y el resultado interactivo serán client components).
- Mantén los client components lo más **abajo posible** en el árbol; no conviertas una página entera en cliente por un botón.
- Data fetching desde Server Components cuando aplique; para interacción con el backend de análisis (que depende de acción del usuario) usa el service desde el client component / hook.
- Usa **Route Handlers** (`app/api/.../route.ts`) solo si necesitas un proxy hacia el backend (ocultar credenciales, evitar CORS). No dupliques lógica de negocio que ya vive en el backend.
- Nunca expongas secretos al cliente: variables sin prefijo `NEXT_PUBLIC_` solo se leen en el servidor.
- Aprovecha `loading.tsx` y `error.tsx` por segmento para estados de carga/error.
- Imágenes con `next/image`, navegación con `next/link`.

---

## 7. Componentes y estilos

- Instala shadcn con el CLI (`pnpm dlx shadcn@latest add <componente>`); no copies componentes a mano.
- **No** reescribas los componentes base de `components/ui/`. Para variantes, compón sobre ellos en `features/` o `components/common/`.
- Estilos **solo con Tailwind**. Nada de CSS-in-JS ni archivos `.module.css` salvo `globals.css`.
- Usa el helper `cn()` (de `lib/utils.ts`) para combinar clases condicionales; no concatenes strings a mano.
- **Mobile-first:** escribe primero el layout móvil y usa breakpoints (`sm:`, `md:`, `lg:`) para el progressive enhancement a desktop.
- Evita valores mágicos: usa tokens de Tailwind. Solo usa valores arbitrarios (`w-[347px]`) como último recurso.
- Accesibilidad: labels asociados a inputs, roles/aria correctos, foco visible.

---

## 8. Formularios con TanStack Form

- El formulario que recibe el resultado del análisis usa **TanStack Form**.
- Define el **schema Zod** de la HV como fuente de verdad y deriva el tipo con `z.infer`. Ese tipo tipa los valores del formulario.
- Prellena `defaultValues` con lo que devuelve el análisis; deja que el usuario edite antes de confirmar.
- Crea **field components tipados y reutilizables** (ej. `TextField`, `TextAreaField`, `SelectField`) en `features/cv-analysis/components/`, cada uno con su `interface` de props. No repitas boilerplate de `form.Field` en cada campo.
- Valida en `onChange`/`onBlur` según el campo; muestra errores accesibles.
- **No** uses la etiqueta HTML `<form>` con submit nativo si estás en un contexto de artifact/preview; en la app normal de Next sí puedes, manejando `onSubmit` con `preventDefault`.

---

## 9. Capa de servicios / API

- Toda llamada al backend pasa por un **service** (`*.service.ts`), nunca `fetch` suelto dentro de un componente.
- Centraliza el cliente HTTP base y la `baseURL` en `services/` + `config/`.
- Tipa **request y response** con interfaces. La respuesta se **valida con Zod** antes de usarse.
- Usa un contenedor de respuesta consistente, por ejemplo:
  ```ts
  interface ApiResponse<T> {
    data: T;
    error: string | null;
  }
  ```
- Maneja **cancelación** con `AbortController` (útil si el usuario reintenta la subida o navega fuera durante el análisis) y limpia en el `cleanup` del efecto.
- Maneja explícitamente estados de red: `idle | uploading | analyzing | success | error`. El hook `useCvAnalysis` expone esta máquina de estados.

---

## 10. Estado del flujo de análisis

El hook `useCvAnalysis` es el orquestador de la feature. Debe:

- Modelar el flujo como **máquina de estados explícita** (evitar múltiples booleanos sueltos como `isLoading`, `isError`... que producen estados imposibles).
- Exponer: estado actual, función para subir/analizar, resultado tipado, error y un `reset`.
- Manejar **race conditions**: si llega una respuesta de una subida anterior ya cancelada, ignórala.
- Limpiar recursos (AbortController, object URLs de archivos) al desmontar.

---

## 11. Comandos (pnpm)

```bash
pnpm install              # instalar dependencias
pnpm dev                  # entorno de desarrollo
pnpm build                # build de producción
pnpm start                # servir build
pnpm lint                 # ESLint
pnpm typecheck            # tsc --noEmit  (añádelo si no existe)

pnpm dlx shadcn@latest add <componente>   # añadir componente de shadcn
```

- **Usa siempre `pnpm`.** No generes ni `package-lock.json` ni `yarn.lock`; solo `pnpm-lock.yaml`.
- Antes de dar por terminada una tarea, corre `pnpm typecheck` y `pnpm lint` y deja ambos en verde.

---

## 12. Qué hacer y qué NO hacer

**Hacer:**

- Tipar todo con interfaces; validar en runtime lo que viene del backend.
- Mantener componentes pequeños, con una sola responsabilidad y reutilizables.
- Server Components por defecto; `"use client"` solo cuando haga falta.
- Colocar el código en la carpeta correcta según sea de feature o transversal.
- Manejar estados de carga, error y vacío en cada interacción con el backend.

**No hacer:**

- ❌ `any`, `@ts-ignore`, tipos inline anónimos en props.
- ❌ `fetch` suelto en componentes.
- ❌ npm o yarn.
- ❌ Editar a mano los componentes base de `components/ui/`.
- ❌ Convertir páginas enteras en client components por conveniencia.
- ❌ Duplicar lógica del backend en el frontend.
- ❌ CSS fuera de Tailwind (salvo `globals.css`).

---

## 13. Idioma

- Código, nombres de variables, funciones y tipos: **en inglés**.
- Comentarios y textos de UI: según convención del equipo (por defecto, UI en español).
