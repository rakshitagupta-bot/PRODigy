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
  type: "video" | "text" | "exercise";
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

// ─── Subcategories ────────────────────────────────────────────────────────────

export type Subcategory =
  | "problem framing"
  | "strategic tradeoffs"
  | "data-driven diagnosis"
  | "prioritisation"
  | "onboarding design"
  | "retention mechanics"
  | "user segmentation"
  | "user psychology"
  | "launch decisions"
  | "post-launch analysis"
  | "spec precision"
  | "scope negotiation"
  | "estimation challenge"
  | "data quality instinct"
  | "build vs buy"
  | "engineering partnership"
  | "conflict resolution"
  | "executive communication"
  | "facilitation"
  | "business case framing";

// ─── Roadmap Resource ─────────────────────────────────────────────────────────

export interface RoadmapResource {
  id:               string;
  subcategory:      Subcategory;
  type:             "video" | "text" | "exercise";
  title:            string;
  source:           string;
  duration:         string;           // e.g. "8 min"
  url:              string;
  whyThisTemplate:  string;
  difficulty:       "beginner" | "intermediate" | "advanced";
  biteSized:        boolean;          // true if < 10 min
}

// ─── Goal & Daily Plan ────────────────────────────────────────────────────────

export type GoalDuration = "1_month" | "3_months" | "5_months";

export interface DailyTask {
  id:                string;
  day:               number;
  subcategory:       Subcategory;
  resource:          RoadmapResource;
  isUnlocked:        boolean;
  isCompleted:       boolean;
  completedAt?:      string;
  confidenceRating?: number;
}

export interface DailyPlan {
  day:                 number;
  date:                string;        // ISO date
  tasks:               DailyTask[];
  isToday:             boolean;
  isCompleted:         boolean;
  reflectionCompleted: boolean;
}

export interface WeekPlan {
  weekNumber: number;
  title:      string;                 // "Week 1 · Metrics & KPIs Foundation"
  dimension:  Dimension;
  days:       DailyPlan[];
  progress:   number;                 // 0–100
}

// ─── Streaks ──────────────────────────────────────────────────────────────────

export interface StreakData {
  currentStreak:           number;
  longestStreak:           number;
  lastCompletedDate:       string;    // ISO date
  totalDaysCompleted:      number;
  streakFreezeAvailable:   boolean;
  streakFreezeUsedThisWeek: boolean;
}

// ─── Badges ───────────────────────────────────────────────────────────────────

export type BadgeId =
  | "first_day" | "week_1" | "streak_7" | "streak_30"
  | "strategist_unlock" | "builder_unlock" | "advocate_unlock" | "operator_unlock" | "explorer_unlock"
  | "dimension_master_ts" | "dimension_master_exec" | "dimension_master_tech" | "dimension_master_ur" | "dimension_master_comm"
  | "halfway" | "all_gaps_closed" | "perfect_week" | "comeback";

export interface Badge {
  id:          BadgeId;
  name:        string;
  description: string;
  icon:        string;
  earnedAt?:   string;
  isEarned:    boolean;
  category:    "streak" | "archetype" | "mastery" | "milestone";
}

// ─── Daily Reflection ─────────────────────────────────────────────────────────

export interface ReflectionQuestion {
  id:          string;
  subcategory: Subcategory;
  stem:        string;
  options:     { text: string; isCorrect: boolean }[];
  explanation: string;
}

// ─── Industry Feed ────────────────────────────────────────────────────────────

export interface FeedItem {
  id:                   string;
  title:                string;
  source:               string;
  url:                  string;
  category:             "startup" | "ai_product" | "job_market" | "industry_trend";
  relatedSubcategories: Subcategory[];
  publishedAt:          string;
  readTime:             string;
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
