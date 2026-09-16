import { fetchAuthSession, signIn, SignInOutput, signOut } from "aws-amplify/auth";

export async function login(
  username: string,
  password: string,
): Promise<SignInOutput> {
  return signIn({
    username,
    password,
    options: { authFlowType: "USER_PASSWORD_AUTH" },
  });
}

export async function logout(): Promise<void> {
  await signOut();
}

export async function getIdToken(): Promise<string | null> {
  const session = await fetchAuthSession();
  return session.tokens?.idToken?.toString() ?? null;
}