import { Link } from "react-router-dom";
import { IoLocationOutline, IoLayersOutline, IoHomeOutline } from "react-icons/io5";
import Button from "../ui/Button";

export default function ApartmentCard({ apartment, showDetails = true }) {
  return (
    <div className="glass-card group overflow-hidden p-0 hover:-translate-y-1">
      <div className="relative h-48 overflow-hidden">
        <img
          src={apartment.image}
          alt={apartment.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <h3 className="absolute bottom-4 left-4 text-xl font-bold text-white">{apartment.name}</h3>
      </div>
      <div className="p-5 space-y-3">
        <p className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <IoLocationOutline className="w-4 h-4 shrink-0" />
          {apartment.address}
        </p>
        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
            <IoLayersOutline className="w-4 h-4 text-primary-500" />
            {apartment.totalFloors} Floors
          </span>
          <span className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
            <IoHomeOutline className="w-4 h-4 text-green-500" />
            {apartment.availableRooms} Flats Available
          </span>
        </div>
        {showDetails && (
          <Link to={`/apartments/${apartment.id}/floors`}>
            <Button className="w-full mt-2">View Details</Button>
          </Link>
        )}
      </div>
    </div>
  );
}
