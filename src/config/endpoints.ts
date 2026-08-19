/**
 * Rutas de los Route Handlers de esta app. Son las únicas que conoce el
 * navegador: la URL y el token del backend nunca salen del servidor.
 */
export const endpoints = {
  cvAnalysis: {
    presignedUrl: "/api/cv/presigned-url",
    analyze: "/api/cv/analyze",
  },
} as const;

/**
 * Rutas del backend de análisis, relativas a `CV_ANALYSIS_API_URL`. Solo se
 * usan desde el servidor.
 */
export const backendEndpoints = {
  cvAnalysis: {
    presignedUrl: "/cv-analysis/presigned-url",
    analyze: "/cv-analysis/analyze",
  },
} as const;
