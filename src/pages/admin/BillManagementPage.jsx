import { useState } from "react";
import { IoAdd, IoPencil, IoTrash } from "react-icons/io5";
import { useApp } from "../../context/AppContext";
import { apiFetch } from "../../utils/api";
import { mapBill } from "../../utils/mappers";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Badge from "../../components/ui/Badge";
import { formatCurrency, formatMonth } from "../../utils/formatters";
import { BILL_STATUSES } from "../../utils/constants";

export default function BillManagementPage() {
  const { bills, setBills, apartments, tenants } = useApp();
  const [filterApt, setFilterApt] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    tenantId: "", month: "2026-06", houseRent: "", electricity: "", water: "", maintenance: "", generator: "", status: "pending",
  });

  const filtered = bills.filter((b) => filterApt === "all" || b.apartmentId === filterApt);

  const getStatusColor = (status) =>
    BILL_STATUSES.find((s) => s.value === status)?.color || "gray";

  const openAdd = () => {
    setEditing(null);
    setForm({ tenantId: tenants[0]?.id || "", month: "2026-06", houseRent: "", electricity: "", water: "", maintenance: "", generator: "", status: "pending" });
    setModalOpen(true);
  };

  const openEdit = (bill) => {
    setEditing(bill);
    setForm({
      tenantId: bill.tenantId,
      month: bill.month,
      houseRent: bill.houseRent,
      electricity: bill.electricity,
      water: bill.water,
      maintenance: bill.maintenance,
      generator: bill.generator || "",
      status: bill.status,
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const tenant = tenants.find((t) => t.id === form.tenantId);
    if (!tenant) {
      alert("Please select a valid tenant");
      return;
    }

    const [yearStr, monthStr] = form.month.split("-");
    const year = Number(yearStr);
    const month = Number(monthStr);

    const payload = {
      tenantId: form.tenantId,
      apartmentId: tenant.apartmentId,
      roomNumber: tenant.roomNumber,
      month,
      year,
      rentAmount: Number(form.houseRent),
      electricityBill: Number(form.electricity),
      waterBill: Number(form.water),
      maintenanceBill: Number(form.maintenance),
      generatorCharges: Number(form.generator || 0),
      paymentStatus: form.status.charAt(0).toUpperCase() + form.status.slice(1), // Pending, Paid, Overdue
    };

    try {
      if (editing) {
        const res = await apiFetch(`/bills/${editing.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        if (res.success && res.data) {
          const updated = mapBill(res.data);
          setBills((prev) =>
            prev.map((b) => (b.id === editing.id ? updated : b))
          );
        }
      } else {
        const res = await apiFetch("/bills", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        if (res.success && res.data) {
          const created = mapBill(res.data);
          setBills((prev) => [...prev, created]);
        }
      }
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to save bill");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this bill?")) {
      try {
        const res = await apiFetch(`/bills/${id}`, {
          method: "DELETE",
        });
        if (res.success) {
          setBills((prev) => prev.filter((b) => b.id !== id));
        } else {
          alert("Failed to delete bill");
        }
      } catch (err) {
        console.error(err);
        alert(err.message || "Error deleting bill");
      }
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Bill Management"
        subtitle="Create and manage monthly bills in ₹ (INR)"
        action={<Button onClick={openAdd}><IoAdd /> Create Bill</Button>}
      />

      <div className="mb-6">
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
              <th className="text-left py-3 px-2 font-medium text-gray-500">Month</th>
              <th className="text-left py-3 px-2 font-medium text-gray-500 hidden sm:table-cell">Apartment</th>
              <th className="text-left py-3 px-2 font-medium text-gray-500">Total</th>
              <th className="text-left py-3 px-2 font-medium text-gray-500">Status</th>
              <th className="text-right py-3 px-2 font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((bill) => (
              <tr key={bill.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="py-3 px-2 font-medium text-gray-900 dark:text-white">{bill.tenantName}</td>
                <td className="py-3 px-2">{formatMonth(bill.month)}</td>
                <td className="py-3 px-2 hidden sm:table-cell">{bill.apartmentName}</td>
                <td className="py-3 px-2">{formatCurrency(bill.total)}</td>
                <td className="py-3 px-2">
                  <Badge color={getStatusColor(bill.status)}>
                    {BILL_STATUSES.find((s) => s.value === bill.status)?.label}
                  </Badge>
                </td>
                <td className="py-3 px-2 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openEdit(bill)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-primary-600">
                      <IoPencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(bill.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600">
                      <IoTrash className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Bill" : "Create Bill"} size="lg">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Tenant</label>
            <select value={form.tenantId} onChange={(e) => setForm({ ...form, tenantId: e.target.value })} className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm" required>
              {tenants.map((t) => <option key={t.id} value={t.id}>{t.name} — Flat {t.roomNumber}</option>)}
            </select>
          </div>
          <Input label="Month (YYYY-MM)" value={form.month} onChange={(e) => setForm({ ...form, month: e.target.value })} required />
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="House Rent (₹)" type="number" value={form.houseRent} onChange={(e) => setForm({ ...form, houseRent: e.target.value })} required />
            <Input label="Electricity Bill (₹)" type="number" value={form.electricity} onChange={(e) => setForm({ ...form, electricity: e.target.value })} required />
            <Input label="Water Bill (₹)" type="number" value={form.water} onChange={(e) => setForm({ ...form, water: e.target.value })} required />
            <Input label="Maintenance Charges (₹)" type="number" value={form.maintenance} onChange={(e) => setForm({ ...form, maintenance: e.target.value })} required />
            <Input label="Generator Charges (₹)" type="number" value={form.generator} onChange={(e) => setForm({ ...form, generator: e.target.value })} placeholder="Optional" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm">
              {BILL_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          <Button type="submit" className="w-full">{editing ? "Update" : "Create"} Bill</Button>
        </form>
      </Modal>
    </div>
  );
}
