import { createContext, useContext, useState, useEffect } from "react";
import { apiFetch } from "../utils/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [tenant, setTenant] = useState(() => {
    const saved = localStorage.getItem("rentease-tenant");
    return saved ? JSON.parse(saved) : null;
  });
  const [admin, setAdmin] = useState(() => {
    const saved = localStorage.getItem("rentease-admin");
    return saved ? JSON.parse(saved) : null;
  });

  // Event listener for global 401 unauthorized / token expiration
  useEffect(() => {
    const handleUnauthorized = () => {
      setTenant(null);
      setAdmin(null);
    };
    window.addEventListener("rentease-unauthorized", handleUnauthorized);
    return () => window.removeEventListener("rentease-unauthorized", handleUnauthorized);
  }, []);

  const loginTenant = async (roomNumber, password, apartmentId) => {
    try {
      const res = await apiFetch("/tenant/login", {
        method: "POST",
        body: JSON.stringify({ flatNumber: roomNumber, password, apartmentId }),
      });

      if (res.success && res.data) {
        const { token, user } = res.data;
        const mappedUser = {
          id: user.id || user._id,
          name: user.tenantName,
          roomNumber: user.flatNumber,
          contact: user.mobileNumber,
          email: user.email || "",
          apartmentId: user.apartmentId?._id || user.apartmentId,
          apartmentName: user.apartmentId?.apartmentName || "",
          floorNumber: user.floorNumber,
          profilePicture: user.profilePicture || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
          moveInDate: user.createdAt ? user.createdAt.split("T")[0] : new Date().toISOString().split("T")[0],
        };

        // Clear admin session to prevent token/role mismatch
        setAdmin(null);
        localStorage.removeItem("rentease-admin");

        setTenant(mappedUser);
        localStorage.setItem("rentease-token", token);
        localStorage.setItem("rentease-tenant", JSON.stringify(mappedUser));
        return { success: true };
      }
      return { success: false, error: "Login failed" };
    } catch (err) {
      return { success: false, error: err.message || "Invalid room number or password" };
    }
  };

  const logoutTenant = () => {
    setTenant(null);
    localStorage.removeItem("rentease-tenant");
    localStorage.removeItem("rentease-token");
  };

  const loginAdmin = async (email, password) => {
    try {
      const username = email.includes("@") ? email.split("@")[0] : email;

      const res = await apiFetch("/admin/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });

      if (res.success && res.data) {
        const { token, user } = res.data;
        const adminData = {
          id: user.id || user._id,
          email: email,
          name: "Society Admin",
          username: user.username,
          role: user.role,
        };

        // Clear tenant session to prevent token/role mismatch
        setTenant(null);
        localStorage.removeItem("rentease-tenant");

        setAdmin(adminData);
        localStorage.setItem("rentease-token", token);
        localStorage.setItem("rentease-admin", JSON.stringify(adminData));

        return { success: true };
      }
      return { success: false, error: "Login failed" };
    } catch (err) {
      return { success: false, error: err.message || "Invalid admin credentials" };
    }
  };

  const logoutAdmin = () => {
    setAdmin(null);
    localStorage.removeItem("rentease-admin");
    localStorage.removeItem("rentease-token");
  };

  const clearAuth = () => {
    setTenant(null);
    setAdmin(null);
    localStorage.removeItem("rentease-tenant");
    localStorage.removeItem("rentease-admin");
    localStorage.removeItem("rentease-token");
  };

  return (
    <AuthContext.Provider
      value={{
        tenant,
        admin,
        loginTenant,
        logoutTenant,
        loginAdmin,
        logoutAdmin,
        clearAuth,
        isTenantAuthenticated: !!tenant,
        isAdminAuthenticated: !!admin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

