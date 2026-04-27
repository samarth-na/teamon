import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export async function getSession() {
  return auth.api.getSession({
    headers: await headers(),
  });
}

export async function requireAuth() {
  const session = await getSession();

  if (!session) {
    redirect("/sign-in");
  }

  return session;
}

export async function requireGuest() {
  const session = await getSession();

  if (session) {
    redirect("/");
  }
}
