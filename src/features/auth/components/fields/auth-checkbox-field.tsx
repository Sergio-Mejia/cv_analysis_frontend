"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import { fieldElementId } from "@/features/auth/components/fields/field-errors";
import { useFieldContext } from "@/features/auth/hooks/form-context";

interface AuthCheckboxFieldProps {
  label: string;
  disabled?: boolean;
  className?: string;
}

export function AuthCheckboxField({
  label,
  disabled = false,
  className,
}: AuthCheckboxFieldProps) {
  const field = useFieldContext<boolean>();
  const controlId = fieldElementId(field.name);

  return (
    <div className={className}>
      <Label
        htmlFor={controlId}
        className="cursor-pointer gap-2.5 text-sm font-normal text-foreground"
      >
        <Checkbox
          id={controlId}
          name={field.name}
          checked={field.state.value}
          disabled={disabled}
          onCheckedChange={(checked) => field.handleChange(checked === true)}
          onBlur={field.handleBlur}
        />
        {label}
      </Label>
    </div>
  );
}
