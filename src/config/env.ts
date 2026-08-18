/**
 * Configuración disponible solo en el servidor. Ninguna de estas variables
 * lleva el prefijo `NEXT_PUBLIC_`, así que no se filtran al bundle del cliente.
 *
 * Importar este módulo desde un componente de cliente es un error.
 */
export interface ServerEnv {
  /** URL base del backend de análisis. Si falta, el Route Handler responde datos de ejemplo. */
  cvAnalysisApiUrl: string | null;
  /** Token opcional para autenticar contra el backend de análisis. */
  cvAnalysisApiToken: string | null;
}

function readOptional(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export function getServerEnv(): ServerEnv {
  return {
    cvAnalysisApiUrl: readOptional(process.env.CV_ANALYSIS_API_URL),
    cvAnalysisApiToken: readOptional(process.env.CV_ANALYSIS_API_TOKEN),
  };
}
