import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";

interface FormSectionProps {
  title: string;
  children: ReactNode;
}

/** Tarjeta de sección del resultado, con el punto degradado del diseño. */
export function FormSection({ title, children }: FormSectionProps) {
  return (
    <Card className="gap-0 rounded-3xl p-5 shadow-sm sm:p-7">
      <h3 className="mb-4 flex items-center gap-3 text-lg font-semibold tracking-tight">
        <span
          aria-hidden="true"
          className="size-2.5 shrink-0 rounded-full bg-linear-135 from-brand to-brand-accent"
        />
        {title}
      </h3>
      {children}
    </Card>
  );
}
