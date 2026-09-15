/**
 * Un validador de Standard Schema devuelve incidencias con `message`, pero un
 * validador propio puede devolver texto suelto. Los tipos de TanStack Form no
 * concretan la forma, así que aquí se estrecha explícitamente en lugar de
 * confiar en el tipo que llegue.
 */
export function toErrorMessages(errors: readonly unknown[]): string[] {
  const messages: string[] = [];

  for (const error of errors) {
    if (typeof error === "string") {
      messages.push(error);
      continue;
    }

    if (error !== null && typeof error === "object" && "message" in error) {
      const { message } = error as { message: unknown };
      if (typeof message === "string") messages.push(message);
    }
  }

  return messages;
}

/**
 * Prefijo propio de la feature para que el `id` del control no choque con el de
 * un campo homónimo de otro formulario montado en la misma página.
 */
export function fieldElementId(name: string): string {
  return `auth-${name.replace(/[^\w-]+/g, "-")}`;
}
