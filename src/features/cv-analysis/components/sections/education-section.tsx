"use client";

import { AddRowButton } from "@/features/cv-analysis/components/add-row-button";
import { EntryCard } from "@/features/cv-analysis/components/entry-card";
import type { SelectFieldOption } from "@/features/cv-analysis/components/fields/select-field";
import { FormSection } from "@/features/cv-analysis/components/form-section";
import type { CvFormApi } from "@/features/cv-analysis/hooks/use-cv-form";
import {
  EDUCATION_MODES,
  EMPTY_EDUCATION,
} from "@/features/cv-analysis/schemas/cv-form.schema";

const MODE_OPTIONS: readonly SelectFieldOption[] = EDUCATION_MODES.map(
  (mode) => ({ value: mode, label: mode }),
);

interface EducationSectionProps {
  form: CvFormApi;
}

export function EducationSection({ form }: EducationSectionProps) {
  return (
    <FormSection title="Educación">
      <form.Field name="education" mode="array">
        {(education) => (
          <div className="flex flex-col">
            <div className="flex flex-col gap-3.5">
              {education.state.value.map((_, index) => (
                <EntryCard
                  key={index}
                  removeLabel={`Quitar la formación ${index + 1}`}
                  onRemove={() => education.removeValue(index)}
                >
                  <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
                    <form.AppField name={`education[${index}].degree`}>
                      {(field) => (
                        <field.TextField
                          label="Título"
                          placeholder="Título"
                          className="md:col-span-2"
                        />
                      )}
                    </form.AppField>

                    <form.AppField name={`education[${index}].institution`}>
                      {(field) => (
                        <field.TextField
                          label="Institución"
                          placeholder="Sin especificar"
                        />
                      )}
                    </form.AppField>

                    <form.AppField name={`education[${index}].city`}>
                      {(field) => (
                        <field.TextField
                          label="Ciudad"
                          placeholder="Sin especificar"
                        />
                      )}
                    </form.AppField>

                    <form.AppField name={`education[${index}].startDate`}>
                      {(field) => (
                        <field.TextField label="Inicio" placeholder="mm/aaaa" />
                      )}
                    </form.AppField>

                    {/* La fecha de fin depende de si la formación sigue en curso. */}
                    <form.Subscribe
                      selector={(state) =>
                        state.values.education[index]?.isCurrent ?? false
                      }
                    >
                      {(isCurrent) => (
                        <form.AppField name={`education[${index}].endDate`}>
                          {(field) => (
                            <field.TextField
                              label="Fin"
                              placeholder={isCurrent ? "Actualidad" : "mm/aaaa"}
                              disabled={isCurrent}
                            />
                          )}
                        </form.AppField>
                      )}
                    </form.Subscribe>

                    <form.AppField name={`education[${index}].mode`}>
                      {(field) => (
                        <field.SelectField
                          label="Modalidad"
                          options={MODE_OPTIONS}
                        />
                      )}
                    </form.AppField>

                    <form.AppField name={`education[${index}].isCurrent`}>
                      {(field) => (
                        <field.CheckboxField
                          label="En curso"
                          className="md:col-span-2"
                          onChange={(checked) => {
                            if (checked) {
                              form.setFieldValue(
                                `education[${index}].endDate`,
                                null,
                              );
                            }
                          }}
                        />
                      )}
                    </form.AppField>

                    <form.AppField name={`education[${index}].description`}>
                      {(field) => (
                        <field.TextareaField
                          label="Descripción"
                          placeholder="Detalles del programa…"
                          className="md:col-span-2"
                        />
                      )}
                    </form.AppField>
                  </div>
                </EntryCard>
              ))}
            </div>

            <AddRowButton
              label="Añadir formación"
              onClick={() => education.pushValue(EMPTY_EDUCATION)}
            />
          </div>
        )}
      </form.Field>
    </FormSection>
  );
}
