"use client";

import { Input } from "@/components/ui/input";

import {
  fieldElementId,
  toErrorMessages,
} from "@/features/cv-analysis/components/fields/field-errors";
import { FieldShell } from "@/features/cv-analysis/components/fields/field-shell";
import { useFieldContext } from "@/features/cv-analysis/hooks/form-context";

interface TextFieldProps {
  label: string;
  placeholder?: string;
  type?: "text" | "email" | "tel";
  disabled?: boolean;
  hideLabel?: boolean;
  className?: string;
}

/**
 * Campo de texto. Acepta valores nulos porque las fechas de fin usan `null`
 * para decir «en curso»; hacia el input se muestran como cadena vacía.
 */
export function TextField({
  label,
  placeholder,
  type = "text",
  disabled = false,
  hideLabel = false,
  className,
}: TextFieldProps) {
  const field = useFieldContext<string | null>();
  const errors = toErrorMessages(field.state.meta.errors);
  const showErrors = field.state.meta.isTouched && errors.length > 0;
  const controlId = fieldElementId(field.name);

  return (
    <FieldShell
      controlId={controlId}
      label={label}
      errors={showErrors ? errors : []}
      hideLabel={hideLabel}
      className={className}
    >
      <Input
        id={controlId}
        name={field.name}
        type={type}
        value={field.state.value ?? ""}
        placeholder={placeholder}
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
