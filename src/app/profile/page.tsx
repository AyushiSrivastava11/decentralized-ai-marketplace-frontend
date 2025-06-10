"use client";

import { useState } from "react";
import { AuthGuard } from "@/components/AuthGuard";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { UpdateProfileForm } from "@/components/UpdateProfileForm";
import { DeleteAccountCard } from "@/components/DeleteCard";
export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<"get" | "update" | "delete" | "admin">("get");

  const menuItems = [
    { key: "get", label: "Get My Profile" },
    { key: "update", label: "Update My Profile" },
    ...(user?.role === "ADMIN" ? [{ key: "admin", label: "Admin" }] : []),
    { key: "delete", label: "Delete My Profile" },
  ];

  const renderProfileDetails = () => {
    if (!user) return null;

    return (
      <div className="space-y-2">
        <div>
          <span className="font-semibold">Name:</span> {user.name}
        </div>
        <div>
          <span className="font-semibold">Email:</span> {user.email}
        </div>
        <div>
          <span className="font-semibold">Role:</span> {user.role}
        </div>
        <div>
          <span className="font-semibold">Developer:</span> {user.isDeveloper ? "Yes" : "No"}
        </div>
        <div>
          <span className="font-semibold">Member since:</span>{" "}
          {new Date(user.createdAt).toLocaleDateString()}
        </div>
        <div>
          <span className="font-semibold">Last updated:</span>{" "}
          {new Date(user.updatedAt).toLocaleDateString()}
        </div>
        <div>
          <span className="font-semibold">Uploaded Workers:</span>{" "}
          {user.uploadedWorkers?.length || "None"}
        </div>
        <div>
          <span className="font-semibold">Jobs:</span> {user.jobs?.length || "None"}
        </div>
        <div>
          <span className="font-semibold">Reviews:</span> {user.reviews?.length || "None"}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "get":
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">My Profile</h2>
            <div className="border p-4 rounded bg-gray-50">{renderProfileDetails()}</div>
          </div>
        );
      case "update":
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Update Profile</h2>
            <UpdateProfileForm /> {/* Use the actual form here */}
          </div>
        );
      
      case "admin":
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4 text-purple-600">Admin Panel</h2>
            <p>Admin functionality goes here.</p>
          </div>
        );

        case "delete":
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4 text-red-600">Delete Profile</h2>
            <DeleteAccountCard/>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <AuthGuard>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Profile</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar menu */}
          <div className="md:col-span-1 space-y-2">
            {menuItems.map((item) => (
              <Button
                key={item.key}
                variant={activeTab === item.key ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => setActiveTab(item.key as any)}
              >
                {item.label}
              </Button>
            ))}
          </div>

          {/* Content */}
          <div className="md:col-span-3 space-y-6">
            {isLoading ? <p>Loading...</p> : renderContent()}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
