import { useState } from "react";
import { Link } from "react-router-dom";
import { IoSearch, IoArrowForward, IoShieldCheckmark, IoFlash, IoHeadset } from "react-icons/io5";
import { useApp } from "../context/AppContext";
import ApartmentCard from "../components/cards/ApartmentCard";
import Button from "../components/ui/Button";
import SearchBar from "../components/ui/SearchBar";
import { CardSkeleton } from "../components/ui/Skeleton";

export default function LandingPage() {
  const { apartments } = useApp();
  const [search, setSearch] = useState("");
  const [loading] = useState(false);

  const filtered = apartments.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-bg opacity-95" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1920&h=600&fit=crop')] bg-cover bg-center opacity-20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-32 text-center">
          <p className="text-blue-200 text-sm font-medium mb-3 animate-slide-up">Apartment Rental Management System</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 animate-slide-up">
            Find Your Perfect <span className="text-blue-200">Flat in India</span>
          </h1>
          <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto mb-8 animate-slide-up" style={{ animationDelay: "100ms" }}>
            RentEase — your Flat Management Portal. Browse flats across Hyderabad, Bengaluru, Chennai & more. Pay rent in ₹, track society bills, and raise complaints online.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: "200ms" }}>
            <Link to="/apartments">
              <Button size="lg" className="!bg-white !text-primary-700 hover:!bg-blue-50">
                Browse Flats <IoArrowForward />
              </Button>
            </Link>
            <Link to="/admin/login">
              <Button size="lg" variant="outline" className="!border-white !text-white hover:!bg-white/10">
                Flat Management Portal
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { icon: IoShieldCheckmark, title: "Gated Society Security", desc: "24/7 security with CCTV and visitor management" },
            { icon: IoFlash, title: "Online Rent & Bills", desc: "Pay house rent, electricity & maintenance in ₹ (INR)" },
            { icon: IoHeadset, title: "Society Support", desc: "Raise complaints for lift, water, power & drainage" },
          ].map((f) => (
            <div key={f.title} className="glass-card text-center hover:-translate-y-1">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl gradient-bg flex items-center justify-center">
                <f.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{f.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Apartments Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Featured Apartments & Flats</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Explore flats in Hyderabad, Bengaluru, Chennai, Vijayawada & Visakhapatnam</p>
          </div>
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search apartments..."
            className="sm:w-80"
          />
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <IoSearch className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No apartments found matching your search.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((apt, i) => (
              <div key={apt.id} className="animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                <ApartmentCard apartment={apt} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-8 text-center text-sm text-gray-500">
        <p>&copy; 2026 RentEase — Apartment Rental Management System. All rights reserved.</p>
      </footer>
    </div>
  );
}
