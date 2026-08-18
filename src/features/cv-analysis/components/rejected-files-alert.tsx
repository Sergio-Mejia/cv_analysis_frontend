import { FileWarningIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

import type { RejectedFile } from "@/features/cv-analysis/types/cv.types";

interface RejectedFilesAlertProps {
  rejected: RejectedFile[];
  onDismiss: () => void;
}

export function RejectedFilesAlert({
  rejected,
  onDismiss,
}: RejectedFilesAlertProps) {
  return (
    <Alert variant="destructive" className="mt-4 rounded-2xl border-border p-5">
      <FileWarningIcon />
      <AlertTitle>
        {rejected.length === 1
          ? "No pudimos añadir un archivo"
          : `No pudimos añadir ${rejected.length} archivos`}
      </AlertTitle>
      <AlertDescription>
        <ul className="list-inside list-disc">
          {rejected.map((file) => (
            <li key={file.name}>
              <span className="font-medium">{file.name}</span>: {file.reason}.
            </li>
          ))}
        </ul>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onDismiss}
          className="mt-3"
        >
          Entendido
        </Button>
      </AlertDescription>
    </Alert>
  );
}
