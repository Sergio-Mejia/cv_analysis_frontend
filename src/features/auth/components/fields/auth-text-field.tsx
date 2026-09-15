"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";

import {
  fieldElementId,
  toErrorMessages,
} from "@/features/auth/components/fields/field-errors";
import { FieldShell } from "@/features/auth/components/fields/field-shell";
import { useFieldContext } from "@/features/auth/hooks/form-context";

interface AuthTextFieldProps {
  label: string;
  placeholder?: string;
  type?: "text" | "email" | "password";
  /** Pista para el gestor de contraseñas del navegador. */
  autoComplete?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * Campo de texto de los formularios de acceso. Cuando es de tipo contraseña
 * añade el conmutador «Mostrar» que pide el diseño.
 */
export function AuthTextField({
  label,
  placeholder,
  type = "text",
  autoComplete,
  disabled = false,
  className,
}: AuthTextFieldProps) {
  const field = useFieldContext<string>();
  const [isRevealed, setIsRevealed] = useState(false);

  const errors = toErrorMessages(field.state.meta.errors);
  const showErrors = field.state.meta.isTouched && errors.length > 0;
  const controlId = fieldElementId(field.name);

  const isPassword = type === "password";
  const inputType = isPassword && isRevealed ? "text" : type;

  return (
    <FieldShell
      controlId={controlId}
      label={label}
      errors={showErrors ? errors : []}
      className={className}
      action={
        isPassword ? (
          <button
            type="button"
            aria-controls={controlId}
            aria-pressed={isRevealed}
            onClick={() => setIsRevealed((revealed) => !revealed)}
            className="rounded-sm text-xs font-medium text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {isRevealed ? "Ocultar" : "Mostrar"}
          </button>
        ) : undefined
      }
    >
      <Input
        id={controlId}
        name={field.name}
        type={inputType}
        value={field.state.value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        disabled={disabled}
        aria-invalid={showErrors}
        aria-describedby={showErrors ? `${controlId}-error` : undefined}
        onChange={(event) => field.handleChange(event.target.value)}
        onBlur={field.handleBlur}
        // `dark:bg-field` es necesario para que tailwind-merge descarte el
        // `dark:bg-input/30` que trae el Input de shadcn.
        className="h-11 rounded-lg bg-field px-3.5 text-base dark:bg-field"
      />
    </FieldShell>
  );
}
