import { RequireAuth } from "@/features/auth/components/require-auth";

interface AppLayoutProps {
  children: React.ReactNode;
}

/**
 * Marco de las pantallas que exigen sesión. `children` llega como prop, así que
 * las páginas de dentro siguen siendo Server Components aunque el guard sea de
 * cliente.
 */
export default function AppLayout({ children }: AppLayoutProps) {
  return <RequireAuth>{children}</RequireAuth>;
}
