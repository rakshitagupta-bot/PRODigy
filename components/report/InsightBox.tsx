interface InsightBoxProps {
  type: "strength" | "gap" | "neutral";
  dimension: string;
  insight: string;
}

const icons = { strength: "✅", gap: "⚠️", neutral: "💡" };
const colors = {
  strength: "border-[#22c55e]/30 bg-[#22c55e]/5",
  gap: "border-[#ef4444]/30 bg-[#ef4444]/5",
  neutral: "border-white/10 bg-white/[0.02]",
};

export default function InsightBox({ type, dimension, insight }: InsightBoxProps) {
  return (
    <div className={`rounded-xl p-4 border ${colors[type]} space-y-1`}>
      <div className="flex items-center gap-2">
        <span className="text-sm">{icons[type]}</span>
        <span className="text-xs font-semibold text-white/50 font-outfit uppercase tracking-wider">
          {dimension}
        </span>
      </div>
      <p className="text-sm text-white/75 font-outfit leading-relaxed">{insight}</p>
    </div>
  );
}
