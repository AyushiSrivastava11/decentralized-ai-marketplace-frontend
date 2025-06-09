import Link from "next/link";
import { AuthForm } from "@/components/AuthForm";
import { GuestGuard } from "@/components/GuestGuard";

export default function SignupPage() {
  return (
    <GuestGuard>
      <>
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Create Account</h1>
            <p className="text-gray-600 mt-2">
              Join AIPLAXE to access powerful AI agents
            </p>
          </div>

          <AuthForm mode="signup" />

          <p className="text-center mt-4 text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </>
    </GuestGuard>
  );
}
