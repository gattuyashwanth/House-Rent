import { useState } from "react";
import { IoAdd, IoPencil, IoTrash } from "react-icons/io5";
import { useApp } from "../../context/AppContext";
import { useDebounce } from "../../hooks/useDebounce";
import { apiFetch } from "../../utils/api";
import { mapTenant } from "../../utils/mappers";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import SearchBar from "../../components/ui/SearchBar";

export default function TenantManagementPage() {
  const { tenants, setTenants, apartments, rooms } = useApp();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", roomNumber: "", apartmentId: "", contact: "", email: "", password: "tenant123" });

  const filtered = tenants.filter(
    (t) =>
      t.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      t.roomNumber.includes(debouncedSearch) ||
      t.contact.includes(debouncedSearch)
  );

  const getAptName = (id) => apartments.find((a) => a.id === id)?.name || "—";

  const openAdd = () => {
    setEditing(null);
    setForm({ name: "", roomNumber: "", apartmentId: apartments[0]?.id || "", contact: "", email: "", password: "tenant123" });
    setModalOpen(true);
  };

  const openEdit = (tenant) => {
    setEditing(tenant);
    setForm({
      name: tenant.name,
      roomNumber: tenant.roomNumber,
      apartmentId: tenant.apartmentId,
      contact: tenant.contact,
      email: tenant.email || "",
      password: "", // Leave empty for no change
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const matchingRoom = rooms.find(
      (r) => r.apartmentId === form.apartmentId && r.roomNumber === form.roomNumber
    );
    const floorNumber = matchingRoom ? Number(matchingRoom.floorNumber) : 1;

    const payload = {
      flatNumber: form.roomNumber,
      tenantName: form.name,
      mobileNumber: form.contact,
      apartmentId: form.apartmentId,
      floorNumber: floorNumber,
      email: form.email,
    };

    if (form.password) {
      payload.password = form.password;
    }

    try {
      if (editing) {
        const res = await apiFetch(`/tenants/${editing.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        if (res.success && res.data) {
          const updated = mapTenant(res.data);
          setTenants((prev) =>
            prev.map((t) => (t.id === editing.id ? updated : t))
          );
        }
      } else {
        const res = await apiFetch("/tenants", {
          method: "POST",
          body: JSON.stringify({ ...payload, password: form.password || "tenant123" }),
        });
        if (res.success && res.data) {
          const created = mapTenant(res.data);
          setTenants((prev) => [...prev, created]);
        }
      }
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to save tenant");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this tenant?")) {
      try {
        const res = await apiFetch(`/tenants/${id}`, {
          method: "DELETE",
        });
        if (res.success) {
          setTenants((prev) => prev.filter((t) => t.id !== id));
        } else {
          alert("Failed to delete tenant");
        }
      } catch (err) {
        console.error(err);
        alert(err.message || "Error deleting tenant");
      }
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Resident Management"
        subtitle="Manage resident accounts across all apartment societies"
        action={<Button onClick={openAdd}><IoAdd /> Add Tenant</Button>}
      />

      <SearchBar value={search} onChange={setSearch} placeholder="Search tenants..." className="mb-6 max-w-md" />

      <div className="glass-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-2 font-medium text-gray-500">Name</th>
              <th className="text-left py-3 px-2 font-medium text-gray-500">Flat No.</th>
              <th className="text-left py-3 px-2 font-medium text-gray-500 hidden sm:table-cell">Apartment</th>
              <th className="text-left py-3 px-2 font-medium text-gray-500 hidden md:table-cell">Mobile</th>
              <th className="text-right py-3 px-2 font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="py-3 px-2">
                  <div className="flex items-center gap-2">
                    <img src={t.profilePicture} alt="" className="w-8 h-8 rounded-lg object-cover" />
                    <span className="font-medium text-gray-900 dark:text-white">{t.name}</span>
                  </div>
                </td>
                <td className="py-3 px-2">{t.roomNumber}</td>
                <td className="py-3 px-2 hidden sm:table-cell">{getAptName(t.apartmentId)}</td>
                <td className="py-3 px-2 hidden md:table-cell">{t.contact}</td>
                <td className="py-3 px-2 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openEdit(t)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-primary-600">
                      <IoPencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(t.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600">
                      <IoTrash className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Tenant" : "Add Tenant"} size="lg">
        <form onSubmit={handleSave} className="space-y-4">
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Flat Number" value={form.roomNumber} onChange={(e) => setForm({ ...form, roomNumber: e.target.value })} placeholder="e.g. 101" required />
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Apartment</label>
              <select value={form.apartmentId} onChange={(e) => setForm({ ...form, apartmentId: e.target.value })} className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm" required>
                {apartments.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Mobile Number" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} placeholder="+91 9876543210" required />
            <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <Input label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder={editing ? "Leave blank to keep current password" : "Password (min. 6 chars)"} required={!editing} />
          <Button type="submit" className="w-full">{editing ? "Update" : "Add"} Tenant</Button>
        </form>
      </Modal>
    </div>
  );
}
