"use client";

import { FormSection } from "@/features/cv-analysis/components/form-section";
import type { CvFormApi } from "@/features/cv-analysis/hooks/use-cv-form";

/** Solo los campos planos de la hoja de vida, no las listas. */
type PersonalFieldName =
  | "firstName"
  | "lastName"
  | "identificationType"
  | "identificationNumber"
  | "email"
  | "phone"
  | "address"
  | "city"
  | "country"
  | "birthDate"
  | "birthPlace"
  | "maritalStatus";

interface PersonalFieldDescriptor {
  name: PersonalFieldName;
  label: string;
  placeholder: string;
  type?: "text" | "email" | "tel";
  /** Ocupa las dos columnas en pantallas anchas. */
  full?: boolean;
}

/**
 * El descriptor vive aquí porque no se usa en ninguna otra parte; es el mismo
 * orden y las mismas etiquetas del diseño.
 */
const PERSONAL_FIELDS: readonly PersonalFieldDescriptor[] = [
  { name: "firstName", label: "Nombre", placeholder: "Nombre" },
  { name: "lastName", label: "Apellido", placeholder: "Apellido" },
  {
    name: "identificationType",
    label: "Tipo de identificación",
    placeholder: "Sin especificar",
  },
  {
    name: "identificationNumber",
    label: "Número de identificación",
    placeholder: "Sin especificar",
  },
  {
    name: "email",
    label: "Correo electrónico",
    placeholder: "nombre@correo.com",
    type: "email",
    full: true,
  },
  {
    name: "phone",
    label: "Teléfono",
    placeholder: "Sin especificar",
    type: "tel",
  },
  {
    name: "address",
    label: "Dirección",
    placeholder: "Sin especificar",
    full: true,
  },
  { name: "city", label: "Ciudad", placeholder: "Sin especificar" },
  { name: "country", label: "País", placeholder: "Sin especificar" },
  {
    name: "birthDate",
    label: "Fecha de nacimiento",
    placeholder: "dd/mm/aaaa",
  },
  {
    name: "birthPlace",
    label: "Lugar de nacimiento",
    placeholder: "Sin especificar",
  },
  { name: "maritalStatus", label: "Estado civil", placeholder: "Sin especificar" },
];

interface PersonalDataSectionProps {
  form: CvFormApi;
}

export function PersonalDataSection({ form }: PersonalDataSectionProps) {
  return (
    <FormSection title="Datos personales">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {PERSONAL_FIELDS.map((descriptor) => (
          <form.AppField key={descriptor.name} name={descriptor.name}>
            {(field) => (
              <field.TextField
                label={descriptor.label}
                placeholder={descriptor.placeholder}
                type={descriptor.type}
                className={descriptor.full ? "md:col-span-2" : undefined}
              />
            )}
          </form.AppField>
        ))}
      </div>
    </FormSection>
  );
}
