import { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import {
  IoGridOutline,
  IoChatboxOutline,
  IoCardOutline,
  IoPersonOutline,
} from "react-icons/io5";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

const tenantLinks = [
  { to: "/tenant/dashboard", label: "Dashboard", icon: IoGridOutline },
  { to: "/tenant/complaints", label: "Complaints", icon: IoChatboxOutline },
  { to: "/tenant/payments", label: "Rent & Bills", icon: IoCardOutline },
  { to: "/tenant/profile", label: "Profile", icon: IoPersonOutline },
];

export default function TenantLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isTenantAuthenticated, tenant, logoutTenant } = useAuth();

  if (!isTenantAuthenticated) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      <Navbar
        onMenuClick={() => setSidebarOpen(true)}
        userName={tenant?.name}
      />
      <div className="flex flex-1">
        <div className={`${sidebarOpen ? "block" : "hidden"} lg:block`}>
          <Sidebar
            links={tenantLinks}
            onClose={() => setSidebarOpen(false)}
            onLogout={logoutTenant}
            title="Resident Portal"
          />
        </div>
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
