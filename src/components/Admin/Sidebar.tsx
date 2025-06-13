// components/Admin/Sidebar.tsx

import { FaUsers, FaUserClock, FaRobot, FaSignOutAlt } from "react-icons/fa";
import { Button } from "@/components/ui/button";

type SidebarProps = {
  onSelect: (tab: string) => void;
  onLogout: () => void;
  activeTab?: string;
};

const tabs = [
  { key: "pending", label: "Pending Workers", icon: <FaUserClock /> },
  { key: "users", label: "Users", icon: <FaUsers /> },
  { key: "ai", label: "AI Workers", icon: <FaRobot /> },
];

export default function Sidebar({ onSelect, onLogout, activeTab }: SidebarProps) {
  return (
    <aside className="w-64 bg-gray-100 dark:bg-gray-900 p-4 border-r border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">Admin Panel</h2>

      <nav className="space-y-1">
        {tabs.map((tab) => (
          <Button
            key={tab.key}
            variant="ghost"
            className={`w-full justify-start gap-3 ${
              activeTab === tab.key
                ? "bg-muted text-primary"
                : "text-muted-foreground hover:bg-muted"
            }`}
            onClick={() => onSelect(tab.key)}
          >
            {tab.icon}
            {tab.label}
          </Button>
        ))}
      </nav>

      <div className="mt-2">
        <Button
          variant="ghost"
          className="text-red-600 hover:text-red-800 w-full justify-start gap-3"
          onClick={onLogout}
        >
          <FaSignOutAlt />
          Logout
        </Button>
      </div>
    </aside>
  );
}
