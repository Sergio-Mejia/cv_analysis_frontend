import { XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RemoveRowButtonProps {
  /** Texto para lectores de pantalla, p. ej. «Quitar el idioma 2». */
  label: string;
  onClick: () => void;
  className?: string;
}

export function RemoveRowButton({
  label,
  onClick,
  className,
}: RemoveRowButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-lg text-muted-foreground hover:border-primary hover:text-primary",
        className,
      )}
    >
      <XIcon />
    </Button>
  );
}
