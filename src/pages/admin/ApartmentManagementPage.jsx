import { useState } from "react";
import { IoAdd, IoPencil, IoTrash } from "react-icons/io5";
import { useApp } from "../../context/AppContext";
import { apiFetch } from "../../utils/api";
import { mapApartment } from "../../utils/mappers";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";

export default function ApartmentManagementPage() {
  const { apartments, setApartments, refreshAdminData } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", address: "", city: "Hyderabad", totalFloors: "", description: "", image: "" });

  const openAdd = () => {
    setEditing(null);
    setForm({ name: "", address: "", city: "Hyderabad", totalFloors: "", description: "", image: "" });
    setModalOpen(true);
  };

  const openEdit = (apt) => {
    setEditing(apt);
    setForm({
      name: apt.name,
      address: apt.address,
      city: apt.city || "Hyderabad",
      totalFloors: apt.totalFloors,
      description: apt.description || "",
      image: apt.image || "",
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = {
      apartmentName: form.name,
      address: form.address,
      city: form.city,
      totalFloors: Number(form.totalFloors),
      image: form.image || "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=600&h=400&fit=crop",
    };

    try {
      if (editing) {
        const res = await apiFetch(`/apartments/${editing.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        if (res.success && res.data) {
          const updated = mapApartment(res.data);
          setApartments((prev) =>
            prev.map((a) => (a.id === editing.id ? updated : a))
          );
        }
      } else {
        const res = await apiFetch("/apartments", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        if (res.success && res.data) {
          const created = mapApartment(res.data);
          setApartments((prev) => [...prev, created]);
        }
      }
      setModalOpen(false);
      if (refreshAdminData) refreshAdminData();
    } catch (error) {
      console.error(error);
      alert(error.message || "Failed to save apartment");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this apartment?")) {
      try {
        const response = await apiFetch(`/apartments/${id}`, {
          method: "DELETE",
        });

        if (response.success) {
          setApartments((prev) => prev.filter((a) => a.id !== id));
          if (refreshAdminData) refreshAdminData();
        } else {
          alert("Failed to delete apartment");
        }
      } catch (error) {
        console.error(error);
        alert(error.message || "Error deleting apartment");
      }
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Apartment Management"
        subtitle="Add, edit, or remove apartments"
        action={<Button onClick={openAdd}><IoAdd /> Add Apartment</Button>}
      />

      <div className="glass-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-2 font-medium text-gray-500">Name</th>
              <th className="text-left py-3 px-2 font-medium text-gray-500 hidden sm:table-cell">Address</th>
              <th className="text-left py-3 px-2 font-medium text-gray-500">Floors</th>
              <th className="text-left py-3 px-2 font-medium text-gray-500">Available</th>
              <th className="text-right py-3 px-2 font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {apartments.map((apt) => (
              <tr key={apt.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="py-3 px-2 font-medium text-gray-900 dark:text-white">{apt.name}</td>
                <td className="py-3 px-2 hidden sm:table-cell text-gray-500">{apt.address}</td>
                <td className="py-3 px-2">{apt.totalFloors}</td>
                <td className="py-3 px-2">{apt.availableRooms}</td>
                <td className="py-3 px-2 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openEdit(apt)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-primary-600">
                      <IoPencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(apt.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600">
                      <IoTrash className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Apartment" : "Add Apartment"}>
        <form onSubmit={handleSave} className="space-y-4">
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input label="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
          <Input label="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
          <Input label="Total Floors" type="number" value={form.totalFloors} onChange={(e) => setForm({ ...form, totalFloors: e.target.value })} required />
          <Input label="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Description"
            rows={3}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm p-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <Button type="submit" className="w-full">{editing ? "Update" : "Add"} Apartment</Button>
        </form>
      </Modal>
    </div>
  );
}
