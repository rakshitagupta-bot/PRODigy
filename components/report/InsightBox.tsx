import { CheckCircle2, AlertTriangle, Lightbulb } from "lucide-react";

interface InsightBoxProps {
  type: "strength" | "gap" | "neutral";
  dimension: string;
  insight: string;
}

const iconMap = {
  strength: <CheckCircle2 size={14} className="text-[#4ade80] flex-shrink-0" />,
  gap: <AlertTriangle size={14} className="text-[#f87171] flex-shrink-0" />,
  neutral: <Lightbulb size={14} className="text-white/40 flex-shrink-0" />,
};

const colors = {
  strength: "border-[#22c55e]/30 bg-[#22c55e]/5",
  gap: "border-[#ef4444]/30 bg-[#ef4444]/5",
  neutral: "border-white/10 bg-white/[0.02]",
};

export default function InsightBox({ type, dimension, insight }: InsightBoxProps) {
  return (
    <div className={`rounded-xl p-4 border ${colors[type]} space-y-1`}>
      <div className="flex items-center gap-2">
        {iconMap[type]}
        <span className="text-xs font-semibold text-white/50 font-outfit uppercase tracking-wider">
          {dimension}
        </span>
      </div>
      <p className="text-sm text-white/75 font-outfit leading-relaxed">{insight}</p>
    </div>
  );
}
