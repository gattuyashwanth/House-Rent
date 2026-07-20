import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { apiFetch } from "../../utils/api";
import { mapComplaint } from "../../utils/mappers";
import PageHeader from "../../components/ui/PageHeader";
import Badge from "../../components/ui/Badge";
import { formatDateTime } from "../../utils/formatters";
import { COMPLAINT_STATUSES } from "../../utils/constants";

export default function ComplaintManagementPage() {
  const { complaints, setComplaints, apartments } = useApp();
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterApt, setFilterApt] = useState("all");

  const filtered = complaints.filter((c) => {
    const statusMatch = filterStatus === "all" || c.status === filterStatus;
    const aptMatch = filterApt === "all" || c.apartmentId === filterApt;
    return statusMatch && aptMatch;
  });

  const getStatusColor = (status) =>
    COMPLAINT_STATUSES.find((s) => s.value === status)?.color || "gray";

  const updateStatus = async (id, status) => {
    // Map status to backend expected casing: "Pending", "In Progress", "Completed"
    let capitalizedStatus = "Pending";
    if (status === "in progress") {
      capitalizedStatus = "In Progress";
    } else if (status === "completed") {
      capitalizedStatus = "Completed";
    }

    try {
      const res = await apiFetch(`/complaints/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: capitalizedStatus }),
      });
      if (res.success && res.data) {
        const updated = mapComplaint(res.data);
        setComplaints((prev) =>
          prev.map((c) => (c.id === id ? updated : c))
        );
      }
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to update complaint status");
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader title="Complaint Management" subtitle="Review society complaints and update resolution status" />

      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm"
        >
          <option value="all">All Statuses</option>
          {COMPLAINT_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <select
          value={filterApt}
          onChange={(e) => setFilterApt(e.target.value)}
          className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm"
        >
          <option value="all">All Apartments</option>
          {apartments.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
      </div>

      <div className="glass-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-2 font-medium text-gray-500">Tenant</th>
              <th className="text-left py-3 px-2 font-medium text-gray-500">Flat</th>
              <th className="text-left py-3 px-2 font-medium text-gray-500 hidden sm:table-cell">Category</th>
              <th className="text-left py-3 px-2 font-medium text-gray-500 hidden md:table-cell">Description</th>
              <th className="text-left py-3 px-2 font-medium text-gray-500">Status</th>
              <th className="text-left py-3 px-2 font-medium text-gray-500 hidden sm:table-cell">Date</th>
              <th className="text-left py-3 px-2 font-medium text-gray-500">Update</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="py-3 px-2 font-medium text-gray-900 dark:text-white">{c.tenantName}</td>
                <td className="py-3 px-2">{c.roomNumber}</td>
                <td className="py-3 px-2 hidden sm:table-cell">
                  <Badge color="purple">{c.category || "—"}</Badge>
                </td>
                <td className="py-3 px-2 hidden md:table-cell max-w-xs truncate">{c.description}</td>
                <td className="py-3 px-2">
                  <Badge color={getStatusColor(c.status)}>
                    {COMPLAINT_STATUSES.find((s) => s.value === c.status)?.label}
                  </Badge>
                </td>
                <td className="py-3 px-2 hidden sm:table-cell text-gray-400">{formatDateTime(c.createdAt)}</td>
                <td className="py-3 px-2">
                  <select
                    value={c.status}
                    onChange={(e) => updateStatus(c.id, e.target.value)}
                    className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-1 text-xs"
                  >
                    {COMPLAINT_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
