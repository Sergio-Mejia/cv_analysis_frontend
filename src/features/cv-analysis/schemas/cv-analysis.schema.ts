import { z } from "zod";

import {
  DEFAULT_EDUCATION_MODE,
  DEFAULT_EXPERIENCE_MODE,
  DEFAULT_INTEREST_TYPE,
  DEFAULT_LANGUAGE_LEVEL,
  EDUCATION_MODES,
  EXPERIENCE_MODES,
  INTEREST_TYPES,
  LANGUAGE_LEVELS,
  type CvFormValues,
} from "./cv-form.schema";

/**
 * Validación de lo que devuelve el backend de análisis.
 *
 * A propósito es permisiva: un CV puede no contener un dato y la extracción por
 * IA puede omitir campos enteros. Un hueco debe prellenar el formulario con un
 * valor vacío, no tumbar el análisis completo. La validación estricta llega
 * después, cuando el usuario confirma (`cvFormSchema`).
 */

/** Cuerpo que espera `POST /cv-analysis/presigned-url`. */
export const presignedUrlRequestSchema = z.object({
  fileName: z.string().min(1),
  fileType: z.string().min(1),
});

export type PresignedUrlRequest = z.infer<typeof presignedUrlRequestSchema>;

/** Respuesta de `POST /cv-analysis/presigned-url`. */
export const presignedUploadSchema = z.object({
  /** URL firmada de S3, válida unos minutos, para subir el archivo con PUT. */
  presignedUrl: z.url(),
  /** Clave del objeto en S3; es lo que luego se manda a analizar. */
  key: z.string().min(1),
});

export type PresignedUpload = z.infer<typeof presignedUploadSchema>;

/** Cuerpo que espera `POST /cv-analysis/analyze`. */
export const analyzeRequestSchema = z.object({
  s3Key: z.string().min(1),
});

export type AnalyzeRequest = z.infer<typeof analyzeRequestSchema>;

/** Texto que puede llegar ausente, nulo o con espacios sobrantes. */
const text = z
  .string()
  .nullish()
  .transform((value) => value?.trim() ?? "")
  .catch("");

/** Fecha de fin: `null` significa «en curso», como en el resto de la feature. */
const endDate = z
  .string()
  .nullish()
  .transform((value) => {
    const trimmed = value?.trim();
    return trimmed ? trimmed : null;
  })
  .catch(null);

const flag = z
  .boolean()
  .nullish()
  .transform((value) => value ?? false)
  .catch(false);

/** Una lista malformada degrada a vacía en lugar de invalidar todo el análisis. */
function lenientList<Output>(item: z.ZodType<Output>) {
  return z
    .array(item)
    .nullish()
    .transform((value) => value ?? [])
    .catch([] as Output[]);
}

export const cvAnalysisResultSchema = z.object({
  firstName: text,
  lastName: text,
  identificationType: text,
  identificationNumber: text,
  email: text,
  phone: text,
  address: text,
  city: text,
  country: text,
  birthDate: text,
  birthPlace: text,
  maritalStatus: text,
  // Idiomas e intereses sin nombre son ruido de la extracción: no aportan nada
  // y dejarían el formulario recién prellenado en estado inválido. Se descartan.
  // En experiencia y educación no se hace: aunque falte el cargo o el título, la
  // entrada lleva fechas y descripción, y decidir qué hacer con ella es del
  // usuario.
  languages: lenientList(
    z.object({
      name: text,
      level: z.enum(LANGUAGE_LEVELS).catch(DEFAULT_LANGUAGE_LEVEL),
    }),
  ).transform((items) => items.filter((item) => item.name !== "")),
  interests: lenientList(
    z.object({
      name: text,
      type: z.enum(INTEREST_TYPES).catch(DEFAULT_INTEREST_TYPE),
    }),
  ).transform((items) => items.filter((item) => item.name !== "")),
  experience: lenientList(
    z.object({
      role: text,
      company: text,
      country: text,
      city: text,
      isCurrent: flag,
      startDate: text,
      endDate,
      mode: z.enum(EXPERIENCE_MODES).catch(DEFAULT_EXPERIENCE_MODE),
      description: text,
    }),
  ),
  education: lenientList(
    z.object({
      degree: text,
      institution: text,
      country: text,
      city: text,
      isCurrent: flag,
      startDate: text,
      endDate,
      mode: z.enum(EDUCATION_MODES).catch(DEFAULT_EDUCATION_MODE),
      description: text,
    }),
  ),
});

/** Falla en compilación si `T` deja de encajar en `Shape`. */
type Assignable<T extends Shape, Shape> = T;

/**
 * El resultado del análisis tiene que poder alimentar el formulario tal cual:
 * si los dos schemas se desincronizan, este alias deja de compilar.
 */
export type CvAnalysisResult = Assignable<
  z.infer<typeof cvAnalysisResultSchema>,
  CvFormValues
>;
