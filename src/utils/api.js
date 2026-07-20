const BASE_URL = "http://localhost:5000/api";

export const getAuthToken = () => {
  return localStorage.getItem("rentease-token");
};

export const apiFetch = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const headers = { ...options.headers };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const url = `${BASE_URL}${endpoint.startsWith("/") ? endpoint : "/" + endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("rentease-token");
      localStorage.removeItem("rentease-admin");
      localStorage.removeItem("rentease-tenant");
      window.dispatchEvent(new Event("rentease-unauthorized"));
    }
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.message || `Request failed with status ${response.status}`);
  }

  return response.json();
};
