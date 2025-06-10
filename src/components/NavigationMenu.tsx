"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { useEffect, useState } from "react";
import { toast } from "sonner"; // optional

export function NavigationMenu() {
  const { user, logout, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [profileImage, setProfileImage] = useState<string>("");

  useEffect(() => {
    setMounted(true);

    // Pick a random profile image
    const randomIndex = Math.floor(Math.random() * 10) + 1; // 1 to 10
    setProfileImage(`/profile-images/${randomIndex}.jpg`);
  }, []);

  if (!mounted || isLoading) return null;

  const handleLogout = async () => {
    setShowLogoutConfirm(false);
    await logout();
  };

  return (
    <nav className="border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link
              href={user ? "/dashboard" : "/"}
              className="flex items-center font-bold text-xl"
            >
              AIPLAXE
            </Link>
            {user && (
              <div className="ml-10 flex items-center space-x-4">
                <Link
                  href="/agents"
                  className="text-gray-700 hover:text-gray-900"
                >
                  Browse Agents
                </Link>
                {user.isDeveloper && (
                  <Link
                    href="/upload"
                    className="text-gray-700 hover:text-gray-900"
                  >
                    Upload Agent
                  </Link>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Welcome, {user.name}</span>

                {/* Profile Image */}
                <Link href="/profile" className="flex items-center">
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover cursor-pointer border-2 border-gray-300 hover:border-gray-500 transition"
                  />
                </Link>

                <Button
                  variant="outline"
                  onClick={() => setShowLogoutConfirm(true)}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-[450px]">
            <p className="text-lg font-semibold mb-4">
              Are you sure you want to logout?
            </p>
            <div className="flex justify-end space-x-2">
              <Button
                variant="secondary"
                onClick={() => setShowLogoutConfirm(false)}
              >
                No
              </Button>
              <Button variant="destructive" onClick={handleLogout}>
                Yes
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
