"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

interface GuestGuardProps {
  children: React.ReactNode;
}

export function GuestGuard({ children }: GuestGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
  console.log("GuestGuard check → user:", user, "isLoading:", isLoading);
    if (!isLoading && user) {
      // User is logged in → redirect to dashboard
      router.replace("/dashboard");
    }
  }, [user, isLoading, router]);

  if (isLoading) return null; // Optional loading placeholder

  // If not logged in → show the children (login/signup form)
  return <>{children}</>;
}
