"use client";

import { useState } from "react";
import { AdminGuard } from "@/components/Admin/AdminGuard";
import Sidebar from "@/components/Admin/Sidebar";
import PendingWorkers from "@/components/Admin/PendingWorkers";
import Users from "@/components/Admin/Users";
// import AIWorkers from "@/components/Admin/AiWorkers";
import { useRouter } from "next/navigation";
import AIWorkers from "@/components/Admin/AiWorkers";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("pending");
  const router = useRouter();

  const handleLogout = () => {
    router.push("/profile");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "pending":
        return <PendingWorkers />;
      case "users":
        return <Users/>;
      case "ai":
        return <AIWorkers/>;
      default:
        return null;
    }
  };

  return (
    <AdminGuard>
      <div className="flex min-h-screen">
        <Sidebar onSelect={setActiveTab} onLogout={handleLogout} activeTab={activeTab}/>
        <div className="flex-1 p-6">{renderContent()}</div>
      </div>
    </AdminGuard>
  );
}
