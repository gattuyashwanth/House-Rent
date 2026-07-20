import { useParams } from "react-router-dom";
import { useApp } from "../context/AppContext";
import FloorCard from "../components/cards/FloorCard";
import PageHeader from "../components/ui/PageHeader";
import Breadcrumb from "../components/ui/Breadcrumb";
import EmptyState from "../components/ui/EmptyState";
import { IoLayersOutline } from "react-icons/io5";

export default function FloorSelectionPage() {
  const { id } = useParams();
  const { apartments, floors, rooms } = useApp();

  const apartment = apartments.find((a) => a.id === id);
  const aptFloors = floors.filter((f) => f.apartmentId === id);

  if (!apartment) {
    return <EmptyState icon={IoLayersOutline} title="Apartment not found" />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <Breadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "Apartments", to: "/apartments" },
          { label: apartment.name },
        ]}
      />
      <PageHeader
        title={apartment.name}
        subtitle={`Select a floor — ${apartment.totalFloors} floors available`}
      />
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {aptFloors.map((floor, i) => (
          <div key={floor.id} className="animate-slide-up" style={{ animationDelay: `${i * 80}ms` }}>
            <FloorCard
              floor={floor}
              apartmentId={id}
              roomCount={rooms.filter((r) => r.floorId === floor.id).length}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
