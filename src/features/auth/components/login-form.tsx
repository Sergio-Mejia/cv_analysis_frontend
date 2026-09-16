"use client";

import Link from "next/link";
import { useEffect } from "react";

import { Spinner } from "@/components/common/spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

import { AuthCard } from "@/features/auth/components/auth-card";
import { useAuth } from "@/features/auth/hooks/use-auth";
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
  const { refresh } = useAuth();

  const form = useLoginForm({
    defaultValues: EMPTY_LOGIN_VALUES,
    onSubmit: (values) => submit(values),
  });

  /*
   * Al entrar, Amplify emite `signedIn` por el Hub y el proveedor se actualiza
   * solo; `refresh` lo fuerza igualmente para no depender de ese evento. Una vez
   * el estado pasa a `authenticated`, es `RequireGuest` quien saca de aquí.
   */
  useEffect(() => {
    if (state.status === "success") void refresh();
  }, [state.status, refresh]);

  const isSubmitting = state.status === "submitting";
  // Tras entrar, el formulario queda bloqueado hasta que la redirección ocurre.
  const isPending = isSubmitting || state.status === "success";

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
              disabled={isPending}
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
              disabled={isPending}
            />
          )}
        </form.AppField>

        <form.AppField name="rememberMe">
          {(field) => (
            <field.AuthCheckboxField
              label="Mantener la sesión abierta"
              disabled={isPending}
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
          disabled={isPending}
          className="mt-1 h-12 w-full gap-2.5 rounded-xl bg-linear-135 from-brand to-brand-accent px-6 text-base font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {isPending && <Spinner />}
          {isPending ? "Iniciando sesión…" : "Iniciar sesión"}
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
