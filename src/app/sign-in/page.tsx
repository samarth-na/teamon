import Link from "next/link";
import { SignInForm } from "@/components/auth/sign-in-form";
import { requireGuest } from "@/lib/session";

export default async function SignInPage() {
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
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground">
              Sign in to your Teamon account
            </p>
          </div>
        </div>

        <SignInForm />

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="font-medium text-primary hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
