"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import { fieldElementId } from "@/features/cv-analysis/components/fields/field-errors";
import { useFieldContext } from "@/features/cv-analysis/hooks/form-context";

interface CheckboxFieldProps {
  label: string;
  /** Efectos sobre otros campos, p. ej. vaciar la fecha de fin al marcar. */
  onChange?: (checked: boolean) => void;
  className?: string;
}

export function CheckboxField({
  label,
  onChange,
  className,
}: CheckboxFieldProps) {
  const field = useFieldContext<boolean>();
  const controlId = fieldElementId(field.name);

  const handleChange = (checked: boolean) => {
    field.handleChange(checked);
    onChange?.(checked);
  };

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
          onCheckedChange={(checked) => handleChange(checked === true)}
          onBlur={field.handleBlur}
        />
        {label}
      </Label>
    </div>
  );
}
