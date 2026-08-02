import React from "react";

const DashboardCard = ({
  title,
  value,
  icon,
  color = "#7C3AED",
}) => {
  return (
    <div
      className="group relative overflow-hidden rounded-3xl border border-zinc-800 bg-[#121212] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-violet-500"
    >
      {/* Glow */}
      <div
        className="absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-20 blur-3xl"
        style={{ background: color }}
      />

      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-[3px] text-zinc-500">
            {title}
          </p>

          <h2 className="mt-3 text-3xl font-bold text-white">
            {value}
          </h2>
        </div>

        {icon && (
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl"
            style={{
              background: `${color}20`,
              color,
            }}
          >
            {icon}
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <span className="text-sm text-zinc-500">
          Updated just now
        </span>

        <div
          className="h-2 w-2 rounded-full"
          style={{ background: color }}
        />
      </div>
    </div>
  );
};

export default DashboardCard;