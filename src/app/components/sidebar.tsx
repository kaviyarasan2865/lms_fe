import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GraduationCap,
  Users,
  UserCheck,
  BookOpen,
  BarChart3,
  Menu,
  X,
  Home,
} from "lucide-react";

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: Home, href: "/admin-dashboard" },
  { id: "batches", label: "Batch Management", icon: GraduationCap, href: "/admin-dashboard/batch" },
  { id: "students", label: "Student Management", icon: Users, href: "/admin-dashboard/student" },
  { id: "faculty", label: "Faculty Management", icon: UserCheck, href: "/admin-dashboard/faculty" },
  { id: "quiz", label: "Quiz Creation", icon: BookOpen, href: "/admin-dashboard/quiz-management" },
  { id: "analytics", label: "Quiz Analytics", icon: BarChart3, href: "/admin-dashboard/quiz-analytics" },
];

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div
      className={`bg-white border-r border-gray-200 transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      } min-h-screen flex flex-col shadow-sm`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {!isCollapsed && (
          <div>
            <h2 className="text-lg font-semibold text-gray-800">LMS Admin</h2>
            <p className="text-xs text-gray-500">NEET PG Platform</p>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          suppressHydrationWarning
        >
          {isCollapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  title={isCollapsed ? item.label : undefined}
                  suppressHydrationWarning
                >
                  <Icon size={20} className="flex-shrink-0" />
                  {!isCollapsed && <span className="font-medium">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        {!isCollapsed && (
          <div className="text-xs text-gray-500">
            <p>College Admin Portal</p>
            <p>v1.0.0</p>
          </div>
        )}
      </div>
    </div>
  );
};
