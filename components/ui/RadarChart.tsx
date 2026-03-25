"use client";

import {
  RadarChart as ReRadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";

// Short axis labels for the pentagon
const AXIS_ORDER = [
  { key: "strategic-thinking", label: "Strategy" },
  { key: "execution-depth",    label: "Execution" },
  { key: "technical-fluency",  label: "Tech Fluency" },
  { key: "product-sense",      label: "Product Sense" },
  { key: "communication",      label: "Comms" },
] as const;

// Benchmark values (0–100 scale, matching BENCHMARKS × 10 from scoring.ts)
const BENCHMARK_VALUES: Record<string, number> = {
  "strategic-thinking": 70,
  "product-sense":      70,
  "execution-depth":    60,
  "technical-fluency":  50,
  communication:        60,
};

interface RadarChartProps {
  scores: Partial<Record<string, number>>; // 0–100 per dimension key
  showBenchmark?: boolean;
  size?: number;
}

export default function RadarChart({
  scores,
  showBenchmark = true,
  size = 300,
}: RadarChartProps) {
  const data = AXIS_ORDER.map(({ key, label }) => ({
    dimension: label,
    score: scores[key] ?? 0,
    benchmark: BENCHMARK_VALUES[key],
    fullMark: 100,
  }));

  return (
    <ResponsiveContainer width="100%" height={size}>
      <ReRadarChart data={data} margin={{ top: 10, right: 24, bottom: 10, left: 24 }}>
        {/* Gradient defs */}
        <defs>
          <radialGradient id="radarFill" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#8B5CF6" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#4A6CF7" stopOpacity={0.08} />
          </radialGradient>
        </defs>

        <PolarGrid
          stroke="rgba(255,255,255,0.07)"
          gridType="polygon"
        />
        <PolarAngleAxis
          dataKey="dimension"
          tick={{
            fill: "rgba(255,255,255,0.5)",
            fontSize: 11,
            fontFamily: "var(--font-outfit)",
            fontWeight: 500,
          }}
          tickLine={false}
        />

        {/* Benchmark polygon */}
        {showBenchmark && (
          <Radar
            name="Benchmark"
            dataKey="benchmark"
            fill="none"
            stroke="rgba(255,255,255,0.18)"
            strokeWidth={1.5}
            strokeDasharray="5 4"
            dot={false}
          />
        )}

        {/* User polygon */}
        <Radar
          name="You"
          dataKey="score"
          fill="url(#radarFill)"
          stroke="#8B8FFF"
          strokeWidth={2.5}
          dot={{ fill: "#8B8FFF", r: 3, strokeWidth: 0 }}
        />
      </ReRadarChart>
    </ResponsiveContainer>
  );
}
