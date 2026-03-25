// ─── Assessment Question types (new schema) ───────────────────────────────────

export type AssessmentDimension =
  | "thinking_strategy"
  | "user_research"
  | "execution"
  | "technical_fluency"
  | "communication";

export interface AssessmentOption {
  label: string; // "A" | "B" | "C" | "D"
  text: string;
  points: number; // 0–4 overall quality score
  subcatScores: Record<string, number>; // subcategory → 0–4
}

export interface AssessmentQuestion {
  id: string;
  dimension: AssessmentDimension;
  subcategories: string[];
  stem: string; // scenario + question combined
  options: AssessmentOption[];
  tier: 1 | 2 | 3;
}

export interface AssessmentSelfRatingOption {
  label: string; // "A" | "B" | "C" | "D"
  text: string;
  rawPoints: number; // 1–4
  normalisedScore: number; // 0–100
}

export interface AssessmentSelfRating {
  id: string;
  dimension: AssessmentDimension;
  subcategory: string;
  stem: string;
  options: AssessmentSelfRatingOption[];
}

// ─── Report / Scoring types ───────────────────────────────────────────────────

export type Dimension =
  | "strategic-thinking"
  | "product-sense"
  | "execution-depth"
  | "technical-fluency"
  | "communication";

export type DimensionScores = Record<Dimension, number>; // 0–100

export interface AssessmentResult {
  answers: Record<string, number>; // questionId → option index
  scenarioScores: DimensionScores;
  selfRatingScores: DimensionScores;
  compositeScores: DimensionScores;
  overallScore: number; // 0–100
  archetype: ArchetypeKey;
  roleTypes: RoleType[];
  completedAt: string; // ISO
}

// ─── Archetypes ───────────────────────────────────────────────────────────────

export type ArchetypeKey =
  | "builder"
  | "strategist"
  | "advocate"
  | "operator"
  | "explorer";

export interface Archetype {
  key: ArchetypeKey;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  strengths: string[];
  watchOuts: string[];
  targetCompanies: string[];
  targetRoles: RoleType[];
  color: string;
}

// ─── Role Types ───────────────────────────────────────────────────────────────

export type RoleType =
  | "Growth PM"
  | "Platform PM"
  | "Consumer PM"
  | "Enterprise PM"
  | "0→1 PM"
  | "Data PM"
  | "API/Developer PM";

// ─── Roadmap ──────────────────────────────────────────────────────────────────

export interface Resource {
  type: "video" | "article" | "exercise";
  title: string;
  url: string;
  duration?: string;
}

export interface RoadmapWeek {
  week: number;
  theme: string;
  objectives: string[];
  resources: Resource[];
}

export interface RoadmapContent {
  archetype: ArchetypeKey;
  weeks: RoadmapWeek[];
}

// ─── User / Auth ──────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  background?: string;
  result?: AssessmentResult;
  createdAt: string;
}
