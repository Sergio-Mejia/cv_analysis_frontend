"use client";

import { createFormHook } from "@tanstack/react-form";

import { AuthCheckboxField } from "@/features/auth/components/fields/auth-checkbox-field";
import { AuthTextField } from "@/features/auth/components/fields/auth-text-field";
import { fieldContext, formContext } from "@/features/auth/hooks/form-context";
import {
  loginSchema,
  type LoginValues,
} from "@/features/auth/schemas/login.schema";

/**
 * Registra los componentes de campo del acceso, de modo que cada campo se
 * escriba como `<field.AuthTextField label="…" />` en lugar de repetir el
 * marcado de etiqueta, control y error.
 */
const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: { AuthTextField, AuthCheckboxField },
  formComponents: {},
});

export interface UseLoginFormOptions {
  defaultValues: LoginValues;
  onSubmit: (values: LoginValues) => Promise<void> | void;
}

/**
 * Fija los genéricos del formulario en un único sitio. Valida en `onBlur` y no
 * en `onChange`: avisar del mínimo de caracteres mientras aún se escribe la
 * contraseña marca en rojo un campo que todavía no está mal.
 */
export function useLoginForm({
  defaultValues,
  onSubmit,
}: UseLoginFormOptions) {
  return useAppForm({
    defaultValues,
    validators: { onBlur: loginSchema, onSubmit: loginSchema },
    onSubmit: async ({ value }) => {
      await onSubmit(value);
    },
  });
}

/** Tipo del formulario ya resuelto, para tipar las props de cada sección. */
export type LoginFormApi = ReturnType<typeof useLoginForm>;
