import { Link } from "react-router-dom";
import { IoChevronForward } from "react-icons/io5";

export default function Breadcrumb({ items }) {
  return (
    <nav className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mb-6 flex-wrap">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <IoChevronForward className="w-3 h-3" />}
          {item.to ? (
            <Link to={item.to} className="hover:text-primary-600 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 dark:text-white font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
