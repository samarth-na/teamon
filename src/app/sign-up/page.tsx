import Link from "next/link";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { requireGuest } from "@/lib/session";

export default async function SignUpPage() {
  await requireGuest();

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">
            T
          </div>
          <div className="text-center">
            <h1 className="font-semibold text-lg tracking-tight">
              Create your account
            </h1>
            <p className="text-sm text-muted-foreground">
              Start managing your tasks with Teamon
            </p>
          </div>
        </div>

        <SignUpForm />

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-medium text-primary hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
