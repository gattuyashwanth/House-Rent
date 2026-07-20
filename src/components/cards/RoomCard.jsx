import { Link } from "react-router-dom";
import { IoBedOutline, IoCheckmarkCircle, IoCloseCircle } from "react-icons/io5";
import Badge from "../ui/Badge";

export default function RoomCard({ room }) {
  const isVacant = room.status === "vacant";

  return (
    <Link to={isVacant ? "#" : `/tenant/login/${room.id}`} className={isVacant ? "pointer-events-none" : ""}>
      <div
        className={`glass-card group hover:-translate-y-1 cursor-pointer text-center border-2 transition-colors ${
          isVacant
            ? "border-green-200 dark:border-green-800/50 hover:border-green-400"
            : "border-red-200 dark:border-red-800/50 hover:border-red-400"
        }`}
      >
        <div
          className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform ${
            isVacant ? "bg-gradient-to-br from-green-500 to-green-600" : "bg-gradient-to-br from-red-500 to-red-600"
          }`}
        >
          <IoBedOutline className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Flat {room.roomNumber}</h3>
        <div className="mt-2 flex items-center justify-center gap-1">
          {isVacant ? (
            <>
              <IoCheckmarkCircle className="w-4 h-4 text-green-500" />
              <Badge color="green">Vacant</Badge>
            </>
          ) : (
            <>
              <IoCloseCircle className="w-4 h-4 text-red-500" />
              <Badge color="red">Occupied</Badge>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
