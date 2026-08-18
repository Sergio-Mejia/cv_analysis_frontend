import { z } from "zod";

/**
 * Fuente de verdad de la hoja de vida: de aquí sale la validación del
 * formulario, el tipo de sus valores y las opciones de cada desplegable.
 */

export const LANGUAGE_LEVELS = [
  "Native",
  "C2",
  "C1",
  "B2",
  "B1",
  "A2",
  "A1",
] as const;

export const INTEREST_TYPES = ["Profesional", "Personal"] as const;

export const EXPERIENCE_MODES = [
  "Presencial",
  "Remoto",
  "Híbrido",
  "Online",
] as const;

export const EDUCATION_MODES = ["Presencial", "Online", "Híbrido"] as const;

export type LanguageLevel = (typeof LANGUAGE_LEVELS)[number];
export type InterestType = (typeof INTEREST_TYPES)[number];
export type ExperienceMode = (typeof EXPERIENCE_MODES)[number];
export type EducationMode = (typeof EDUCATION_MODES)[number];

export const DEFAULT_LANGUAGE_LEVEL: LanguageLevel = "B1";
export const DEFAULT_INTEREST_TYPE: InterestType = "Profesional";
export const DEFAULT_EXPERIENCE_MODE: ExperienceMode = "Presencial";
export const DEFAULT_EDUCATION_MODE: EducationMode = "Presencial";

/** Los niveles de idioma se muestran traducidos, pero se guardan como código. */
export const LANGUAGE_LEVEL_LABELS: Record<LanguageLevel, string> = {
  Native: "Nativo",
  C2: "C2",
  C1: "C1",
  B2: "B2",
  B1: "B1",
  A2: "A2",
  A1: "A1",
};

export const languageSchema = z.object({
  name: z.string().min(1, "Indica el idioma."),
  level: z.enum(LANGUAGE_LEVELS),
});

export const interestSchema = z.object({
  name: z.string().min(1, "Indica el interés."),
  type: z.enum(INTEREST_TYPES),
});

export const experienceSchema = z.object({
  role: z.string().min(1, "El cargo es obligatorio."),
  company: z.string(),
  country: z.string(),
  city: z.string(),
  isCurrent: z.boolean(),
  startDate: z.string(),
  /** `null` cuando el puesto sigue en curso. */
  endDate: z.string().nullable(),
  mode: z.enum(EXPERIENCE_MODES),
  description: z.string(),
});

export const educationSchema = z.object({
  degree: z.string().min(1, "El título es obligatorio."),
  institution: z.string(),
  country: z.string(),
  city: z.string(),
  isCurrent: z.boolean(),
  startDate: z.string(),
  /** `null` cuando la formación sigue en curso. */
  endDate: z.string().nullable(),
  mode: z.enum(EDUCATION_MODES),
  description: z.string(),
});

export const cvFormSchema = z.object({
  firstName: z.string().min(1, "El nombre es obligatorio."),
  lastName: z.string().min(1, "El apellido es obligatorio."),
  identificationType: z.string(),
  identificationNumber: z.string(),
  email: z.literal("").or(z.email("Introduce un correo electrónico válido.")),
  phone: z.string(),
  address: z.string(),
  city: z.string(),
  country: z.string(),
  birthDate: z.string(),
  birthPlace: z.string(),
  maritalStatus: z.string(),
  languages: z.array(languageSchema),
  interests: z.array(interestSchema),
  experience: z.array(experienceSchema),
  education: z.array(educationSchema),
});

export type CvFormValues = z.infer<typeof cvFormSchema>;
export type CvLanguage = z.infer<typeof languageSchema>;
export type CvInterest = z.infer<typeof interestSchema>;
export type CvExperience = z.infer<typeof experienceSchema>;
export type CvEducation = z.infer<typeof educationSchema>;

/** Filas vacías para los botones «+ Añadir…». */
export const EMPTY_LANGUAGE: CvLanguage = {
  name: "",
  level: DEFAULT_LANGUAGE_LEVEL,
};

export const EMPTY_INTEREST: CvInterest = {
  name: "",
  type: DEFAULT_INTEREST_TYPE,
};

export const EMPTY_EXPERIENCE: CvExperience = {
  role: "",
  company: "",
  country: "",
  city: "",
  isCurrent: false,
  startDate: "",
  endDate: "",
  mode: DEFAULT_EXPERIENCE_MODE,
  description: "",
};

export const EMPTY_EDUCATION: CvEducation = {
  degree: "",
  institution: "",
  country: "",
  city: "",
  isCurrent: false,
  startDate: "",
  endDate: "",
  mode: DEFAULT_EDUCATION_MODE,
  description: "",
};
