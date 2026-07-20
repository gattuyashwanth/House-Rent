import { useState } from "react";
import { IoImageOutline, IoSend } from "react-icons/io5";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import { apiFetch } from "../utils/api";
import { mapComplaint } from "../utils/mappers";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import ComplaintTimeline from "../components/complaints/ComplaintTimeline";
import { COMPLAINT_CATEGORIES } from "../utils/constants";

export default function ComplaintPage() {
  const { tenant } = useAuth();
  const { complaints, setComplaints, refreshTenantData } = useApp();
  const [category, setCategory] = useState(COMPLAINT_CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [imageName, setImageName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const tenantComplaints = complaints
    .filter((c) => c.tenantId === tenant?.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageName(file.name);
      setImageFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) return;
    setSubmitting(true);

    const formData = new FormData();
    formData.append("complaintType", category);
    formData.append("description", description.trim());
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const res = await apiFetch("/tenant/complaints", {
        method: "POST",
        body: formData,
      });

      if (res.success && res.data) {
        const created = mapComplaint(res.data);
        setComplaints((prev) => [created, ...prev]);
        setDescription("");
        setImageName("");
        setImageFile(null);
        setCategory(COMPLAINT_CATEGORIES[0]);
        setSuccess(true);

        // Refresh tenant portal data (including notifications)
        await refreshTenantData();

        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to submit complaint");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in max-w-3xl">
      <PageHeader title="Complaints" subtitle="Raise society complaints — water, power, lift & more" />

      <form onSubmit={handleSubmit} className="glass-card mb-8 space-y-4">
        <h2 className="font-semibold text-gray-900 dark:text-white">New Complaint</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Complaint Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          >
            {COMPLAINT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your issue in detail (e.g. water leakage in bathroom, lift not working)..."
          rows={4}
          required
          className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm p-4 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
        />
        <div className="flex flex-col sm:flex-row gap-3">
          <label className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 cursor-pointer hover:border-primary-500 transition-colors text-sm text-gray-500">
            <IoImageOutline className="w-5 h-5" />
            {imageName || "Upload Photo"}
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>
          <Button type="submit" loading={submitting} className="sm:w-auto">
            <IoSend className="w-4 h-4" /> Submit Complaint
          </Button>
        </div>
        {success && (
          <p className="text-sm text-green-600 bg-green-50 dark:bg-green-900/20 p-3 rounded-xl">
            Complaint submitted successfully! Society admin will review shortly.
          </p>
        )}
      </form>

      <div className="glass-card">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-6">Complaint History</h2>
        <ComplaintTimeline complaints={tenantComplaints} />
      </div>
    </div>
  );
}
