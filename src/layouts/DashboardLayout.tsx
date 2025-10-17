import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  LogOut,
  Menu,
  BookOpen,
  GraduationCap,
  Settings,
  FileSpreadsheet,
  Library
} from "lucide-react";

export default function DashboardLayout() {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100 text-gray-800">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-white shadow-lg transition-all duration-300 flex flex-col`}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center gap-2">
            <img
              src="../../public/vite.svg"
              alt="Logo"
              className="w-8 h-8 object-contain"
            />
            {isSidebarOpen && (
              <h1 className="text-lg font-bold text-blue-600">School Admin</h1>
            )}
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-gray-500 hover:text-blue-600"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-5 space-y-1">
          <NavItem
            to="/dashboard"
            label="Dashboard"
            icon={<LayoutDashboard size={20} />}
            isSidebarOpen={isSidebarOpen}
          />
          <NavItem
            to="/dashboard/students"
            label="Students"
            icon={<Users size={20} />}
            isSidebarOpen={isSidebarOpen}
          />
          <NavItem
            to="/dashboard/teachers"
            label="Teachers"
            icon={<GraduationCap size={20} />}
            isSidebarOpen={isSidebarOpen}
          />
          <NavItem
            to="/dashboard/classes"
            label="Classes"
            icon={<BookOpen size={20} />}
            isSidebarOpen={isSidebarOpen}
          />
          <NavItem
            to="/settings/export"
            label="Data Export / Import"
            icon={<FileSpreadsheet size={20} />}
            isSidebarOpen={isSidebarOpen}
          />

          { <NavItem
            to="/dashboard/ledger"
            label="Ledger"
            icon={<Library size={20} />}
            isSidebarOpen={isSidebarOpen}
          />  }
          {/* <NavItem
            to="/dashboard/settings"
            label="Settings"
            icon={<Settings size={20} />}
            isSidebarOpen={isSidebarOpen}
          />  */}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-500 hover:text-red-600 w-full"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        {/* <header className="h-14 bg-white shadow flex items-center justify-between px-6">
          <h2 className="text-lg font-semibold text-gray-700">Dashboard</h2>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full font-bold">
              SA
            </div>
          </div>
        </header> */}

        {/* Main Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

/* 🧩 Reusable NavItem component */
function NavItem({ to, label, icon, isSidebarOpen }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-md transition-colors duration-200 ${
          isActive
            ? "bg-blue-100 text-blue-600 font-medium"
            : "text-gray-600 hover:bg-gray-100 hover:text-blue-500"
        }`
      }
    >
      {icon}
      {isSidebarOpen && <span>{label}</span>}
    </NavLink>
  );
}
