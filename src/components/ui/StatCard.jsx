export default function StatCard({ title, value, icon: Icon, color = "primary", trend }) {
  const colors = {
    primary: "from-primary-500 to-primary-600 shadow-primary-500/15",
    green: "from-green-500 to-green-600 shadow-green-500/15",
    red: "from-red-500 to-red-600 shadow-red-500/15",
    yellow: "from-yellow-500 to-yellow-600 shadow-yellow-500/15",
    purple: "from-purple-500 to-purple-600 shadow-purple-500/15",
    indigo: "from-indigo-500 to-indigo-600 shadow-indigo-500/15",
    blue: "from-blue-500 to-blue-600 shadow-blue-500/15",
  };

  return (
    <div className="glass-card group hover:-translate-y-1 w-full h-full p-4.5 shadow-md dark:shadow-black/20 hover:shadow-lg rounded-2xl border border-gray-100/10 transition-all duration-300 flex flex-col justify-between min-h-[125px]">
      <div className="flex items-center justify-between mb-3 w-full">
        {Icon && (
          <div className={`flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-xl bg-gradient-to-br ${colors[color] || colors.primary} text-white shadow-md`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
        {trend && <span className="text-xs text-gray-400">{trend}</span>}
      </div>
      <div className="min-w-0 w-full mt-auto">
        <p className="text-xs sm:text-[13px] text-gray-500 dark:text-gray-400 font-medium tracking-normal truncate w-full" title={title}>{title}</p>
        <p className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white mt-1 leading-none">{value}</p>
      </div>
    </div>
  );
}
