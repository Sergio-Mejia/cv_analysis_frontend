"use client";

import { AddRowButton } from "@/features/cv-analysis/components/add-row-button";
import { EntryCard } from "@/features/cv-analysis/components/entry-card";
import type { SelectFieldOption } from "@/features/cv-analysis/components/fields/select-field";
import { FormSection } from "@/features/cv-analysis/components/form-section";
import type { CvFormApi } from "@/features/cv-analysis/hooks/use-cv-form";
import {
  EMPTY_EXPERIENCE,
  EXPERIENCE_MODES,
} from "@/features/cv-analysis/schemas/cv-form.schema";

const MODE_OPTIONS: readonly SelectFieldOption[] = EXPERIENCE_MODES.map(
  (mode) => ({ value: mode, label: mode }),
);

interface ExperienceSectionProps {
  form: CvFormApi;
}

export function ExperienceSection({ form }: ExperienceSectionProps) {
  return (
    <FormSection title="Experiencia">
      <form.Field name="experience" mode="array">
        {(experience) => (
          <div className="flex flex-col">
            <div className="flex flex-col gap-3.5">
              {experience.state.value.map((_, index) => (
                <EntryCard
                  key={index}
                  removeLabel={`Quitar la experiencia ${index + 1}`}
                  onRemove={() => experience.removeValue(index)}
                >
                  <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
                    <form.AppField name={`experience[${index}].role`}>
                      {(field) => (
                        <field.TextField
                          label="Cargo"
                          placeholder="Cargo"
                          className="md:col-span-2"
                        />
                      )}
                    </form.AppField>

                    <form.AppField name={`experience[${index}].company`}>
                      {(field) => (
                        <field.TextField
                          label="Empresa"
                          placeholder="Sin especificar"
                        />
                      )}
                    </form.AppField>

                    <form.AppField name={`experience[${index}].city`}>
                      {(field) => (
                        <field.TextField
                          label="Ciudad"
                          placeholder="Sin especificar"
                        />
                      )}
                    </form.AppField>

                    <form.AppField name={`experience[${index}].startDate`}>
                      {(field) => (
                        <field.TextField label="Inicio" placeholder="mm/aaaa" />
                      )}
                    </form.AppField>

                    {/* La fecha de fin depende de si el puesto sigue en curso. */}
                    <form.Subscribe
                      selector={(state) =>
                        state.values.experience[index]?.isCurrent ?? false
                      }
                    >
                      {(isCurrent) => (
                        <form.AppField name={`experience[${index}].endDate`}>
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

                    <form.AppField name={`experience[${index}].mode`}>
                      {(field) => (
                        <field.SelectField
                          label="Modalidad"
                          options={MODE_OPTIONS}
                        />
                      )}
                    </form.AppField>

                    <form.AppField name={`experience[${index}].isCurrent`}>
                      {(field) => (
                        <field.CheckboxField
                          label="Trabajo actual"
                          className="md:col-span-2"
                          onChange={(checked) => {
                            if (checked) {
                              form.setFieldValue(
                                `experience[${index}].endDate`,
                                null,
                              );
                            }
                          }}
                        />
                      )}
                    </form.AppField>

                    <form.AppField name={`experience[${index}].description`}>
                      {(field) => (
                        <field.TextareaField
                          label="Descripción"
                          placeholder="Responsabilidades y logros…"
                          className="md:col-span-2"
                        />
                      )}
                    </form.AppField>
                  </div>
                </EntryCard>
              ))}
            </div>

            <AddRowButton
              label="Añadir experiencia"
              onClick={() => experience.pushValue(EMPTY_EXPERIENCE)}
            />
          </div>
        )}
      </form.Field>
    </FormSection>
  );
}
