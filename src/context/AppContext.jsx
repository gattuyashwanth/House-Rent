import { createContext, useContext, useState, useMemo, useEffect } from "react";
import { apiFetch } from "../utils/api";
import {
  mapApartment,
  mapFloor,
  mapRoom,
  mapTenant,
  mapBill,
  mapComplaint,
  mapNotification,
} from "../utils/mappers";
import { useAuth } from "./AuthContext";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [apartments, setApartments] = useState([]);
  const [floors, setFloors] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [bills, setBills] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const { isTenantAuthenticated, isAdminAuthenticated } = useAuth();

  const stats = useMemo(() => ({
    totalApartments: apartments.length,
    totalFloors: floors.length,
    totalRooms: rooms.length,
    occupiedRooms: rooms.filter((r) => r.status === "occupied").length,
    vacantRooms: rooms.filter((r) => r.status === "vacant").length,
    pendingComplaints: complaints.filter((c) => c.status === "pending").length,
  }), [apartments, floors, rooms, complaints]);

  const fetchPublicData = async () => {
    setLoading(true);
    try {
      const [aptsRes, floorsRes, roomsRes] = await Promise.all([
        apiFetch("/apartments").catch(() => ({ data: [] })),
        apiFetch("/floors").catch(() => ({ data: [] })),
        apiFetch("/rooms").catch(() => ({ data: [] })),
      ]);

      const rawApts = aptsRes.data || [];
      const rawFloors = floorsRes.data || [];
      const rawRooms = roomsRes.data || [];

      const mappedApts = rawApts.map(mapApartment);
      const mappedFloors = rawFloors.map(mapFloor);
      const mappedRooms = rawRooms.map((rm) => mapRoom(rm, mappedFloors));

      mappedApts.forEach((apt) => {
        apt.availableRooms = mappedRooms.filter(
          (r) => r.apartmentId === apt.id && r.status === "vacant"
        ).length;
      });

      setApartments(mappedApts);
      setFloors(mappedFloors);
      setRooms(mappedRooms);
    } catch (err) {
      console.error("Failed to load public backend data", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      await fetchPublicData();

      const [tenantsRes, billsRes, complaintsRes, notificationsRes] = await Promise.all([
        apiFetch("/tenants").catch(() => ({ data: [] })),
        apiFetch("/bills").catch(() => ({ data: [] })),
        apiFetch("/complaints").catch(() => ({ data: [] })),
        apiFetch("/notifications").catch(() => ({ data: [] })),
      ]);

      setTenants(tenantsRes.data ? tenantsRes.data.map(mapTenant) : []);
      setBills(billsRes.data ? billsRes.data.map(mapBill) : []);
      setComplaints(complaintsRes.data ? complaintsRes.data.map(mapComplaint) : []);
      setNotifications(notificationsRes.data ? notificationsRes.data.map(mapNotification) : []);
    } catch (err) {
      console.error("Failed to load admin backend data", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTenantData = async () => {
    setLoading(true);
    try {
      await fetchPublicData();

      const [billsRes, complaintsRes, notificationsRes] = await Promise.all([
        apiFetch("/tenant/bills").catch(() => ({ data: [] })),
        apiFetch("/tenant/complaints").catch(() => ({ data: [] })),
        apiFetch("/tenant/notifications").catch(() => ({ data: [] })),
      ]);

      setBills(billsRes.data ? billsRes.data.map(mapBill) : []);
      setComplaints(complaintsRes.data ? complaintsRes.data.map(mapComplaint) : []);
      setNotifications(notificationsRes.data ? notificationsRes.data.map(mapNotification) : []);
    } catch (err) {
      console.error("Failed to load tenant backend data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isCancelled = false;
    const loadData = async () => {
      if (isAdminAuthenticated) {
        await fetchAdminData();
      } else if (isTenantAuthenticated) {
        await fetchTenantData();
      } else {
        await fetchPublicData();
        if (!isCancelled) {
          setTenants([]);
          setBills([]);
          setComplaints([]);
          setNotifications([]);
        }
      }
    };
    loadData();
    return () => {
      isCancelled = true;
    };
  }, [isAdminAuthenticated, isTenantAuthenticated]);

  const addNotification = () => {
    // Notifications are generated on the backend (e.g. when complaint is created)
    // We fetch notifications to keep them in sync, so this can be a no-op
  };

  const markNotificationRead = async (id) => {
    try {
      if (isAdminAuthenticated) {
        await apiFetch(`/notifications/${id}/read`, { method: "PATCH" });
      }
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error("Error marking notification read", err);
    }
  };

  const markAllNotificationsRead = async () => {
    try {
      if (isAdminAuthenticated) {
        await apiFetch(`/notifications/read-all`, { method: "PATCH" });
      }
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error("Error marking all notifications read", err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const value = {
    apartments,
    setApartments,
    floors,
    setFloors,
    rooms,
    setRooms,
    tenants,
    setTenants,
    bills,
    setBills,
    complaints,
    setComplaints,
    notifications,
    setNotifications,
    stats,
    unreadCount,
    addNotification,
    markNotificationRead,
    markAllNotificationsRead,
    loading,
    refreshAdminData: fetchAdminData,
    refreshTenantData: fetchTenantData,
    refreshPublicData: fetchPublicData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};
