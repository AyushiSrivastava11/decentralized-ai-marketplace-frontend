"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

interface Purchase {
  // Add only fields you will use on frontend
  id: string;
  // e.g., workerId: string; createdAt: string; etc.
}

interface AIWorker {
  id: string;
  name: string;
  // etc.
}

interface Job {
  id: string;
  // etc.
}

interface Review {
  id: string;
  // etc.
}

interface User {
  id: string;
  email: string;
  name: string;
  isDeveloper: boolean;
  role: string;
  createdAt: string;
  updatedAt: string;
  // purchases: Purchase[];
  uploadedWorkers: AIWorker[];
  jobs: Job[];
  reviews: Review[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  updateProfile: (updatedData: {
    name: string;
    isDeveloper: boolean;
  }) => Promise<void>;

  isLoading: boolean;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/check-auth`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user); // <--- FIXED HERE
        console.log("Running auth check...");
        console.log("User from API:", data.user);
        if (pathname === "/login") {
          router.replace("/dashboard");
        }
      } else {
        console.log("Not authenticated, redirecting to login");
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  async function login(email: string, password: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const userData = await response.json();
      setUser(userData); // login API returns user object directly (no wrapper)
      toast.success("Login successful! Redirecting to dashboard...");
      await new Promise((resolve) => setTimeout(resolve, 300));
      console.log("Login successful. Redirecting to dashboard...");
      router.replace("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      throw new Error("Login failed. Please check your credentials.");
    }
  }

  async function signup(email: string, password: string, name: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Signup failed");
      }

      const userData = await response.json();
      setUser(userData); // register API returns user object directly (no wrapper)
      toast.success("Account created! Redirecting to dashboard...");
      await new Promise((resolve) => setTimeout(resolve, 300));
      router.push("/dashboard");
    } catch (error) {
      console.error("Signup error:", error);
      throw new Error("Signup failed. Please try again.");
    }
  }

  async function logout() {
    try {
      await fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
        method: "GET",
        credentials: "include",
      });
      setUser(null);
      toast.success("Logged out successfully.");
      await new Promise((resolve) => setTimeout(resolve, 300));
      router.replace("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  async function updateProfile(updatedData: {
    name: string;
    isDeveloper: boolean;
  }) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/user/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updatedData),
      });
      console.log(response);
      console.log("Updating profile with data:", updatedData);

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const updatedUser = await response.json();
      setUser(updatedUser.user); // update user in context to reflect changes!

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Profile update failed:", error);
      throw new Error("Profile update failed. Please try again.");
    }
  }

  async function deleteAccount() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/user/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      console.log("Deleting account...");
      if (!response.ok) {
        throw new Error("Failed to delete account");
      }
      const result = await response.json();
      console.log("Account deleted successfully:", result);
      setUser(null); // Clear user from context
      toast.success("Account deleted successfully. We're sad to see you go!");
      await new Promise((resolve) => setTimeout(resolve, 300));
      router.replace("/"); // Redirect to home page after deletion
    } catch (error) {
      console.error("Delete account failed:", error);
      throw new Error("Delete account failed. Please try again.");
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        updateProfile,
        deleteAccount,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
