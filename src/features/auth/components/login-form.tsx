"use client";

import Link from "next/link";

import { Spinner } from "@/components/common/spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

import { AuthCard } from "@/features/auth/components/auth-card";
import { useLogin } from "@/features/auth/hooks/use-login";
import { useLoginForm } from "@/features/auth/hooks/use-login-form";
import {
  EMPTY_LOGIN_VALUES,
  MIN_PASSWORD_LENGTH,
} from "@/features/auth/schemas/login.schema";

/** Cuadro de marca que corona la tarjeta, con el degradado de la cabecera. */
function AuthBrandMark() {
  return (
    <span
      aria-hidden="true"
      className="block size-9 rounded-xl bg-linear-135 from-brand to-brand-accent shadow-lg shadow-brand/40"
    />
  );
}

export function LoginForm() {
  const { state, submit, reset } = useLogin();

  const form = useLoginForm({
    defaultValues: EMPTY_LOGIN_VALUES,
    onSubmit: (values) => submit(values),
  });

  const isSubmitting = state.status === "submitting";

  return (
    <AuthCard
      badge={<AuthBrandMark />}
      title="Bienvenido de vuelta"
      description="Inicia sesión para analizar y gestionar tus hojas de vida."
    >
      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          // Un intento nuevo no debe arrastrar el error del anterior.
          if (state.status === "error") reset();
          void form.handleSubmit();
        }}
        className="flex flex-col gap-4"
      >
        <form.AppField name="identifier">
          {(field) => (
            <field.AuthTextField
              label="Usuario o correo"
              placeholder="nombre@correo.com"
              autoComplete="username"
              disabled={isSubmitting}
            />
          )}
        </form.AppField>

        <form.AppField name="password">
          {(field) => (
            <field.AuthTextField
              label="Contraseña"
              type="password"
              placeholder={`Mínimo ${MIN_PASSWORD_LENGTH} caracteres`}
              autoComplete="current-password"
              disabled={isSubmitting}
            />
          )}
        </form.AppField>

        <form.AppField name="rememberMe">
          {(field) => (
            <field.AuthCheckboxField
              label="Mantener la sesión abierta"
              disabled={isSubmitting}
              className="pt-0.5"
            />
          )}
        </form.AppField>

        {state.status === "error" && (
          <Alert variant="destructive">
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="mt-1 h-12 w-full gap-2.5 rounded-xl bg-linear-135 from-brand to-brand-accent px-6 text-base font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {isSubmitting && <Spinner />}
          {isSubmitting ? "Iniciando sesión…" : "Iniciar sesión"}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-muted-foreground">
        ¿Olvidaste tu contraseña?{" "}
        <Link
          href="/reset-password"
          className="rounded-sm font-semibold text-primary outline-none transition-colors hover:text-brand focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          Crear una nueva
        </Link>
      </p>
    </AuthCard>
  );
}
