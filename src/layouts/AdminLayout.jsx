import { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import {
  IoGridOutline,
  IoBusinessOutline,
  IoLayersOutline,
  IoBedOutline,
  IoPeopleOutline,
  IoReceiptOutline,
  IoChatboxOutline,
} from "react-icons/io5";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

const adminLinks = [
  { to: "/admin/dashboard", label: "Dashboard", icon: IoGridOutline },
  { to: "/admin/apartments", label: "Apartments", icon: IoBusinessOutline },
  { to: "/admin/floors", label: "Floors", icon: IoLayersOutline },
  { to: "/admin/rooms", label: "Flats", icon: IoBedOutline },
  { to: "/admin/tenants", label: "Residents", icon: IoPeopleOutline },
  { to: "/admin/bills", label: "Bills", icon: IoReceiptOutline },
  { to: "/admin/complaints", label: "Complaints", icon: IoChatboxOutline },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAdminAuthenticated, admin, logoutAdmin } = useAuth();

  console.log("ADMIN:", admin);
  console.log("AUTH:", isAdminAuthenticated);
  if (!isAdminAuthenticated) return <Navigate to="/admin/login" replace />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      <Navbar
        onMenuClick={() => setSidebarOpen(true)}
        showNotifications
        userName={admin?.name}
      />
      <div className="flex flex-1">
        <div className={`${sidebarOpen ? "block" : "hidden"} lg:block`}>
          <Sidebar
            links={adminLinks}
            onClose={() => setSidebarOpen(false)}
            onLogout={logoutAdmin}
            title="Flat Management Portal"
          />
        </div>
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
