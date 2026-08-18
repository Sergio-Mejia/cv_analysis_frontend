"use client";

import { createFormHookContexts } from "@tanstack/react-form";

/**
 * Contextos de TanStack Form. Viven aparte del hook (`use-cv-form.ts`) porque
 * los componentes de campo los consumen y el hook los registra: si estuvieran
 * en el mismo módulo habría una importación circular.
 */
export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();
