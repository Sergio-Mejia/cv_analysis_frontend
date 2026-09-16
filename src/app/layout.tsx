import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { ConfigureAmplify } from "@/components/common/configure-amplify";
import { ThemeProvider } from "@/components/common/theme-provider";
import { AuthProvider } from "@/features/auth/components/auth-provider";
import "@/styles/globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Currículum·IA — Análisis de hojas de vida con IA",
  description:
    "Sube un currículum en PDF o imagen y extrae automáticamente toda la información en un formulario editable.",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <ConfigureAmplify />
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
