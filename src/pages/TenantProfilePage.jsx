import { IoCall, IoMail, IoBusiness, IoCalendar, IoHome } from "react-icons/io5";
import { useAuth } from "../context/AuthContext";
import PageHeader from "../components/ui/PageHeader";
import { formatDate } from "../utils/formatters";

export default function TenantProfilePage() {
  const { tenant } = useAuth();

  const fields = [
    { icon: IoHome, label: "Flat Number", value: tenant?.roomNumber },
    { icon: IoCall, label: "Mobile Number", value: tenant?.contact },
    { icon: IoMail, label: "Email", value: tenant?.email },
    { icon: IoBusiness, label: "Apartment", value: tenant?.apartmentName },
    { icon: IoCalendar, label: "Move-in Date", value: tenant?.moveInDate ? formatDate(tenant.moveInDate) : "—" },
  ];

  return (
    <div className="animate-fade-in max-w-2xl">
      <PageHeader title="Profile" subtitle="Resident information and flat details" />

      <div className="glass-card">
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
          <img
            src={tenant?.profilePicture}
            alt={tenant?.name}
            className="w-24 h-24 rounded-2xl object-cover shadow-lg"
          />
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{tenant?.name}</h2>
            <p className="text-gray-500 dark:text-gray-400">Resident — Flat {tenant?.roomNumber}</p>
          </div>
        </div>

        <div className="space-y-4">
          {fields.map((f) => (
            <div key={f.label} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30">
                <f.icon className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{f.label}</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{f.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
