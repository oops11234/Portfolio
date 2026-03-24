import { useState } from "react";

export type SkillItem = {
  name: string;
  level: number;
};

function getLevelColor(level: number) {
  if (level >= 85) return { border: "border-cyan-400/70", text: "text-cyan-300", bar: "bg-cyan-400", glow: "shadow-[0_0_8px_#22d3ee80]", hoverGlow: "hover:shadow-[0_0_16px_#22d3ee]" };
  if (level >= 70) return { border: "border-purple-400/70", text: "text-purple-300", bar: "bg-purple-400", glow: "shadow-[0_0_8px_#c084fc80]", hoverGlow: "hover:shadow-[0_0_16px_#c084fc]" };
  return { border: "border-orange-400/70", text: "text-orange-300", bar: "bg-orange-400", glow: "shadow-[0_0_8px_#fb923c80]", hoverGlow: "hover:shadow-[0_0_16px_#fb923c]" };
}

export default function SkillTag({ item }: { item: SkillItem }) {
  const [hovered, setHovered] = useState(false);
  const color = getLevelColor(item.level);

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setHovered((v) => !v)}
    >
      <span
        className={`
          px-3 py-1 border rounded-full text-sm whitespace-nowrap cursor-default
          transition-all duration-200 select-none
          ${color.border} ${color.text} ${color.glow} ${color.hoverGlow}
        `}
      >
        {item.name}
      </span>

      <div
        className={`
          overflow-hidden transition-all duration-300 ease-out
          ${hovered ? "w-24 ml-2 opacity-100" : "w-0 ml-0 opacity-0"}
        `}
      >
        <div className="flex items-center gap-1">
          <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${color.bar}`}
              style={{ width: hovered ? `${item.level}%` : "0%" }}
            />
          </div>
          <span className={`text-xs tabular-nums ${color.text}`}>{item.level}</span>
        </div>
      </div>
    </div>
  );
}
