import type { CvAnalysisResult } from "@/features/cv-analysis/schemas/cv-analysis.schema";

/**
 * Resultado de ejemplo que devuelve el Route Handler mientras no haya un
 * backend configurado (`CV_ANALYSIS_API_URL`). Son los mismos datos del diseño,
 * para poder recorrer el flujo completo sin depender de la IA.
 *
 * Solo servidor: este módulo no debe importarse desde un componente de cliente.
 */
export const MOCK_ANALYSIS_RESULT: CvAnalysisResult = {
  firstName: "Marcos",
  lastName: "Vega",
  identificationType: "",
  identificationNumber: "",
  email: "marcos.vega@zmail.com",
  phone: "+34 912 170 453",
  address: "Av. de Francia, 45005 Toledo",
  city: "Toledo",
  country: "",
  birthDate: "",
  birthPlace: "",
  maritalStatus: "",
  languages: [
    { name: "Español", level: "Native" },
    { name: "Inglés", level: "C1" },
    { name: "Alemán", level: "B2" },
  ],
  interests: [
    { name: "Administración y Logística", type: "Profesional" },
    { name: "Gestión Financiera", type: "Profesional" },
    { name: "Trabajo en Equipo", type: "Personal" },
    { name: "Atención al Cliente", type: "Profesional" },
  ],
  experience: [
    {
      role: "Auxiliar Administrativo Comercial",
      company: "URBANA",
      country: "",
      city: "Barcelona",
      isCurrent: true,
      startDate: "01/2019",
      endDate: null,
      mode: "Presencial",
      description:
        "Organicé y supervisé la gestión administrativa del personal y tramité documentos internos y externos de la compañía.",
    },
    {
      role: "Auxiliar de Administrativo",
      company: "Asociación de Guías de Turismo El Greco y Toledo",
      country: "",
      city: "Toledo",
      isCurrent: false,
      startDate: "02/2017",
      endDate: "11/2018",
      mode: "Presencial",
      description:
        "Desarrollé funciones administrativas como atención telefónica y mantenimiento de web, además de organizar expedientes administrativos.",
    },
    {
      role: "Auxiliar Administrativo Jr.",
      company: "",
      country: "",
      city: "",
      isCurrent: false,
      startDate: "06/2016",
      endDate: "12/2016",
      mode: "Presencial",
      description:
        "Apoyé en tareas administrativas de volcado de datos en Excel y documentación.",
    },
  ],
  education: [
    {
      degree: "Máster en Dirección y Administración de Empresas",
      institution: "IMF Business School",
      country: "",
      city: "",
      isCurrent: false,
      startDate: "01/2019",
      endDate: "12/2020",
      mode: "Online",
      description: "",
    },
    {
      degree: "Administración y Dirección de Empresas",
      institution: "Universidad de Toledo",
      country: "",
      city: "Toledo",
      isCurrent: false,
      startDate: "07/2012",
      endDate: "12/2016",
      mode: "Presencial",
      description: "",
    },
  ],
};
