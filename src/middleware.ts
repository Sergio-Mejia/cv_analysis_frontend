import { NextResponse, type NextRequest } from "next/server";

import type { ApiResponse } from "@/types/api.types";

const LOGIN_PATH = "/login";
const HOME_PATH = "/";

/**
 * Prefijo con el que Amplify nombra las cookies del pool de Cognito
 * (`AUTH_KEY_PREFIX`). Se comprueba la del `idToken` porque es la que solo
 * existe cuando hay sesión.
 */
const COGNITO_COOKIE_PREFIX = "CognitoIdentityServiceProvider";

function hasSessionCookie(request: NextRequest): boolean {
  return request.cookies
    .getAll()
    .some(
      ({ name, value }) =>
        name.startsWith(`${COGNITO_COOKIE_PREFIX}.`) &&
        name.endsWith(".idToken") &&
        value.length > 0,
    );
}

function unauthorized() {
  return NextResponse.json<ApiResponse<null>>(
    { data: null, error: "Necesitas iniciar sesión para hacer esto." },
    { status: 401 },
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = hasSessionCookie(request);
  const isApiRoute = pathname.startsWith("/api/");

  // Una llamada de API sin sesión recibe 401, no una redirección: devolver HTML
  // de login a un `fetch` que espera JSON rompe al cliente en vez de informarlo.
  if (isApiRoute) {
    return isAuthenticated ? NextResponse.next() : unauthorized();
  }

  if (!isAuthenticated && pathname !== LOGIN_PATH) {
    const url = request.nextUrl.clone();
    url.pathname = LOGIN_PATH;
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (isAuthenticated && pathname === LOGIN_PATH) {
    const url = request.nextUrl.clone();
    url.pathname = HOME_PATH;
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  /*
   * Todo salvo los recursos internos de Next y los estáticos: si el middleware
   * redirigiera el CSS o las fuentes, la propia pantalla de login se vería rota.
   */
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2)$).*)",
  ],
};
