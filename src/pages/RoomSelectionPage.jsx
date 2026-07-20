import { useParams } from "react-router-dom";
import { useApp } from "../context/AppContext";
import RoomCard from "../components/cards/RoomCard";
import PageHeader from "../components/ui/PageHeader";
import Breadcrumb from "../components/ui/Breadcrumb";
import Badge from "../components/ui/Badge";

export default function RoomSelectionPage() {
  const { id, floorId } = useParams();
  const { apartments, floors, rooms } = useApp();

  const apartment = apartments.find((a) => a.id === id);
  const floor = floors.find((f) => f.id === floorId);
  const floorRooms = rooms.filter((r) => r.floorId === floorId);
  const vacant = floorRooms.filter((r) => r.status === "vacant").length;
  const occupied = floorRooms.filter((r) => r.status === "occupied").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <Breadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "Apartments", to: "/apartments" },
          { label: apartment?.name, to: `/apartments/${id}/floors` },
          { label: floor?.name },
        ]}
      />
      <PageHeader
        title={`${floor?.name} — Flat Selection`}
        subtitle="Green = Vacant | Red = Occupied. Click an occupied flat to login."
        action={
          <div className="flex gap-2">
            <Badge color="green">{vacant} Vacant</Badge>
            <Badge color="red">{occupied} Occupied</Badge>
          </div>
        }
      />
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {floorRooms.map((room, i) => (
          <div key={room.id} className="animate-slide-up" style={{ animationDelay: `${i * 80}ms` }}>
            <RoomCard room={room} />
          </div>
        ))}
      </div>
    </div>
  );
}
