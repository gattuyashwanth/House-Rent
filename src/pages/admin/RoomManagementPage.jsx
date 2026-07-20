import { useState } from "react";
import { IoAdd, IoPencil, IoTrash } from "react-icons/io5";
import { useApp } from "../../context/AppContext";
import { apiFetch } from "../../utils/api";
import { mapRoom } from "../../utils/mappers";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Badge from "../../components/ui/Badge";

export default function RoomManagementPage() {
  const { rooms, setRooms, floors, apartments } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ floorId: "", apartmentId: "", roomNumber: "", status: "vacant" });

  const getFloorName = (id) => floors.find((f) => f.id === id)?.name || "—";
  const getAptName = (id) => apartments.find((a) => a.id === id)?.name || "—";

  const openAdd = () => {
    setEditing(null);
    const firstFloor = floors[0];
    setForm({ floorId: firstFloor?.id || "", apartmentId: firstFloor?.apartmentId || "", roomNumber: "", status: "vacant" });
    setModalOpen(true);
  };

  const openEdit = (room) => {
    setEditing(room);
    setForm({ floorId: room.floorId, apartmentId: room.apartmentId, roomNumber: room.roomNumber, status: room.status });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const floor = floors.find((f) => f.id === form.floorId);
    const payload = {
      apartmentId: floor?.apartmentId || form.apartmentId,
      floorNumber: floor ? Number(floor.floorNumber) : 1,
      roomNumber: form.roomNumber,
      status: form.status === "vacant" ? "Vacant" : "Occupied",
    };

    try {
      if (editing) {
        const res = await apiFetch(`/rooms/${editing.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        if (res.success && res.data) {
          const updated = mapRoom(res.data, floors);
          setRooms((prev) =>
            prev.map((r) => (r.id === editing.id ? updated : r))
          );
        }
      } else {
        const res = await apiFetch("/rooms", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        if (res.success && res.data) {
          const created = mapRoom(res.data, floors);
          setRooms((prev) => [...prev, created]);
        }
      }
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to save room");
    }
  };

  const toggleStatus = async (room) => {
    const newStatus = room.status === "vacant" ? "Occupied" : "Vacant";
    try {
      const res = await apiFetch(`/rooms/${room.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.success && res.data) {
        const updated = mapRoom(res.data, floors);
        setRooms((prev) =>
          prev.map((r) => (r.id === room.id ? updated : r))
        );
      }
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to toggle room status");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this room?")) {
      try {
        const res = await apiFetch(`/rooms/${id}`, {
          method: "DELETE",
        });
        if (res.success) {
          setRooms((prev) => prev.filter((r) => r.id !== id));
        } else {
          alert("Failed to delete room");
        }
      } catch (err) {
        console.error(err);
        alert(err.message || "Error deleting room");
      }
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Flat Management"
        subtitle="Manage flats and occupancy status"
        action={<Button onClick={openAdd}><IoAdd /> Add Room</Button>}
      />

      <div className="glass-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-2 font-medium text-gray-500">Flat No.</th>
              <th className="text-left py-3 px-2 font-medium text-gray-500">Floor</th>
              <th className="text-left py-3 px-2 font-medium text-gray-500 hidden sm:table-cell">Apartment</th>
              <th className="text-left py-3 px-2 font-medium text-gray-500">Status</th>
              <th className="text-right py-3 px-2 font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="py-3 px-2 font-medium text-gray-900 dark:text-white">{room.roomNumber}</td>
                <td className="py-3 px-2">{getFloorName(room.floorId)}</td>
                <td className="py-3 px-2 hidden sm:table-cell">{getAptName(room.apartmentId)}</td>
                <td className="py-3 px-2">
                  <button onClick={() => toggleStatus(room)}>
                    <Badge color={room.status === "vacant" ? "green" : "red"}>
                      {room.status === "vacant" ? "Vacant" : "Occupied"}
                    </Badge>
                  </button>
                </td>
                <td className="py-3 px-2 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openEdit(room)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-primary-600">
                      <IoPencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(room.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600">
                      <IoTrash className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Room" : "Add Room"}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Floor</label>
            <select
              value={form.floorId}
              onChange={(e) => {
                const fl = floors.find((f) => f.id === e.target.value);
                setForm({ ...form, floorId: e.target.value, apartmentId: fl?.apartmentId });
              }}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm"
              required
            >
              {floors.map((f) => <option key={f.id} value={f.id}>{getAptName(f.apartmentId)} — {f.name}</option>)}
            </select>
          </div>
          <Input label="Flat Number" value={form.roomNumber} onChange={(e) => setForm({ ...form, roomNumber: e.target.value })} placeholder="e.g. 101, 202" required />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm"
            >
              <option value="vacant">Vacant</option>
              <option value="occupied">Occupied</option>
            </select>
          </div>
          <Button type="submit" className="w-full">{editing ? "Update" : "Add"} Room</Button>
        </form>
      </Modal>
    </div>
  );
}
