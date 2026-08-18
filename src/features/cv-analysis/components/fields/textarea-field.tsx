"use client";

import { Textarea } from "@/components/ui/textarea";

import {
  fieldElementId,
  toErrorMessages,
} from "@/features/cv-analysis/components/fields/field-errors";
import { FieldShell } from "@/features/cv-analysis/components/fields/field-shell";
import { useFieldContext } from "@/features/cv-analysis/hooks/form-context";

interface TextareaFieldProps {
  label: string;
  placeholder?: string;
  className?: string;
}

export function TextareaField({
  label,
  placeholder,
  className,
}: TextareaFieldProps) {
  const field = useFieldContext<string>();
  const errors = toErrorMessages(field.state.meta.errors);
  const showErrors = field.state.meta.isTouched && errors.length > 0;
  const controlId = fieldElementId(field.name);

  return (
    <FieldShell
      controlId={controlId}
      label={label}
      errors={showErrors ? errors : []}
      className={className}
    >
      <Textarea
        id={controlId}
        name={field.name}
        value={field.state.value}
        placeholder={placeholder}
        aria-invalid={showErrors}
        aria-describedby={showErrors ? `${controlId}-error` : undefined}
        onChange={(event) => field.handleChange(event.target.value)}
        onBlur={field.handleBlur}
        className="min-h-20 rounded-lg bg-field px-3.5 py-2.5 text-base leading-relaxed dark:bg-field"
      />
    </FieldShell>
  );
}
