import { TriangleAlertIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface AnalysisErrorStateProps {
  message: string;
  onRetry: () => void;
  /** Sin archivos seleccionados no hay nada que reintentar. */
  canRetry: boolean;
}

export function AnalysisErrorState({
  message,
  onRetry,
  canRetry,
}: AnalysisErrorStateProps) {
  return (
    <Alert variant="destructive" className="rounded-3xl border-border p-7">
      <TriangleAlertIcon />
      <AlertTitle className="text-base">No pudimos analizar los archivos</AlertTitle>
      <AlertDescription>
        {message}
        {canRetry && (
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={onRetry}
            className="mt-4 rounded-lg"
          >
            Reintentar
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
