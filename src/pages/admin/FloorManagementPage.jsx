import { useState } from "react";
import { IoAdd, IoPencil, IoTrash } from "react-icons/io5";
import { useApp } from "../../context/AppContext";
import { apiFetch } from "../../utils/api";
import { mapFloor } from "../../utils/mappers";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";

export default function FloorManagementPage() {
  const { floors, setFloors, apartments } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ apartmentId: "", floorNumber: "", name: "" });

  const getAptName = (id) => apartments.find((a) => a.id === id)?.name || "—";

  const openAdd = () => {
    setEditing(null);
    setForm({ apartmentId: apartments[0]?.id || "", floorNumber: "", name: "" });
    setModalOpen(true);
  };

  const openEdit = (floor) => {
    setEditing(floor);
    setForm({ apartmentId: floor.apartmentId, floorNumber: floor.floorNumber, name: floor.name });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = {
      apartmentId: form.apartmentId,
      floorNumber: Number(form.floorNumber),
    };

    try {
      if (editing) {
        const res = await apiFetch(`/floors/${editing.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        if (res.success && res.data) {
          const updated = mapFloor(res.data);
          setFloors((prev) =>
            prev.map((f) => (f.id === editing.id ? updated : f))
          );
        }
      } else {
        const res = await apiFetch("/floors", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        if (res.success && res.data) {
          const created = mapFloor(res.data);
          setFloors((prev) => [...prev, created]);
        }
      }
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to save floor");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this floor?")) {
      try {
        const res = await apiFetch(`/floors/${id}`, {
          method: "DELETE",
        });
        if (res.success) {
          setFloors((prev) => prev.filter((f) => f.id !== id));
        } else {
          alert("Failed to delete floor");
        }
      } catch (err) {
        console.error(err);
        alert(err.message || "Error deleting floor");
      }
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Floor Management"
        subtitle="Manage floors across apartments"
        action={<Button onClick={openAdd}><IoAdd /> Add Floor</Button>}
      />

      <div className="glass-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-2 font-medium text-gray-500">Floor</th>
              <th className="text-left py-3 px-2 font-medium text-gray-500">Number</th>
              <th className="text-left py-3 px-2 font-medium text-gray-500">Apartment</th>
              <th className="text-right py-3 px-2 font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {floors.map((floor) => (
              <tr key={floor.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="py-3 px-2 font-medium text-gray-900 dark:text-white">{floor.name}</td>
                <td className="py-3 px-2">{floor.floorNumber}</td>
                <td className="py-3 px-2">{getAptName(floor.apartmentId)}</td>
                <td className="py-3 px-2 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openEdit(floor)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-primary-600">
                      <IoPencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(floor.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600">
                      <IoTrash className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Floor" : "Add Floor"}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Apartment</label>
            <select
              value={form.apartmentId}
              onChange={(e) => setForm({ ...form, apartmentId: e.target.value })}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm"
              required
            >
              {apartments.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
          <Input label="Floor Number" type="number" value={form.floorNumber} onChange={(e) => setForm({ ...form, floorNumber: e.target.value })} required />
          <Input label="Floor Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Floor 1" />
          <Button type="submit" className="w-full">{editing ? "Update" : "Add"} Floor</Button>
        </form>
      </Modal>
    </div>
  );
}
