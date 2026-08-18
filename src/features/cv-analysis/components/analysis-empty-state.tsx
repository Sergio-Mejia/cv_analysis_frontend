import { Card } from "@/components/ui/card";

export function AnalysisEmptyState() {
  return (
    <Card className="items-center rounded-3xl border border-dashed border-border px-6 py-14 text-center ring-0">
      <span
        aria-hidden="true"
        className="mb-4 size-[46px] rounded-full border border-border bg-background"
      />
      <p className="text-base font-semibold">Los resultados aparecerán aquí</p>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Sube uno o más archivos y pulsa{" "}
        <span className="font-medium text-foreground">Analizar</span> para
        extraer los datos.
      </p>
    </Card>
  );
}
