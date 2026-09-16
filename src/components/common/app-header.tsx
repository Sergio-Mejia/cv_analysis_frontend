import { ThemeToggle } from "@/components/common/theme-toggle";
import { LogoutButton } from "@/features/auth/components/logout-button";

export function AppHeader() {
  return (
    <header className="flex items-center justify-between gap-4 pt-1.5 pb-7">
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="size-7.5 shrink-0 rounded-md bg-linear-135 from-brand to-brand-accent shadow-lg shadow-brand/40"
        />
        <span className="text-base font-semibold tracking-tight">
          Currículum·IA
        </span>
      </div>

      <div className="flex items-center gap-1">
        <p className="hidden text-sm text-muted-foreground sm:block">
          Análisis inteligente de hojas de vida
        </p>
        {/* Se borra solo cuando no hay sesión, así la misma cabecera sirve
            para el login y para el resto de la app. */}
        <LogoutButton />
        <ThemeToggle />
      </div>
    </header>
  );
}
