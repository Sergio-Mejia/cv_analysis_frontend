import { Spinner } from "@/components/common/spinner";

/**
 * Lo que se ve mientras se comprueba la sesión o mientras la redirección va en
 * camino. No dice «cargando» a secas: en esta pantalla el usuario está
 * esperando a saber si puede pasar.
 */
export function SessionPending() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-muted-foreground"
    >
      <Spinner className="size-6" />
      <p className="text-sm">Comprobando tu sesión…</p>
    </div>
  );
}
