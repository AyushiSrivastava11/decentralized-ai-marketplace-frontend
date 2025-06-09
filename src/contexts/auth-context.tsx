"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
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

// console.log('Auth check response:', response);

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        console.log("Running auth check...");
        console.log("User from API:", userData);
        // Redirect only if not already on dashboard
        if (pathname === "/login") {
          router.replace("/dashboard");
        }
      } else {
              console.log('Not authenticated, redirecting to login');
        setUser(null);
        // Optionally redirect to login page if not authenticated
        // if (pathname !== "/login") {
        //   router.replace(`/login?from=${pathname}`);
        // }
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
      // Optionally redirect to login page if there was an error
      // if (pathname !== "/login") {
      //   router.replace(`/login?from=${pathname}`);
      // }
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
      setUser(userData);
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
      setUser(userData);
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
    router.replace("/");
  } catch (error) {
    console.error("Logout failed:", error);
  }
}


  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
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
