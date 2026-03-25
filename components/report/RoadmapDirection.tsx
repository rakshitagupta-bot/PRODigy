import type { RoadmapWeek } from "@/types";

interface RoadmapDirectionProps {
  week: RoadmapWeek;
}

const resourceIcons = { video: "▶️", text: "📄", exercise: "✏️" };

export default function RoadmapDirection({ week }: RoadmapDirectionProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#6B5BFF]/20 border border-[#6B5BFF]/30 flex items-center justify-center text-xs font-bold text-[#8B8FFF] font-outfit">
          W{week.week}
        </div>
        <h4 className="font-semibold text-white font-outfit">{week.theme}</h4>
      </div>

      <ul className="space-y-1.5 pl-11">
        {week.objectives.map((obj, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-white/65 font-outfit">
            <span className="text-[#6B5BFF] mt-0.5 flex-shrink-0">→</span>
            {obj}
          </li>
        ))}
      </ul>

      <div className="pl-11 flex flex-wrap gap-2">
        {week.resources.map((r, i) => (
          <a
            key={i}
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white/80 transition-colors"
          >
            <span>{resourceIcons[r.type]}</span>
            <span className="underline underline-offset-2">{r.title}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
