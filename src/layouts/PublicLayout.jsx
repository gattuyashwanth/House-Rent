import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
