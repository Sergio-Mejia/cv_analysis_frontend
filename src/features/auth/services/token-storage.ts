"use client";

import { cognitoUserPoolsTokenProvider } from "aws-amplify/auth/cognito";
import { CookieStorage } from "aws-amplify/utils";

/** Días que sobrevive la sesión cuando se marca «Mantener la sesión abierta». */
const REMEMBER_ME_DAYS = 30;

export function setSessionPersistence(rememberMe: boolean): void {
  cognitoUserPoolsTokenProvider.setKeyValueStorage(
    new CookieStorage({
      path: "/",
      sameSite: "strict",
      // En local la app va por http, donde una cookie `secure` no se guarda.
      secure: window.location.protocol === "https:",
      ...(rememberMe ? { expires: REMEMBER_ME_DAYS } : {}),
    }),
  );
}
