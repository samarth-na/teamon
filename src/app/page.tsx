import AppShell from "@/components/app/app-shell";
import { requireAuth } from "@/lib/session";

export default async function Home() {
  await requireAuth();

  return <AppShell />;
}
