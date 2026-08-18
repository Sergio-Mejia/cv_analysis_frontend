import type { ReactNode } from "react";

import { RemoveRowButton } from "@/features/cv-analysis/components/remove-row-button";

interface EntryCardProps {
  /** Etiqueta accesible del botón de quitar, p. ej. «Quitar la experiencia 1». */
  removeLabel: string;
  onRemove: () => void;
  children: ReactNode;
}

/**
 * Sub-tarjeta de una experiencia o formación. El botón de quitar flota arriba a
 * la derecha como en el diseño, y el contenido empieza por debajo para que no se
 * solape con el primer campo.
 */
export function EntryCard({
  removeLabel,
  onRemove,
  children,
}: EntryCardProps) {
  return (
    <div className="relative rounded-2xl border border-border bg-muted/40 p-4 pt-12 sm:p-5 sm:pt-12">
      <RemoveRowButton
        label={removeLabel}
        onClick={onRemove}
        className="absolute top-3 right-3 bg-card"
      />
      {children}
    </div>
  );
}
