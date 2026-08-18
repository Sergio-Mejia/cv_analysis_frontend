"use client";

import { AddRowButton } from "@/features/cv-analysis/components/add-row-button";
import type { SelectFieldOption } from "@/features/cv-analysis/components/fields/select-field";
import { FormSection } from "@/features/cv-analysis/components/form-section";
import { RemoveRowButton } from "@/features/cv-analysis/components/remove-row-button";
import type { CvFormApi } from "@/features/cv-analysis/hooks/use-cv-form";
import {
  EMPTY_INTEREST,
  INTEREST_TYPES,
} from "@/features/cv-analysis/schemas/cv-form.schema";

const TYPE_OPTIONS: readonly SelectFieldOption[] = INTEREST_TYPES.map(
  (type) => ({ value: type, label: type }),
);

interface InterestsSectionProps {
  form: CvFormApi;
}

export function InterestsSection({ form }: InterestsSectionProps) {
  return (
    <FormSection title="Intereses">
      <form.Field name="interests" mode="array">
        {(interests) => (
          <div className="flex flex-col">
            <div className="flex flex-col gap-2.5">
              {interests.state.value.map((_, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 gap-2.5 sm:grid-cols-[1fr_170px_auto] sm:items-start"
                >
                  <form.AppField name={`interests[${index}].name`}>
                    {(field) => (
                      <field.TextField
                        label="Interés"
                        placeholder="Interés"
                        hideLabel
                      />
                    )}
                  </form.AppField>

                  <form.AppField name={`interests[${index}].type`}>
                    {(field) => (
                      <field.SelectField
                        label="Tipo de interés"
                        options={TYPE_OPTIONS}
                        hideLabel
                      />
                    )}
                  </form.AppField>

                  <RemoveRowButton
                    label={`Quitar el interés ${index + 1}`}
                    onClick={() => interests.removeValue(index)}
                    className="size-11"
                  />
                </div>
              ))}
            </div>

            <AddRowButton
              label="Añadir interés"
              onClick={() => interests.pushValue(EMPTY_INTEREST)}
            />
          </div>
        )}
      </form.Field>
    </FormSection>
  );
}
