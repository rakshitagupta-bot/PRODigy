import type {
  AssessmentQuestion,
  AssessmentSelfRating,
  AssessmentDimension,
  Dimension,
  DimensionScores,
  ArchetypeKey,
} from "@/types";

// ─── Input / Output types ─────────────────────────────────────────────────────

export interface AnswerInput {
  questionId: string;
  selectedOption: number; // 0-based option index
}

export interface WarmupInput {
  background: string;
  experience: string;
  industry: string;
}

export interface GapEntry {
  subcategory: string;
  dimension: AssessmentDimension;
  score: number;       // 0–10
  benchmark: number;   // dimension benchmark
  status: "green" | "amber" | "red";
}

export interface ScoreProfile {
  subcategoryScores: Record<string, number>;        // 0–10
  dimensionScores: Record<AssessmentDimension, number>; // 0–10
  overallReadiness: number;                          // 0–10
  archetype: ArchetypeKey;
  roleType: string;
  gapMap: GapEntry[];
  // Bridge to 0-100 scale for report components
  reportDimensionScores: DimensionScores;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const DIMENSIONS: AssessmentDimension[] = [
  "thinking_strategy",
  "user_research",
  "execution",
  "technical_fluency",
  "communication",
];

// Dimension → report Dimension name bridge
export const DIM_MAP: Record<AssessmentDimension, Dimension> = {
  thinking_strategy: "strategic-thinking",
  user_research: "product-sense",
  execution: "execution-depth",
  technical_fluency: "technical-fluency",
  communication: "communication",
};

// Dimension labels for display
export const DIMENSION_LABELS: Record<AssessmentDimension, string> = {
  thinking_strategy: "Strategic Thinking",
  user_research: "Product Sense",
  execution: "Execution",
  technical_fluency: "Technical Fluency",
  communication: "Communication",
};

// Dimension colours
export const DIMENSION_COLORS: Record<AssessmentDimension, string> = {
  thinking_strategy: "#4A6CF7",
  user_research: "#8B5CF6",
  execution: "#F59E0B",
  technical_fluency: "#10B981",
  communication: "#EC4899",
};

// Benchmarks per dimension (0-10 scale)
export const BENCHMARKS: Record<AssessmentDimension, number> = {
  thinking_strategy: 7.0,
  user_research: 7.0,
  execution: 6.0,
  technical_fluency: 5.0,
  communication: 6.0,
};

// Overall score dimension weights
const OVERALL_WEIGHTS: Record<AssessmentDimension, number> = {
  thinking_strategy: 0.35,
  user_research: 0.20,
  execution: 0.20,
  communication: 0.15,
  technical_fluency: 0.10,
};

// Archetype → primary dimension
const ARCHETYPE_DIM: Record<ArchetypeKey, AssessmentDimension> = {
  strategist: "thinking_strategy",
  advocate: "user_research",
  operator: "execution",
  builder: "technical_fluency",
  explorer: "communication", // fallback, see logic below
};

// ─── Main scoring function ─────────────────────────────────────────────────────

export function calculateScores(
  answers: AnswerInput[],
  questions: AssessmentQuestion[],
  selfRatings: AssessmentSelfRating[],
  warmup?: WarmupInput
): ScoreProfile {
  void warmup; // reserved for future personalisation weighting
  // ── 1. Scenario subcategory raw scores ─────────────────────────────────────
  const subcatRaw: Record<string, number> = {};   // subcategory → selected option score
  const subcatMax: Record<string, number> = {};   // subcategory → 4 (one question each)
  const subcatDim: Record<string, AssessmentDimension> = {};

  for (const q of questions) {
    for (const subcat of q.subcategories) {
      subcatMax[subcat] = 4;
      subcatDim[subcat] = q.dimension;
    }
  }

  for (const { questionId, selectedOption } of answers) {
    const q = questions.find((x) => x.id === questionId);
    if (!q) continue;
    const opt = q.options[selectedOption];
    if (!opt) continue;
    for (const [subcat, pts] of Object.entries(opt.subcatScores)) {
      subcatRaw[subcat] = (subcatRaw[subcat] ?? 0) + pts;
    }
  }

  // Normalise scenario subcategory scores to 0–10
  const subcatScenario: Record<string, number> = {};
  for (const [subcat, max] of Object.entries(subcatMax)) {
    const raw = subcatRaw[subcat] ?? 0;
    subcatScenario[subcat] = Math.round((raw / max) * 100) / 10; // 0-10, 1dp
  }

  // ── 2. Self-rating dimension scores (0–10) ─────────────────────────────────
  const srDimScore: Partial<Record<AssessmentDimension, number>> = {};
  for (const { questionId, selectedOption } of answers) {
    const sr = selfRatings.find((x) => x.id === questionId);
    if (!sr) continue;
    const opt = sr.options[selectedOption];
    if (!opt) continue;
    srDimScore[sr.dimension] = opt.normalisedScore;
  }

  // ── 3. Blended subcategory scores (70% scenario + 30% SR dimension) ────────
  const subcategoryScores: Record<string, number> = {};
  for (const [subcat, scenarioScore] of Object.entries(subcatScenario)) {
    const dim = subcatDim[subcat];
    const srScore = srDimScore[dim];
    if (srScore !== undefined) {
      subcategoryScores[subcat] = Math.round(
        (scenarioScore * 0.7 + srScore * 0.3) * 10
      ) / 10;
    } else {
      subcategoryScores[subcat] = scenarioScore;
    }
  }

  // ── 4. Dimension scores = average of subcategory scores ───────────────────
  const dimensionScores = {} as Record<AssessmentDimension, number>;
  for (const dim of DIMENSIONS) {
    const subcats = Object.entries(subcatDim)
      .filter(([, d]) => d === dim)
      .map(([subcat]) => subcategoryScores[subcat] ?? 0);

    if (subcats.length === 0) {
      // Fall back to self-rating if no scenario questions answered
      dimensionScores[dim] = srDimScore[dim] ?? 5.0;
    } else {
      const avg = subcats.reduce((a, b) => a + b, 0) / subcats.length;
      dimensionScores[dim] = Math.round(avg * 10) / 10;
    }
  }

  // ── 5. Overall readiness ───────────────────────────────────────────────────
  let overallReadiness = 0;
  for (const dim of DIMENSIONS) {
    overallReadiness += dimensionScores[dim] * OVERALL_WEIGHTS[dim];
  }
  overallReadiness = Math.round(overallReadiness * 10) / 10;

  // ── 6. Archetype assignment ────────────────────────────────────────────────
  const archetype = assignArchetypeFromDims(dimensionScores);

  // ── 7. Role type ───────────────────────────────────────────────────────────
  const roleType = assignRoleType(dimensionScores);

  // ── 8. Gap map ────────────────────────────────────────────────────────────
  const gapMap: GapEntry[] = Object.entries(subcategoryScores).map(
    ([subcat, score]) => {
      const dim = subcatDim[subcat] ?? "thinking_strategy";
      const benchmark = BENCHMARKS[dim];
      let status: GapEntry["status"];
      if (score >= benchmark) status = "green";
      else if (score >= benchmark - 1.5) status = "amber";
      else status = "red";
      return { subcategory: subcat, dimension: dim, score, benchmark, status };
    }
  );

  // Sort: red → amber → green
  const ORDER = { red: 0, amber: 1, green: 2 };
  gapMap.sort((a, b) => ORDER[a.status] - ORDER[b.status]);

  // ── 9. Bridge to 0-100 report scores ──────────────────────────────────────
  const reportDimensionScores = {} as DimensionScores;
  for (const dim of DIMENSIONS) {
    reportDimensionScores[DIM_MAP[dim]] = Math.round(dimensionScores[dim] * 10);
  }

  return {
    subcategoryScores,
    dimensionScores,
    overallReadiness,
    archetype,
    roleType,
    gapMap,
    reportDimensionScores,
  };
}

// ─── Archetype assignment ──────────────────────────────────────────────────────

function assignArchetypeFromDims(
  scores: Record<AssessmentDimension, number>
): ArchetypeKey {
  const sorted = (Object.entries(scores) as [AssessmentDimension, number][]).sort(
    (a, b) => b[1] - a[1]
  );
  const [topDim, topScore] = sorted[0];
  const secondScore = sorted[1]?.[1] ?? 0;

  // Clear winner: top dimension ≥ 1.5 points above second
  if (topScore - secondScore >= 1.5) {
    // Map dimension to archetype
    for (const [arch, dim] of Object.entries(ARCHETYPE_DIM) as [ArchetypeKey, AssessmentDimension][]) {
      if (dim === topDim && arch !== "explorer") return arch;
    }
  }

  // No clear winner → Explorer
  return "explorer";
}

// ─── Role type assignment ──────────────────────────────────────────────────────

function assignRoleType(scores: Record<AssessmentDimension, number>): string {
  const ts = scores.thinking_strategy;
  const ur = scores.user_research;
  const ex = scores.execution;
  const tf = scores.technical_fluency;
  const co = scores.communication;

  type Candidate = { role: string; score: number };
  const candidates: Candidate[] = [
    { role: "consumer_pm",  score: ur * 0.5 + co * 0.3 + ts * 0.2 },
    { role: "growth_pm",    score: ts * 0.4 + ur * 0.4 + ex * 0.2 },
    { role: "technical_pm", score: tf * 0.5 + ex * 0.3 + ts * 0.2 },
    { role: "b2b_pm",       score: co * 0.4 + ts * 0.35 + ex * 0.25 },
    { role: "data_pm",      score: tf * 0.5 + ts * 0.3 + ur * 0.2 },
    { role: "platform_pm",  score: ex * 0.4 + tf * 0.4 + ts * 0.2 },
  ];

  candidates.sort((a, b) => b.score - a.score);
  return candidates[0].role;
}

// ─── Helpers used by report / landing page ────────────────────────────────────

export function scoreColor(score: number): string {
  // Works for both 0-10 (threshold ÷ 10) and 0-100 scales
  const s = score > 10 ? score / 10 : score;
  if (s >= 7) return "#22c55e";
  if (s >= 5) return "#f59e0b";
  return "#ef4444";
}

export function scoreLabel(overall: number): string {
  const s = overall > 10 ? overall / 10 : overall;
  if (s >= 8.0) return "Strong";
  if (s >= 6.5) return "Ready to Interview";
  if (s >= 5.0) return "Developing";
  if (s >= 3.5) return "Early Stage";
  return "Foundational";
}

// ─── Legacy compat (used by archetypes.ts, report components) ────────────────

export { DIM_MAP as DIMENSION_MAP };

// Convert 0-10 dimensionScores to old 0-100 DimensionScores format
export function toDimensionScores(
  dimScores: Record<AssessmentDimension, number>
): DimensionScores {
  return {
    "strategic-thinking": Math.round(dimScores.thinking_strategy * 10),
    "product-sense": Math.round(dimScores.user_research * 10),
    "execution-depth": Math.round(dimScores.execution * 10),
    "technical-fluency": Math.round(dimScores.technical_fluency * 10),
    communication: Math.round(dimScores.communication * 10),
  };
}
