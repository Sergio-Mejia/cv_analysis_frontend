"use client";

import { createFormHook } from "@tanstack/react-form";

import { CheckboxField } from "@/features/cv-analysis/components/fields/checkbox-field";
import { SelectField } from "@/features/cv-analysis/components/fields/select-field";
import { TextField } from "@/features/cv-analysis/components/fields/text-field";
import { TextareaField } from "@/features/cv-analysis/components/fields/textarea-field";
import {
  fieldContext,
  formContext,
} from "@/features/cv-analysis/hooks/form-context";
import {
  cvFormSchema,
  type CvFormValues,
} from "@/features/cv-analysis/schemas/cv-form.schema";

/**
 * Registra los componentes de campo en el formulario, de modo que cada campo se
 * escriba como `<field.TextField label="…" />` en lugar de repetir el marcado de
 * etiqueta, control y error en los más de treinta campos de la hoja de vida.
 */
const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: { TextField, TextareaField, SelectField, CheckboxField },
  formComponents: {},
});

export interface UseCvFormOptions {
  /** Valores extraídos por el análisis, que el usuario puede editar. */
  defaultValues: CvFormValues;
  onSubmit: (values: CvFormValues) => Promise<void> | void;
}

/**
 * Fija los genéricos del formulario en un único sitio: el schema Zod valida en
 * `onChange` y otra vez al enviar, vía Standard Schema.
 */
export function useCvForm({ defaultValues, onSubmit }: UseCvFormOptions) {
  return useAppForm({
    defaultValues,
    validators: { onChange: cvFormSchema, onSubmit: cvFormSchema },
    onSubmit: async ({ value }) => {
      await onSubmit(value);
    },
  });
}

/** Tipo del formulario ya resuelto, para tipar las props de cada sección. */
export type CvFormApi = ReturnType<typeof useCvForm>;
