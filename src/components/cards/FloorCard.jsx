import { Link } from "react-router-dom";
import { IoLayersOutline } from "react-icons/io5";

export default function FloorCard({ floor, apartmentId, roomCount }) {
  return (
    <Link to={`/apartments/${apartmentId}/floors/${floor.id}/rooms`}>
      <div className="glass-card group hover:-translate-y-1 cursor-pointer text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
          <IoLayersOutline className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{floor.name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{roomCount} Flats</p>
      </div>
    </Link>
  );
}
