"use client";

interface OptionTileProps {
  id: string;
  text: string;
  selected: boolean;
  onSelect: (id: string) => void;
  letter?: string;
}

export default function OptionTile({
  id,
  text,
  selected,
  onSelect,
  letter,
}: OptionTileProps) {
  return (
    <button
      onClick={() => onSelect(id)}
      className={[
        "w-full text-left rounded-xl p-4 border transition-all duration-200",
        "font-outfit text-sm leading-relaxed",
        selected
          ? "border-[#6B5BFF]/60 bg-[#6B5BFF]/10 text-white shadow-[0_0_12px_rgba(107,91,255,0.2)]"
          : "border-white/[0.06] bg-white/[0.02] text-white/70 hover:border-white/20 hover:bg-white/[0.04] hover:text-white",
      ].join(" ")}
    >
      <div className="flex items-start gap-3">
        {letter && (
          <span
            className={`flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold mt-0.5 ${
              selected
                ? "bg-[#6B5BFF] text-white"
                : "bg-white/10 text-white/50"
            }`}
          >
            {letter}
          </span>
        )}
        <span>{text}</span>
      </div>
    </button>
  );
}
