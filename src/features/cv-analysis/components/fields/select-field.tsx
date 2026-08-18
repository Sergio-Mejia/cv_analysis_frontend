"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  fieldElementId,
  toErrorMessages,
} from "@/features/cv-analysis/components/fields/field-errors";
import { FieldShell } from "@/features/cv-analysis/components/fields/field-shell";
import { useFieldContext } from "@/features/cv-analysis/hooks/form-context";

export interface SelectFieldOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  label: string;
  options: readonly SelectFieldOption[];
  hideLabel?: boolean;
  className?: string;
}

/**
 * Desplegable sobre Radix. Las opciones siempre se derivan de los enums del
 * schema, así que el valor que devuelve el control ya es válido.
 */
export function SelectField({
  label,
  options,
  hideLabel = false,
  className,
}: SelectFieldProps) {
  const field = useFieldContext<string>();
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
      <Select
        value={field.state.value}
        onValueChange={(value) => field.handleChange(value)}
      >
        <SelectTrigger
          id={controlId}
          aria-invalid={showErrors}
          aria-describedby={showErrors ? `${controlId}-error` : undefined}
          onBlur={field.handleBlur}
          className="h-11 w-full rounded-lg bg-field px-3.5 text-base data-[size=default]:h-11 dark:bg-field"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </FieldShell>
  );
}
