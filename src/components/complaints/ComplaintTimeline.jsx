import Badge from "../ui/Badge";
import { formatDateTime } from "../../utils/formatters";
import { COMPLAINT_STATUSES } from "../../utils/constants";

export default function ComplaintTimeline({ complaints }) {
  const getStatusColor = (status) =>
    COMPLAINT_STATUSES.find((s) => s.value === status)?.color || "gray";

  if (complaints.length === 0) {
    return <p className="text-center text-gray-500 py-8">No complaints raised yet</p>;
  }

  return (
    <div className="space-y-4">
      {complaints.map((c, i) => (
        <div key={c.id} className="relative pl-8 animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
          <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-primary-500 border-4 border-white dark:border-gray-900" />
          {i < complaints.length - 1 && (
            <div className="absolute left-[7px] top-5 w-0.5 h-full bg-gray-200 dark:bg-gray-700" />
          )}
          <div className="glass-card !p-4">
            <div className="flex items-start justify-between gap-2 flex-wrap mb-1">
              {c.category && <Badge color="purple">{c.category}</Badge>}
              <Badge color={getStatusColor(c.status)}>
                {COMPLAINT_STATUSES.find((s) => s.value === c.status)?.label}
              </Badge>
            </div>
            <p className="text-sm text-gray-900 dark:text-white font-medium">{c.description}</p>
            <p className="text-xs text-gray-400 mt-2">{formatDateTime(c.createdAt)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
