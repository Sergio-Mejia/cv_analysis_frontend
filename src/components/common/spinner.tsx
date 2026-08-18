import { cn } from "@/lib/utils";

interface SpinnerProps {
  className?: string;
}

/**
 * Aro giratorio del diseño: la pista se hereda del color de borde actual y solo
 * el tramo superior toma el color del texto, así funciona igual sobre el panel
 * oscuro y sobre una tarjeta clara.
 */
export function Spinner({ className }: SpinnerProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-block size-4 shrink-0 animate-spin rounded-full border-2 border-current/25 border-t-current",
        className,
      )}
    />
  );
}
