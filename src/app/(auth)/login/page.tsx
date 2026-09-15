import type { Metadata } from "next";

import { LoginForm } from "@/features/auth/components/login-form";

export const metadata: Metadata = {
  title: "Iniciar sesión — Currículum·IA",
  description:
    "Accede para analizar y gestionar tus hojas de vida con Currículum·IA.",
};

export default function LoginPage() {
  return <LoginForm />;
}
