import { Spinner } from "@/components/common/spinner";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface AnalysisLoadingStateProps {
  /** Porcentaje subido, o `null` cuando los archivos ya están en el backend. */
  uploadPercent: number | null;
}

const SKELETON_FIELDS = ["nombre", "apellido", "correo", "teléfono"];

export function AnalysisLoadingState({
  uploadPercent,
}: AnalysisLoadingStateProps) {
  const isUploading = uploadPercent !== null;

  return (
    <Card className="gap-0 rounded-3xl p-7">
      <div className="mb-5 flex items-center gap-3">
        <Spinner className="size-5 border-border border-t-brand" />
        <div aria-live="polite">
          <p className="text-base font-semibold">
            {isUploading
              ? "Subiendo tus archivos…"
              : "Analizando tu hoja de vida…"}
          </p>
          <p className="text-sm text-muted-foreground">
            {isUploading
              ? `${uploadPercent}% completado`
              : "Extrayendo datos personales, experiencia y formación."}
          </p>
        </div>
      </div>

      <div
        role="progressbar"
        aria-label={isUploading ? "Progreso de la subida" : "Analizando"}
        aria-valuenow={isUploading ? uploadPercent : undefined}
        aria-valuemin={isUploading ? 0 : undefined}
        aria-valuemax={isUploading ? 100 : undefined}
        className="mb-6 h-1.5 overflow-hidden rounded-full bg-muted"
      >
        {isUploading ? (
          <div
            className="h-full rounded-full bg-linear-to-r from-brand to-brand-accent transition-[width] duration-200"
            style={{ width: `${uploadPercent}%` }}
          />
        ) : (
          <div className="h-full w-2/5 animate-indeterminate rounded-full bg-linear-to-r from-brand to-brand-accent" />
        )}
      </div>

      <div aria-hidden="true" className="flex flex-col gap-3.5">
        <Skeleton className="shimmer-surface h-3.5 w-2/5 animate-shimmer" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {SKELETON_FIELDS.map((field) => (
            <Skeleton
              key={field}
              className="shimmer-surface h-11 animate-shimmer rounded-lg"
            />
          ))}
        </div>
        <Skeleton className="shimmer-surface h-20 animate-shimmer rounded-lg" />
      </div>
    </Card>
  );
}
