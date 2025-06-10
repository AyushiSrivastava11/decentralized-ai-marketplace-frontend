"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function DeleteAccountCard() {
  const { deleteAccount } = useAuth(); // you said this API is ready
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDeleted, setIsDeleted] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await deleteAccount();
      setIsDeleted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (isDeleted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">Account Deleted</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-lg">Your account has been deleted. We will miss you!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-red-600 text-center">YOU ARE LEAVING?</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 text-center">
        {/* Sad image placeholder */}
        <img
          src="/profile-images/deleteAccount.png" 
          alt="Sad face"
          className="mx-auto w-32 h-40"
        />

        {/* Confirmation text */}
        <p className="text-lg">
          We will miss you! Are you sure you want to delete your account? This action cannot be undone.
        </p>

        {error && <p className="text-sm text-red-600">{error}</p>}
      </CardContent>

      <CardFooter className="justify-center">
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={isLoading}
        >
          {isLoading ? "Deleting..." : "Yes, Delete My Account"}
        </Button>
      </CardFooter>
    </Card>
  );
}
