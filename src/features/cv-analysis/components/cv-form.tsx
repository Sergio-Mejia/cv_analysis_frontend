"use client";

import { useState } from "react";
import { CheckIcon } from "lucide-react";

import { Spinner } from "@/components/common/spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

import { EducationSection } from "@/features/cv-analysis/components/sections/education-section";
import { ExperienceSection } from "@/features/cv-analysis/components/sections/experience-section";
import { InterestsSection } from "@/features/cv-analysis/components/sections/interests-section";
import { LanguagesSection } from "@/features/cv-analysis/components/sections/languages-section";
import { PersonalDataSection } from "@/features/cv-analysis/components/sections/personal-data-section";
import { useCvForm } from "@/features/cv-analysis/hooks/use-cv-form";
import type { CvFormValues } from "@/features/cv-analysis/schemas/cv-form.schema";

interface CvFormProps {
  /** Datos extraídos por el análisis, que prellenan el formulario. */
  result: CvFormValues;
  onAnalyzeAnother: () => void;
}

/**
 * Formulario editable con el resultado del análisis. Se monta al terminar el
 * análisis y se desmonta al empezar otro, así que `result` siempre prellena una
 * instancia nueva.
 */
export function CvForm({ result, onAnalyzeAnother }: CvFormProps) {
  const [isSaved, setIsSaved] = useState(false);

  const form = useCvForm({
    defaultValues: result,
    onSubmit: () => {
      // Punto de integración del guardado: cuando el backend exponga el endpoint,
      // la llamada al service va aquí. De momento el envío solo confirma que los
      // datos revisados son válidos.
      setIsSaved(true);
    },
  });

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        setIsSaved(false);
        void form.handleSubmit();
      }}
      className="flex animate-fade-up flex-col gap-4.5"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Resultado del análisis
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Revisa y edita los campos extraídos antes de guardar.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={onAnalyzeAnother}
          className="h-11 rounded-lg px-4 text-sm hover:border-primary hover:text-primary"
        >
          Analizar otro
        </Button>
      </div>

      <PersonalDataSection form={form} />
      <LanguagesSection form={form} />
      <InterestsSection form={form} />
      <ExperienceSection form={form} />
      <EducationSection form={form} />

      {isSaved && (
        <Alert>
          <CheckIcon />
          <AlertTitle>Datos confirmados</AlertTitle>
          <AlertDescription>
            La hoja de vida pasó la validación y está lista para guardarse.
          </AlertDescription>
        </Alert>
      )}

      <div className="sticky bottom-0 -mx-4 border-t border-border bg-background/85 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6">
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, isSubmitting]) => (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                {canSubmit
                  ? "Todo listo para guardar."
                  : "Hay campos obligatorios sin completar."}
              </p>
              {/* El botón sigue activo aunque haya errores: al enviar, TanStack
                  marca todos los campos como tocados y así se ven en rojo. Un
                  botón deshabilitado dejaría al usuario sin saber qué falta. */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-11 gap-2.5 rounded-xl bg-linear-135 from-brand to-brand-accent px-6 text-base font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                {isSubmitting && <Spinner />}
                Guardar
              </Button>
            </div>
          )}
        </form.Subscribe>
      </div>
    </form>
  );
}
