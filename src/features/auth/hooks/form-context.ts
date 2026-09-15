"use client";

import { createFormHookContexts } from "@tanstack/react-form";

/**
 * Contextos de TanStack Form de la feature de autenticación. Viven aparte de los
 * hooks de formulario porque los componentes de campo los consumen y los hooks
 * los registran: en el mismo módulo habría una importación circular.
 */
export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();
