"use client";

import { createFormHook } from "@tanstack/react-form";

import { AuthCheckboxField } from "@/features/auth/components/fields/auth-checkbox-field";
import { AuthTextField } from "@/features/auth/components/fields/auth-text-field";
import { fieldContext, formContext } from "@/features/auth/hooks/form-context";
import {
  loginSchema,
  type LoginValues,
} from "@/features/auth/schemas/login.schema";

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

export type LoginFormApi = ReturnType<typeof useLoginForm>;
