export default function StatsCard({
  title,
  value,
  icon,
  color = "#7C5CFF",
}) {
  return (
    <div
      className="bg-[#141414] border border-[#2A2A2A] rounded-3xl p-6
      hover:border-[#7C5CFF] transition-all duration-300
      hover:shadow-[0_0_20px_rgba(124,92,255,0.15)]"
    >
      <div className="flex justify-between items-center">

        <div>

          <p className="text-sm text-[#8E8E93]">
            {title}
          </p>

          <h2 className="text-3xl font-bold text-white mt-3">
            {value}
          </h2>

        </div>

        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: `${color}20` }}
        >
          <div
            className="text-3xl"
            style={{ color }}
          >
            {icon}
          </div>
        </div>

      </div>
    </div>
  );
}