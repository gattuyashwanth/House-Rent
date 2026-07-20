import {
  IoBusiness,
  IoLayers,
  IoBedOutline,
  IoCheckmarkCircle,
  IoCloseCircle,
  IoChatbox,
} from "react-icons/io5";
import { useApp } from "../context/AppContext";
import StatCard from "../components/ui/StatCard";
import PageHeader from "../components/ui/PageHeader";
import Badge from "../components/ui/Badge";
import { COMPLAINT_STATUSES } from "../utils/constants";
import { formatDateTime } from "../utils/formatters";

export default function AdminDashboardPage() {
  const { stats, complaints } = useApp();

  const recentComplaints = [...complaints]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const getStatusColor = (status) =>
    COMPLAINT_STATUSES.find((s) => s.value === status)?.color || "gray";

  return (
    <div className="animate-fade-in space-y-6 max-w-full">
      <PageHeader title="Admin Dashboard" subtitle="Society overview — flats, residents & bills in ₹ (INR)" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard title="Apartments" value={stats.totalApartments} icon={IoBusiness} color="primary" />
        <StatCard title="Floors" value={stats.totalFloors} icon={IoLayers} color="indigo" />
        <StatCard title="Total Flats" value={stats.totalRooms} icon={IoBedOutline} color="purple" />
        <StatCard title="Occupied Flats" value={stats.occupiedRooms} icon={IoCloseCircle} color="red" />
        <StatCard title="Vacant Flats" value={stats.vacantRooms} icon={IoCheckmarkCircle} color="green" />
        <StatCard title="Pending Complaints" value={stats.pendingComplaints} icon={IoChatbox} color="yellow" />
      </div>

      <div className="glass-card overflow-hidden border border-gray-100/15 p-6 shadow-xl rounded-2xl bg-white/75 dark:bg-gray-900/70 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">Recent Complaints</h2>
          <span className="text-xs bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 font-semibold px-2.5 py-1 rounded-full border border-primary-100/50 dark:border-primary-900/20 shadow-sm">
            Latest 5
          </span>
        </div>
        <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-800/40 shadow-inner">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-800/30 border-b border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400">
                <th className="text-left py-4 px-4 font-semibold uppercase tracking-wider text-xs">Tenant</th>
                <th className="text-left py-4 px-4 font-semibold uppercase tracking-wider text-xs">Flat</th>
                <th className="text-left py-4 px-4 font-semibold uppercase tracking-wider text-xs hidden sm:table-cell">Description</th>
                <th className="text-left py-4 px-4 font-semibold uppercase tracking-wider text-xs">Status</th>
                <th className="text-left py-4 px-4 font-semibold uppercase tracking-wider text-xs hidden md:table-cell">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentComplaints.map((c) => (
                <tr key={c.id} className="border-b border-gray-100/50 dark:border-gray-800/35 last:border-0 hover:bg-gray-50/40 dark:hover:bg-gray-800/20 transition-all align-middle">
                  <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">{c.tenantName}</td>
                  <td className="py-4 px-4 text-gray-600 dark:text-gray-300 font-semibold">{c.roomNumber}</td>
                  <td className="py-4 px-4 hidden sm:table-cell truncate max-w-xs text-gray-500 dark:text-gray-400">{c.description}</td>
                  <td className="py-4 px-4">
                    <Badge color={getStatusColor(c.status)}>
                      {COMPLAINT_STATUSES.find((s) => s.value === c.status)?.label}
                    </Badge>
                  </td>
                  <td className="py-4 px-4 hidden md:table-cell text-gray-400 dark:text-gray-500 text-xs font-medium">{formatDateTime(c.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
