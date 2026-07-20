import { Routes, Route } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import TenantLayout from "../layouts/TenantLayout";
import AdminLayout from "../layouts/AdminLayout";

import LandingPage from "../pages/LandingPage";
import ApartmentSelectionPage from "../pages/ApartmentSelectionPage";
import FloorSelectionPage from "../pages/FloorSelectionPage";
import RoomSelectionPage from "../pages/RoomSelectionPage";
import TenantLoginPage from "../pages/TenantLoginPage";
import TenantDashboardPage from "../pages/TenantDashboardPage";
import ComplaintPage from "../pages/ComplaintPage";
import PaymentPage from "../pages/PaymentPage";
import TenantProfilePage from "../pages/TenantProfilePage";
import AdminLoginPage from "../pages/AdminLoginPage";
import AdminDashboardPage from "../pages/AdminDashboardPage";
import ApartmentManagementPage from "../pages/admin/ApartmentManagementPage";
import FloorManagementPage from "../pages/admin/FloorManagementPage";
import RoomManagementPage from "../pages/admin/RoomManagementPage";
import TenantManagementPage from "../pages/admin/TenantManagementPage";
import BillManagementPage from "../pages/admin/BillManagementPage";
import ComplaintManagementPage from "../pages/admin/ComplaintManagementPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="apartments" element={<ApartmentSelectionPage />} />
        <Route path="apartments/:id/floors" element={<FloorSelectionPage />} />
        <Route path="apartments/:id/floors/:floorId/rooms" element={<RoomSelectionPage />} />
        <Route path="tenant/login/:roomId" element={<TenantLoginPage />} />
      </Route>

      <Route path="tenant" element={<TenantLayout />}>
        <Route path="dashboard" element={<TenantDashboardPage />} />
        <Route path="complaints" element={<ComplaintPage />} />
        <Route path="payments" element={<PaymentPage />} />
        <Route path="profile" element={<TenantProfilePage />} />
      </Route>

      <Route path="admin/login" element={<AdminLoginPage />} />

      <Route path="admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="apartments" element={<ApartmentManagementPage />} />
        <Route path="floors" element={<FloorManagementPage />} />
        <Route path="rooms" element={<RoomManagementPage />} />
        <Route path="tenants" element={<TenantManagementPage />} />
        <Route path="bills" element={<BillManagementPage />} />
        <Route path="complaints" element={<ComplaintManagementPage />} />
      </Route>
    </Routes>
  );
}
