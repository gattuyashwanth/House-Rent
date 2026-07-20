import { NavLink, useNavigate } from "react-router-dom";
import { IoClose, IoLogOut } from "react-icons/io5";

export default function Sidebar({ links, onClose, onLogout, title = "Menu" }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
      <aside className="fixed top-0 left-0 h-full w-64 glass z-50 lg:static lg:z-auto flex flex-col animate-slide-up lg:animate-none">
        <div className="flex items-center justify-between p-4 border-b border-gray-200/50 dark:border-gray-700/50 lg:hidden">
          <span className="font-semibold text-gray-900 dark:text-white">{title}</span>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <IoClose className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary-600 text-white shadow-lg shadow-primary-600/25"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`
              }
            >
              <link.icon className="w-5 h-5" />
              {link.label}
            </NavLink>
          ))}
        </nav>

        {onLogout && (
          <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <IoLogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
