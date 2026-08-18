"use client";

import { AddRowButton } from "@/features/cv-analysis/components/add-row-button";
import type { SelectFieldOption } from "@/features/cv-analysis/components/fields/select-field";
import { FormSection } from "@/features/cv-analysis/components/form-section";
import { RemoveRowButton } from "@/features/cv-analysis/components/remove-row-button";
import type { CvFormApi } from "@/features/cv-analysis/hooks/use-cv-form";
import {
  EMPTY_LANGUAGE,
  LANGUAGE_LEVELS,
  LANGUAGE_LEVEL_LABELS,
} from "@/features/cv-analysis/schemas/cv-form.schema";

const LEVEL_OPTIONS: readonly SelectFieldOption[] = LANGUAGE_LEVELS.map(
  (level) => ({ value: level, label: LANGUAGE_LEVEL_LABELS[level] }),
);

interface LanguagesSectionProps {
  form: CvFormApi;
}

export function LanguagesSection({ form }: LanguagesSectionProps) {
  return (
    <FormSection title="Idiomas">
      <form.Field name="languages" mode="array">
        {(languages) => (
          <div className="flex flex-col">
            <div className="flex flex-col gap-2.5">
              {languages.state.value.map((_, index) => (
                <div
                  // El índice es estable: al quitar una fila se desplazan los valores.
                  key={index}
                  className="grid grid-cols-1 gap-2.5 sm:grid-cols-[1fr_150px_auto] sm:items-start"
                >
                  <form.AppField name={`languages[${index}].name`}>
                    {(field) => (
                      <field.TextField
                        label="Idioma"
                        placeholder="Idioma"
                        hideLabel
                      />
                    )}
                  </form.AppField>

                  <form.AppField name={`languages[${index}].level`}>
                    {(field) => (
                      <field.SelectField
                        label="Nivel"
                        options={LEVEL_OPTIONS}
                        hideLabel
                      />
                    )}
                  </form.AppField>

                  <RemoveRowButton
                    label={`Quitar el idioma ${index + 1}`}
                    onClick={() => languages.removeValue(index)}
                    className="size-11"
                  />
                </div>
              ))}
            </div>

            <AddRowButton
              label="Añadir idioma"
              onClick={() => languages.pushValue(EMPTY_LANGUAGE)}
            />
          </div>
        )}
      </form.Field>
    </FormSection>
  );
}
