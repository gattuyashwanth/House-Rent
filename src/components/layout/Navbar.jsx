import { Link } from "react-router-dom";
import { IoMoon, IoSunny, IoMenu, IoHome } from "react-icons/io5";
import { useTheme } from "../../context/ThemeContext";
import NotificationDropdown from "./NotificationDropdown";

export default function Navbar({ onMenuClick, showNotifications = false, userName }) {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <header className="sticky top-0 z-40 glass border-b border-gray-200/50 dark:border-gray-700/50">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        <div className="flex items-center gap-3">
          {onMenuClick && (
            <button onClick={onMenuClick} className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800">
              <IoMenu className="w-5 h-5" />
            </button>
          )}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
              <IoHome className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-gradient hidden sm:block">RentEase</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {userName && (
            <span className="text-sm text-gray-600 dark:text-gray-300 hidden sm:block mr-2">
              Welcome, <span className="font-medium">{userName}</span>
            </span>
          )}
          {showNotifications && <NotificationDropdown />}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <IoSunny className="w-5 h-5 text-yellow-400" /> : <IoMoon className="w-5 h-5 text-gray-600" />}
          </button>
        </div>
      </div>
    </header>
  );
}
