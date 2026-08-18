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
 * Los nombres de campo anidados (`experience[0].role`) no son un buen `id`, así
 * que se normalizan para poder enlazar la etiqueta con el control.
 */
export function fieldElementId(name: string): string {
  return `cv-${name.replace(/[^\w-]+/g, "-")}`;
}
