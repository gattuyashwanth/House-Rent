import { IoDownloadOutline, IoCheckmarkCircle, IoTimeOutline, IoAlertCircle } from "react-icons/io5";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import PageHeader from "../components/ui/PageHeader";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import StatCard from "../components/ui/StatCard";
import { formatCurrency, formatMonth } from "../utils/formatters";
import { BILL_STATUSES } from "../utils/constants";

export default function PaymentPage() {
  const { tenant } = useAuth();
  const { bills } = useApp();

  const tenantBills = bills
    .filter((b) => b.tenantId === tenant?.id)
    .sort((a, b) => b.month.localeCompare(a.month));

  const currentBill = tenantBills[0];
  const previousBills = tenantBills.slice(1);

  const getStatusColor = (status) =>
    BILL_STATUSES.find((s) => s.value === status)?.color || "gray";

  const statusIcons = {
    paid: IoCheckmarkCircle,
    pending: IoTimeOutline,
    overdue: IoAlertCircle,
  };

  return (
    <div className="animate-fade-in">
      <PageHeader title="Payments" subtitle="View monthly rent and society charges in ₹ (INR)" />

      {currentBill && (
        <div className="glass-card mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Current Month — {formatMonth(currentBill.month)}
              </h2>
              <Badge color={getStatusColor(currentBill.status)} className="mt-2">
                {BILL_STATUSES.find((s) => s.value === currentBill.status)?.label}
              </Badge>
            </div>
            <Button variant="outline" onClick={() => alert("Bill download will be available with backend integration.")}>
              <IoDownloadOutline /> Download Bill
            </Button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <StatCard title="House Rent" value={formatCurrency(currentBill.houseRent)} color="primary" />
            <StatCard title="Electricity Bill" value={formatCurrency(currentBill.electricity)} color="yellow" />
            <StatCard title="Water Bill" value={formatCurrency(currentBill.water)} color="blue" />
            <StatCard title="Maintenance Charges" value={formatCurrency(currentBill.maintenance)} color="purple" />
            <StatCard title="Generator Charges" value={formatCurrency(currentBill.generator || 0)} color="indigo" />
            <StatCard title="Total (INR)" value={formatCurrency(currentBill.total)} color="green" />
          </div>
        </div>
      )}

      {/* Status Cards */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {BILL_STATUSES.map((s) => {
          const count = tenantBills.filter((b) => b.status === s.value).length;
          const Icon = statusIcons[s.value];
          return (
            <div key={s.value} className="glass-card flex items-center gap-3">
              <Icon className={`w-8 h-8 text-${s.color}-500`} />
              <div>
                <p className="text-sm text-gray-500">{s.label}</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{count}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Previous Bills */}
      <div className="glass-card">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Previous Bills</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-2 font-medium text-gray-500">Month</th>
                <th className="text-left py-3 px-2 font-medium text-gray-500">Rent</th>
                <th className="text-left py-3 px-2 font-medium text-gray-500">Society Charges</th>
                <th className="text-left py-3 px-2 font-medium text-gray-500">Total</th>
                <th className="text-left py-3 px-2 font-medium text-gray-500">Status</th>
                <th className="text-left py-3 px-2 font-medium text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody>
              {previousBills.map((bill) => (
                <tr key={bill.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="py-3 px-2 text-gray-900 dark:text-white">{formatMonth(bill.month)}</td>
                  <td className="py-3 px-2">{formatCurrency(bill.houseRent)}</td>
                  <td className="py-3 px-2">{formatCurrency(bill.electricity + bill.water + bill.maintenance + (bill.generator || 0))}</td>
                  <td className="py-3 px-2 font-medium">{formatCurrency(bill.total)}</td>
                  <td className="py-3 px-2">
                    <Badge color={getStatusColor(bill.status)}>
                      {BILL_STATUSES.find((s) => s.value === bill.status)?.label}
                    </Badge>
                  </td>
                  <td className="py-3 px-2">
                    <button className="text-primary-600 hover:underline text-xs flex items-center gap-1">
                      <IoDownloadOutline /> Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
