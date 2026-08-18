/**
 * Rutas que consume el cliente. Apuntan a los Route Handlers de esta app, que
 * son los que hablan con el backend de análisis (así la URL y las credenciales
 * del backend nunca llegan al navegador).
 */
export const endpoints = {
  cvAnalysis: {
    analyze: "/api/cv/analyze",
    /** Nombre del campo multipart que transporta los CV; contrato cliente ↔ handler. */
    filesField: "files",
  },
} as const;
