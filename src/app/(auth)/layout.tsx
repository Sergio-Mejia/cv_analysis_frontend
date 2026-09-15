import { AppHeader } from "@/components/common/app-header";

interface AuthLayoutProps {
  children: React.ReactNode;
}

/**
 * Marco de las pantallas de acceso: la misma cabecera del resto de la app sobre
 * el resplandor de marca, con el contenido centrado en el hueco restante.
 */
export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-full flex-1 flex-col overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[32rem] animate-glow panel-glow"
      />

      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 pt-8 pb-16 sm:px-6">
        <AppHeader />

        <main className="flex flex-1 items-center justify-center py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
