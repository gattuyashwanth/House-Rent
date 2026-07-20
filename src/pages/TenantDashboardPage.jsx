import { Link } from "react-router-dom";
import {
  IoHome,
  IoFlash,
  IoWater,
  IoConstruct,
  IoPowerOutline,
  IoWallet,
  IoChatboxOutline,
  IoPersonOutline,
} from "react-icons/io5";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import StatCard from "../components/ui/StatCard";
import PageHeader from "../components/ui/PageHeader";
import Badge from "../components/ui/Badge";
import { formatCurrency } from "../utils/formatters";
import { COMPLAINT_STATUSES } from "../utils/constants";

export default function TenantDashboardPage() {
  const { tenant } = useAuth();
  const { bills, complaints } = useApp();

  const tenantBills = bills
    .filter((b) => b.tenantId === tenant?.id)
    .sort((a, b) => b.month.localeCompare(a.month));
  const currentBill = tenantBills[0];

  const tenantComplaints = complaints
    .filter((c) => c.tenantId === tenant?.id)
    .slice(0, 3);

  const getStatusColor = (status) =>
    COMPLAINT_STATUSES.find((s) => s.value === status)?.color || "gray";

  return (
    <div className="animate-fade-in space-y-6 max-w-full">
      <PageHeader
        title="Dashboard"
        subtitle={`Welcome back, ${tenant?.name}`}
      />

      {/* Bill Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard title="House Rent" value={formatCurrency(currentBill?.houseRent || 0)} icon={IoHome} color="primary" />
        <StatCard title="Electricity Bill" value={formatCurrency(currentBill?.electricity || 0)} icon={IoFlash} color="yellow" />
        <StatCard title="Water Bill" value={formatCurrency(currentBill?.water || 0)} icon={IoWater} color="blue" />
        <StatCard title="Maintenance Charges" value={formatCurrency(currentBill?.maintenance || 0)} icon={IoConstruct} color="purple" />
        <StatCard title="Generator Charges" value={formatCurrency(currentBill?.generator || 0)} icon={IoPowerOutline} color="indigo" />
        <StatCard title="Total Amount" value={formatCurrency(currentBill?.total || 0)} icon={IoWallet} color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Complaint */}
        <div className="glass-card flex flex-col justify-between h-full p-6 shadow-xl rounded-2xl border border-gray-100/15 bg-white/75 dark:bg-gray-900/70 backdrop-blur-xl">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">Quick Complaint</h2>
              <Link to="/tenant/complaints" className="text-sm font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors">
                View All
              </Link>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
              Raise society complaints — water, power, lift, drainage & more.
            </p>
          </div>
          <Link to="/tenant/complaints" className="mt-auto block">
            <button className="w-full py-3 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 dark:hover:border-primary-400 hover:bg-primary-50/20 dark:hover:bg-primary-950/10 transition-all text-sm font-semibold cursor-pointer">
              + Submit New Complaint
            </button>
          </Link>
        </div>

        {/* Profile Quick */}
        <div className="glass-card flex items-center h-full p-6 shadow-xl rounded-2xl border border-gray-100/15 bg-white/75 dark:bg-gray-900/70 backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 w-full">
            <img
              src={tenant?.profilePicture}
              alt={tenant?.name}
              className="w-20 h-20 rounded-2xl object-cover shadow-md border-2 border-white dark:border-gray-800"
            />
            <div className="text-center sm:text-left flex-1 min-w-0">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white truncate">{tenant?.name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">Flat {tenant?.roomNumber} — {tenant?.apartmentName}</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1.5 font-medium">{tenant?.contact}</p>
            </div>
            <Link to="/tenant/profile" className="self-center sm:self-start p-3 rounded-xl bg-gray-50 dark:bg-gray-800 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/30 transition-all shadow-sm border border-gray-100/10">
              <IoPersonOutline className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Complaint History */}
        <div className="glass-card lg:col-span-2 p-6 shadow-xl rounded-2xl border border-gray-100/15 bg-white/75 dark:bg-gray-900/70 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
              <IoChatboxOutline className="w-5 h-5 text-primary-500" />
              Complaint History
            </h2>
            <span className="text-xs bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 font-semibold px-2.5 py-1 rounded-full border border-primary-100/50 dark:border-primary-900/20 shadow-sm">
              Recent 3
            </span>
          </div>
          {tenantComplaints.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-8">No complaints submitted yet.</p>
          ) : (
            <div className="space-y-3">
              {tenantComplaints.map((c) => (
                <div key={c.id} className="flex items-center justify-between gap-4 p-4 rounded-xl bg-gray-50/50 dark:bg-gray-800/30 border border-gray-100/30 dark:border-gray-850/20 hover:bg-gray-100/30 dark:hover:bg-gray-850/30 transition-all">
                  <div className="truncate flex-1">
                    {c.category && <p className="text-xs text-primary-600 dark:text-primary-400 font-bold mb-1 uppercase tracking-wide">{c.category}</p>}
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{c.description}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <Badge color={getStatusColor(c.status)}>
                      {COMPLAINT_STATUSES.find((s) => s.value === c.status)?.label}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
