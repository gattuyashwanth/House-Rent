import { useState } from "react";
import { useApp } from "../context/AppContext";
import ApartmentCard from "../components/cards/ApartmentCard";
import PageHeader from "../components/ui/PageHeader";
import SearchBar from "../components/ui/SearchBar";
import Breadcrumb from "../components/ui/Breadcrumb";

export default function ApartmentSelectionPage() {
  const { apartments } = useApp();
  const [search, setSearch] = useState("");

  const filtered = apartments.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Apartments" }]} />
      <PageHeader
        title="Select Apartment"
        subtitle="Choose an apartment society to view floors and available flats"
      />
      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search apartments..."
        className="mb-8 max-w-md"
      />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((apt, i) => (
          <div key={apt.id} className="animate-slide-up" style={{ animationDelay: `${i * 80}ms` }}>
            <ApartmentCard apartment={apt} />
          </div>
        ))}
      </div>
    </div>
  );
}
