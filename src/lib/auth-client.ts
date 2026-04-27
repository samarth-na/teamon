import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  fetchOptions: {
    headers: {
      "Content-Type": "application/json",
    },
  },
});

export const { signIn, signUp, signOut, useSession } = authClient;
