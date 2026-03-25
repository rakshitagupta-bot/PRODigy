import type { AssessmentDimension, ArchetypeKey } from "@/types";
import type { ScoreProfile } from "@/lib/scoring";
import type { RoadmapContent } from "@/types";

// ─── Types ────────────────────────────────────────────────────────────────────

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

export type GoalDuration = "1_month" | "3_months" | "5_months";

export interface RoadmapResource {
  id:         string;
  subcategory: Subcategory;
  dimension:  AssessmentDimension;
  type:       "video" | "article" | "exercise";
  title:      string;
  url:        string;
  source:     string;
  duration:   number;    // minutes
  biteSized:  boolean;   // true if duration <= 10
  difficulty: "beginner" | "intermediate" | "advanced";
  whyThis:    string;
}

export interface DailyTask {
  resource:    RoadmapResource;
  subcategory: Subcategory;
  status:      "red" | "amber" | "green";
  whyThis:     string;
}

export interface WeekPlan {
  weekNumber:       number;
  title:            string;
  primaryDimension: AssessmentDimension;
  days:             { dayNumber: number; tasks: DailyTask[] }[];
}

export interface ReflectionQuestion {
  id:           string;
  subcategory:  Subcategory;
  stem:         string;
  options:      [string, string, string];
  correctIndex: 0 | 1 | 2;
  explanation:  string;
}

// ─── Subcategory metadata ─────────────────────────────────────────────────────

export const SUBCAT_TO_DIM: Record<Subcategory, AssessmentDimension> = {
  "problem framing":         "thinking_strategy",
  "strategic tradeoffs":     "thinking_strategy",
  "data-driven diagnosis":   "thinking_strategy",
  "prioritisation":          "thinking_strategy",
  "onboarding design":       "user_research",
  "retention mechanics":     "user_research",
  "user segmentation":       "user_research",
  "user psychology":         "user_research",
  "launch decisions":        "execution",
  "post-launch analysis":    "execution",
  "spec precision":          "execution",
  "scope negotiation":       "execution",
  "estimation challenge":    "technical_fluency",
  "data quality instinct":   "technical_fluency",
  "build vs buy":            "technical_fluency",
  "engineering partnership": "technical_fluency",
  "conflict resolution":     "communication",
  "executive communication": "communication",
  "facilitation":            "communication",
  "business case framing":   "communication",
};

const CANONICAL_SUBCATS = new Set<string>(Object.keys(SUBCAT_TO_DIM));

const GOAL_DAYS: Record<GoalDuration, number> = {
  "1_month":   30,
  "3_months":  90,
  "5_months":  150,
};

const MAX_PER_DAY: Record<GoalDuration, number> = {
  "1_month":   3,
  "3_months":  2,
  "5_months":  1,
};

const WHY_THIS: Record<Subcategory, string> = {
  "problem framing":         "Most PM interviews start here — reframing messy briefs separates senior PMs from junior ones.",
  "strategic tradeoffs":     "Every roadmap is a series of bets. This skill makes you credible in leadership meetings.",
  "data-driven diagnosis":   "PMs who can't read data fly blind. This is table stakes at any tech company.",
  "prioritisation":          "If you can't say no with evidence, you can't lead a product.",
  "onboarding design":       "The first 60 seconds decide whether a user stays. Most products lose people here.",
  "retention mechanics":     "Acquisition is expensive. Retention compounds. The maths always favours retention.",
  "user segmentation":       "Your instinct about 'users' is almost always wrong. This skill corrects for it.",
  "user psychology":         "The gap between what users say and what they do is where product opportunities live.",
  "launch decisions":        "Shipping isn't a moment — it's a system. How you launch determines what you learn.",
  "post-launch analysis":    "Most teams ship and move on. Post-launch rigour turns launches into learning.",
  "spec precision":          "Vague specs get built wrong. This skill saves sprint cycles and engineering trust.",
  "scope negotiation":       "Scope is the PM's primary lever. Learn to use it without damaging relationships.",
  "estimation challenge":    "Eight weeks often means two weeks of work. Learn to see the difference.",
  "data quality instinct":   "Bad data feels like good data until you act on it. Spot the discrepancy first.",
  "build vs buy":            "Wrong build vs buy decisions compound over years. This is where opportunity cost lives.",
  "engineering partnership": "The best PMs are trusted co-pilots for engineering. This is how you become one.",
  "conflict resolution":     "The PM is always in the middle. This skill makes you a connector, not a blocker.",
  "executive communication": "Speaking in P&L terms unlocks executive buy-in. Most PMs never learn this.",
  "facilitation":            "When a room is stuck, the PM who unblocks it earns authority without hierarchy.",
  "business case framing":   "Same message, wrong frame = zero buy-in. Financial framing is a force multiplier.",
};

// ─── Resource builder (keeps the array compact) ───────────────────────────────

function r(
  id: string,
  subcategory: Subcategory,
  type: "video" | "article" | "exercise",
  title: string,
  url: string,
  source: string,
  duration: number,
  difficulty: "beginner" | "intermediate" | "advanced"
): RoadmapResource {
  return {
    id, subcategory,
    dimension:  SUBCAT_TO_DIM[subcategory],
    type, title, url, source, duration,
    biteSized:  duration <= 10,
    difficulty,
    whyThis:    WHY_THIS[subcategory],
  };
}

// ─── All 100 resources (5 per subcategory × 20 subcategories) ─────────────────

export const allResources: RoadmapResource[] = [

  // ── problem framing ──────────────────────────────────────────────────────────
  r("pf-v1", "problem framing", "video",    "How to Frame Product Problems Like a Senior PM",         "https://www.youtube.com/watch?v=h25eElbdANQ", "Exponent", 20, "intermediate"),
  r("pf-v2", "problem framing", "video",    "Problem Definition in Product Strategy",                  "https://www.youtube.com/watch?v=0bF7oX39N4A", "Lenny's Podcast", 18, "intermediate"),
  r("pf-a1", "problem framing", "article",  "The Reframing Trap: Why PMs Solve the Wrong Problem",    "https://review.firstround.com/the-pm-skills-that-matter-most", "First Round Review", 8, "intermediate"),
  r("pf-a2", "problem framing", "article",  "The 5 Whys: A PM's Most Underused Diagnostic Tool",      "https://www.mindtheproduct.com/the-5-whys-for-product-managers/", "Mind the Product", 6, "beginner"),
  r("pf-e1", "problem framing", "exercise", "Problem Reframing Drill: 3 Real Briefs, 10 Minutes",      "https://www.tryexponent.com/practice/product-manager", "Exponent Practice", 10, "beginner"),

  // ── strategic tradeoffs ──────────────────────────────────────────────────────
  r("st-v1", "strategic tradeoffs", "video",    "Good Strategy vs Bad Strategy — What PMs Need to Know",   "https://www.youtube.com/watch?v=Pj0cME8Drpc", "YouTube", 22, "advanced"),
  r("st-v2", "strategic tradeoffs", "video",    "How Senior PMs Handle Hard Product Tradeoffs",            "https://www.youtube.com/watch?v=Ii6VELPgDL8", "Reforge", 20, "intermediate"),
  r("st-a1", "strategic tradeoffs", "article",  "Aggregation Theory and Why Platform Tradeoffs Are Hard",  "https://stratechery.com/aggregation-theory/", "Stratechery", 10, "advanced"),
  r("st-a2", "strategic tradeoffs", "article",  "The PM's Framework for Segment Tradeoffs",               "https://www.reforge.com/blog/choosing-your-segment", "Reforge", 7, "intermediate"),
  r("st-e1", "strategic tradeoffs", "exercise", "Score 5 Product Decisions Using Impact vs Complexity",   "https://www.tryexponent.com/practice/product-manager", "Exponent Practice", 10, "beginner"),

  // ── data-driven diagnosis ────────────────────────────────────────────────────
  r("dd-v1", "data-driven diagnosis", "video",    "Product Analytics 101: Funnels, Cohorts, and Retention",  "https://www.youtube.com/watch?v=vhekbT7JWRM", "Amplitude", 25, "beginner"),
  r("dd-v2", "data-driven diagnosis", "video",    "How to Debug a Broken Metric",                            "https://www.youtube.com/watch?v=FJLKIiB8mNc", "Reforge", 20, "intermediate"),
  r("dd-a1", "data-driven diagnosis", "article",  "The Metrics That Lie: When DAU Misleads You",             "https://amplitude.com/blog/metrics-that-mislead", "Amplitude", 8, "intermediate"),
  r("dd-a2", "data-driven diagnosis", "article",  "The PM's Starter Kit for Metric Ownership",               "https://www.lennysnewsletter.com/p/north-star-metric", "Lenny's Newsletter", 7, "beginner"),
  r("dd-e1", "data-driven diagnosis", "exercise", "Diagnose a Metrics Discrepancy: 3 Scenarios",             "https://www.tryexponent.com/practice/metrics", "Exponent Practice", 10, "intermediate"),

  // ── prioritisation ───────────────────────────────────────────────────────────
  r("pr-v1", "prioritisation", "video",    "Prioritization Frameworks That Actually Work",              "https://www.youtube.com/watch?v=ZgmKmkDuGVA", "Exponent", 22, "intermediate"),
  r("pr-v2", "prioritisation", "video",    "Opportunity Scoring: Teresa Torres on Prioritisation",      "https://www.youtube.com/watch?v=sDnaF8TzgM0", "Product Talk", 20, "intermediate"),
  r("pr-a1", "prioritisation", "article",  "RICE Scoring Model Explained",                             "https://www.productplan.com/glossary/rice-scoring-model/", "ProductPlan", 6, "beginner"),
  r("pr-a2", "prioritisation", "article",  "How I Prioritize Features at Scale",                       "https://www.lennysnewsletter.com/p/how-to-prioritize-features", "Lenny's Newsletter", 8, "intermediate"),
  r("pr-e1", "prioritisation", "exercise", "RICE Score 5 Competing Features from a Real Product",      "https://www.tryexponent.com/practice/product-manager", "Exponent Practice", 10, "beginner"),

  // ── onboarding design ────────────────────────────────────────────────────────
  r("od-v1", "onboarding design", "video",    "Onboarding UX That Converts: The Science of the Aha Moment", "https://www.youtube.com/watch?v=qmfpI6jk8xg", "CXL Institute", 20, "intermediate"),
  r("od-v2", "onboarding design", "video",    "How Slack Nailed Onboarding for Every User Type",             "https://www.youtube.com/watch?v=xQQo-TkPFrg", "Lenny's Podcast", 18, "intermediate"),
  r("od-a1", "onboarding design", "article",  "Find Your Product's Aha Moment",                             "https://review.firstround.com/find-your-products-aha-moment", "First Round Review", 8, "intermediate"),
  r("od-a2", "onboarding design", "article",  "Value Before Ask: The Onboarding Design Pattern That Works",  "https://www.intercom.com/blog/onboarding-users/", "Intercom", 6, "beginner"),
  r("od-e1", "onboarding design", "exercise", "Critique the Onboarding of 2 Apps You Use Daily",            "https://www.tryexponent.com/practice/product-design", "Exponent Practice", 10, "beginner"),

  // ── retention mechanics ──────────────────────────────────────────────────────
  r("rm-v1", "retention mechanics", "video",    "Hooked: How to Build Habit-Forming Products",           "https://www.youtube.com/watch?v=c6y0KAIQv5g", "TEDx Nir Eyal", 15, "intermediate"),
  r("rm-v2", "retention mechanics", "video",    "What Actually Drives Retention? The Reforge Framework", "https://www.youtube.com/watch?v=Ii6VELPgDL8", "Reforge", 22, "advanced"),
  r("rm-a1", "retention mechanics", "article",  "Retention by Cohort: How to Measure What Matters",      "https://amplitude.com/blog/cohort-retention-analysis", "Amplitude", 8, "intermediate"),
  r("rm-a2", "retention mechanics", "article",  "Why Users Churn and How to Stop Them",                  "https://www.intercom.com/blog/why-users-churn/", "Intercom", 7, "beginner"),
  r("rm-e1", "retention mechanics", "exercise", "Map the Habit Loop for an App With Low Retention",      "https://www.tryexponent.com/practice/product-manager", "Exponent Practice", 10, "intermediate"),

  // ── user segmentation ────────────────────────────────────────────────────────
  r("us-v1", "user segmentation", "video",    "Jobs to Be Done: The Framework That Changes Everything",  "https://www.youtube.com/watch?v=sfGtd2UXidU", "Bob Moesta", 22, "intermediate"),
  r("us-v2", "user segmentation", "video",    "User Segmentation for Product Managers",                 "https://www.youtube.com/watch?v=d6o_I_4jQCg", "Product School", 18, "beginner"),
  r("us-a1", "user segmentation", "article",  "Power Users: How to Identify and Serve Your Best Segment", "https://www.lennysnewsletter.com/p/power-users", "Lenny's Newsletter", 8, "intermediate"),
  r("us-a2", "user segmentation", "article",  "Behavioural Segmentation: Beyond Demographics",          "https://www.reforge.com/blog/behavioral-segmentation", "Reforge", 7, "beginner"),
  r("us-e1", "user segmentation", "exercise", "Segment the Users of a Product You Know Well",           "https://www.tryexponent.com/practice/product-manager", "Exponent Practice", 10, "beginner"),

  // ── user psychology ──────────────────────────────────────────────────────────
  r("up-v1", "user psychology", "video",    "Cognitive Biases That Affect Product Decisions",         "https://www.youtube.com/watch?v=wEwGBIr_RIw", "Nielsen Norman Group", 20, "intermediate"),
  r("up-v2", "user psychology", "video",    "Understanding User Psychology for Better Products",      "https://www.youtube.com/watch?v=Qq3OiHQ-HCU", "Exponent", 18, "intermediate"),
  r("up-a1", "user psychology", "article",  "The Jobs-to-Be-Done Interview Guide",                   "https://www.intercom.com/blog/the-jobs-to-be-done-framework/", "Intercom", 8, "intermediate"),
  r("up-a2", "user psychology", "article",  "How to Develop Strong Product Taste",                   "https://review.firstround.com/how-to-develop-product-taste", "First Round Review", 7, "beginner"),
  r("up-e1", "user psychology", "exercise", "Run a 15-Minute User Interview on Any Product",          "https://www.tryexponent.com/practice/product-manager", "Exponent Practice", 15, "intermediate"),

  // ── launch decisions ─────────────────────────────────────────────────────────
  r("ld-v1", "launch decisions", "video",    "The PM's Product Launch Framework",                     "https://www.youtube.com/watch?v=CcA-3BGXY4w", "Lenny's Podcast", 20, "intermediate"),
  r("ld-v2", "launch decisions", "video",    "How to Run a Staged Rollout",                           "https://www.youtube.com/watch?v=nYg4jNJKAI8", "Exponent", 18, "intermediate"),
  r("ld-a1", "launch decisions", "article",  "Product Launch Checklist — What PMs Miss",              "https://www.lennysnewsletter.com/p/product-launch", "Lenny's Newsletter", 7, "beginner"),
  r("ld-a2", "launch decisions", "article",  "The Soft Launch Decision: How to Know When to Limit Rollout", "https://www.mindtheproduct.com/soft-launch-decision/", "Mind the Product", 6, "intermediate"),
  r("ld-e1", "launch decisions", "exercise", "Write a Launch Criteria Doc for a Feature You Know",    "https://www.tryexponent.com/practice/product-manager", "Exponent Practice", 10, "beginner"),

  // ── post-launch analysis ─────────────────────────────────────────────────────
  r("pl-v1", "post-launch analysis", "video",    "The PM Playbook for Post-Launch Ownership",           "https://www.youtube.com/watch?v=5O8L6_pRCZ4", "Reforge", 22, "intermediate"),
  r("pl-v2", "post-launch analysis", "video",    "How to Run a Product Post-Mortem That Changes Things", "https://www.youtube.com/watch?v=9BLh_q77CRk", "Exponent", 18, "intermediate"),
  r("pl-a1", "post-launch analysis", "article",  "Post-Mortem Culture at Google",                       "https://sre.google/sre-book/postmortem-culture/", "Google SRE Book", 7, "intermediate"),
  r("pl-a2", "post-launch analysis", "article",  "What Good Retrospectives Actually Look Like",          "https://review.firstround.com/how-to-run-a-good-retrospective", "First Round Review", 8, "intermediate"),
  r("pl-e1", "post-launch analysis", "exercise", "Write a Post-Mortem for a Feature That Underperformed", "https://www.tryexponent.com/practice/product-manager", "Exponent Practice", 10, "intermediate"),

  // ── spec precision ───────────────────────────────────────────────────────────
  r("sp-v1", "spec precision", "video",    "How to Write a Great PRD",                              "https://www.youtube.com/watch?v=BFbGUEcJKy4", "Gibson Biddle", 20, "intermediate"),
  r("sp-v2", "spec precision", "video",    "Amazon's 6-Pager vs the Traditional PRD",               "https://www.youtube.com/watch?v=a_SKJHLdEoA", "Exponent", 18, "intermediate"),
  r("sp-a1", "spec precision", "article",  "Amazon's 6-Pager Memo Format Explained",                "https://www.productplan.com/glossary/amazon-6-pager/", "ProductPlan", 6, "beginner"),
  r("sp-a2", "spec precision", "article",  "How to Write a Spec Engineering Will Actually Use",     "https://www.intercom.com/blog/writing-product-specs/", "Intercom", 8, "intermediate"),
  r("sp-e1", "spec precision", "exercise", "Write a One-Page Spec for a Feature in 15 Minutes",    "https://www.tryexponent.com/practice/product-manager", "Exponent Practice", 15, "intermediate"),

  // ── scope negotiation ────────────────────────────────────────────────────────
  r("sn-v1", "scope negotiation", "video",    "Negotiating Scope Without Damaging Engineering Trust", "https://www.youtube.com/watch?v=ZgmKmkDuGVA", "Exponent", 20, "intermediate"),
  r("sn-v2", "scope negotiation", "video",    "Sprint Planning Best Practices for PMs",              "https://www.youtube.com/watch?v=zoMHbdJJdEA", "Atlassian", 18, "beginner"),
  r("sn-a1", "scope negotiation", "article",  "The Art of the MVP Negotiation",                      "https://review.firstround.com/the-art-of-the-mvp", "First Round Review", 8, "intermediate"),
  r("sn-a2", "scope negotiation", "article",  "How to Handle Mid-Sprint Escalations",                "https://www.mindtheproduct.com/mid-sprint-escalations/", "Mind the Product", 6, "beginner"),
  r("sn-e1", "scope negotiation", "exercise", "Scope a Feature Down to an MVP in 10 Minutes",        "https://www.tryexponent.com/practice/product-manager", "Exponent Practice", 10, "beginner"),

  // ── estimation challenge ─────────────────────────────────────────────────────
  r("ec-v1", "estimation challenge", "video",    "How PMs Challenge Engineering Estimates Constructively", "https://www.youtube.com/watch?v=nYg4jNJKAI8", "Exponent", 20, "intermediate"),
  r("ec-v2", "estimation challenge", "video",    "Story Points and Estimation Demystified",               "https://www.youtube.com/watch?v=zoMHbdJJdEA", "Atlassian", 15, "beginner"),
  r("ec-a1", "estimation challenge", "article",  "Why Engineers Give Bad Estimates and What PMs Can Do",  "https://www.reforge.com/blog/engineering-estimates", "Reforge", 8, "intermediate"),
  r("ec-a2", "estimation challenge", "article",  "Breaking Down Engineering Estimates as a PM",           "https://productschool.com/blog/product-management/engineering-estimates/", "Product School", 6, "beginner"),
  r("ec-e1", "estimation challenge", "exercise", "Decompose a Feature Into Tasks and Spot the Unknowns", "https://www.tryexponent.com/practice/product-manager", "Exponent Practice", 10, "intermediate"),

  // ── data quality instinct ────────────────────────────────────────────────────
  r("dq-v1", "data quality instinct", "video",    "Data Quality Issues PMs Miss",                       "https://www.youtube.com/watch?v=vhekbT7JWRM", "Amplitude", 20, "intermediate"),
  r("dq-v2", "data quality instinct", "video",    "How to Spot Metric Discrepancies Before They Bite You", "https://www.youtube.com/watch?v=FJLKIiB8mNc", "Reforge", 18, "advanced"),
  r("dq-a1", "data quality instinct", "article",  "When Your Data Lies to You",                          "https://www.lennysnewsletter.com/p/when-your-data-lies", "Lenny's Newsletter", 8, "intermediate"),
  r("dq-a2", "data quality instinct", "article",  "The PM's Guide to Metric Hygiene",                    "https://segment.com/blog/metric-hygiene/", "Segment", 7, "beginner"),
  r("dq-e1", "data quality instinct", "exercise", "Debug a DAU/Revenue Discrepancy Scenario",            "https://www.tryexponent.com/practice/metrics", "Exponent Practice", 10, "intermediate"),

  // ── build vs buy ─────────────────────────────────────────────────────────────
  r("bb-v1", "build vs buy", "video",    "Build vs Buy: How PMs Should Think About It",        "https://www.youtube.com/watch?v=xoab4Dc4Pns", "Exponent", 22, "intermediate"),
  r("bb-v2", "build vs buy", "video",    "Platform Strategy: When to Own and When to Integrate", "https://www.youtube.com/watch?v=ByGJQzlzxQg", "a16z", 20, "advanced"),
  r("bb-a1", "build vs buy", "article",  "Total Cost of Ownership for Product Decisions",       "https://www.reforge.com/blog/build-vs-buy-total-cost", "Reforge", 8, "intermediate"),
  r("bb-a2", "build vs buy", "article",  "Make vs Buy: A Decision Framework for PMs",           "https://www.mindtheproduct.com/make-vs-buy-framework/", "Mind the Product", 7, "beginner"),
  r("bb-e1", "build vs buy", "exercise", "Model a Build vs Buy Decision with Real Numbers",     "https://www.tryexponent.com/practice/product-manager", "Exponent Practice", 12, "intermediate"),

  // ── engineering partnership ──────────────────────────────────────────────────
  r("ep-v1", "engineering partnership", "video",    "The PM-Engineer Partnership: What Great Looks Like",    "https://www.youtube.com/watch?v=LelFUAsxXUI", "Lenny's Podcast", 25, "intermediate"),
  r("ep-v2", "engineering partnership", "video",    "How to Work With Engineering Teams as a PM",            "https://www.youtube.com/watch?v=nYg4jNJKAI8", "Exponent", 20, "beginner"),
  r("ep-a1", "engineering partnership", "article",  "The Best PMs Aren't Technical — They're Collaborative", "https://review.firstround.com/the-anatomy-of-the-perfect-technical-pm-interview", "First Round Review", 7, "intermediate"),
  r("ep-a2", "engineering partnership", "article",  "Technical Fluency for Non-Technical PMs",              "https://review.firstround.com/technical-fluency", "First Round Review", 8, "beginner"),
  r("ep-e1", "engineering partnership", "exercise", "Shadow an Engineering Standup and Document Key Patterns", "https://www.tryexponent.com/practice/product-manager", "Exponent Practice", 15, "intermediate"),

  // ── conflict resolution ──────────────────────────────────────────────────────
  r("cr-v1", "conflict resolution", "video",    "Influence Without Authority: The PM Superpower",        "https://www.youtube.com/watch?v=V97Iy_XR0KA", "YouTube", 20, "intermediate"),
  r("cr-v2", "conflict resolution", "video",    "How to Handle Stakeholder Conflict as a PM",            "https://www.youtube.com/watch?v=d6o_I_4jQCg", "Product School", 18, "beginner"),
  r("cr-a1", "conflict resolution", "article",  "Pre-Meeting Alignment: A PM Playbook",                  "https://www.lennysnewsletter.com/p/pre-meeting-alignment", "Lenny's Newsletter", 7, "intermediate"),
  r("cr-a2", "conflict resolution", "article",  "The PM's Guide to Difficult Conversations",             "https://review.firstround.com/difficult-conversations", "First Round Review", 8, "advanced"),
  r("cr-e1", "conflict resolution", "exercise", "Map Your Stakeholders and Their Likely Objections",     "https://www.tryexponent.com/practice/product-manager", "Exponent Practice", 10, "intermediate"),

  // ── executive communication ──────────────────────────────────────────────────
  r("xc-v1", "executive communication", "video",    "How to Present to Executives as a PM",               "https://www.youtube.com/watch?v=a_SKJHLdEoA", "Exponent", 20, "intermediate"),
  r("xc-v2", "executive communication", "video",    "The CFO-Friendly Product Pitch",                     "https://www.youtube.com/watch?v=5O8L6_pRCZ4", "Reforge", 18, "advanced"),
  r("xc-a1", "executive communication", "article",  "LTV and CAC: What Every PM Needs to Know",           "https://www.reforge.com/blog/unit-economics", "Reforge", 8, "intermediate"),
  r("xc-a2", "executive communication", "article",  "Business Cases That Actually Get Approved",          "https://www.mindtheproduct.com/business-cases-that-get-approved/", "Mind the Product", 7, "intermediate"),
  r("xc-e1", "executive communication", "exercise", "Write a One-Page Business Case for a Real Feature",  "https://www.tryexponent.com/practice/product-manager", "Exponent Practice", 15, "advanced"),

  // ── facilitation ─────────────────────────────────────────────────────────────
  r("fa-v1", "facilitation", "video",    "Facilitating Technical Decisions as a PM",               "https://www.youtube.com/watch?v=xoab4Dc4Pns", "Exponent", 20, "intermediate"),
  r("fa-v2", "facilitation", "video",    "How to Run Effective Product Review Meetings",            "https://www.youtube.com/watch?v=zoMHbdJJdEA", "Atlassian", 15, "beginner"),
  r("fa-a1", "facilitation", "article",  "The Art of the Decision Meeting",                        "https://review.firstround.com/the-art-of-the-decision-meeting", "First Round Review", 8, "intermediate"),
  r("fa-a2", "facilitation", "article",  "How to Break Technical Ties Without Choosing Sides",     "https://www.mindtheproduct.com/how-to-break-technical-ties/", "Mind the Product", 6, "intermediate"),
  r("fa-e1", "facilitation", "exercise", "Facilitate a Mock Architecture Debate: 2 Engineers, 10 Min", "https://www.tryexponent.com/practice/product-manager", "Exponent Practice", 10, "beginner"),

  // ── business case framing ────────────────────────────────────────────────────
  r("bf-v1", "business case framing", "video",    "Building Business Cases for Product Investment",     "https://www.youtube.com/watch?v=5O8L6_pRCZ4", "Reforge", 22, "advanced"),
  r("bf-v2", "business case framing", "video",    "How PMs Frame Investment Decisions for Leadership",  "https://www.youtube.com/watch?v=a_SKJHLdEoA", "Exponent", 20, "intermediate"),
  r("bf-a1", "business case framing", "article",  "Unit Economics Every PM Should Know",               "https://www.reforge.com/blog/unit-economics", "Reforge", 8, "intermediate"),
  r("bf-a2", "business case framing", "article",  "The One-Page Business Case",                        "https://gibsonbiddle.medium.com/the-one-page-business-case", "Gibson Biddle", 7, "intermediate"),
  r("bf-e1", "business case framing", "exercise", "Model the ROI of a Feature: Retention + Cost",     "https://www.tryexponent.com/practice/product-manager", "Exponent Practice", 15, "advanced"),
];

// ─── Reflection question builder ──────────────────────────────────────────────

function q(
  id: string,
  subcategory: Subcategory,
  stem: string,
  options: [string, string, string],
  correctIndex: 0 | 1 | 2,
  explanation: string
): ReflectionQuestion {
  return { id, subcategory, stem, options, correctIndex, explanation };
}

// ─── 40 reflection questions (2 per subcategory) ──────────────────────────────

const REFLECTION_QUESTIONS: ReflectionQuestion[] = [

  q("rq-pf1", "problem framing",
    "Your CEO says 'build a feature to increase signups.' You do what first?",
    ["Start sketching the feature immediately", "Ask what problem higher signups is meant to solve", "Review competitor features for inspiration"],
    1, "Jumping to solutions is the #1 PM trap. Always define the problem before committing to a solution."),

  q("rq-pf2", "problem framing",
    "You're asked to 'fix the onboarding.' Before acting, you...",
    ["Run an A/B test on the onboarding flow", "Define what 'fixed' means — is it lower drop-off, faster activation, or both?", "Redesign the UI based on UX best practices"],
    1, "Ambiguous briefs need a clear success definition before any work starts. 'Fixed' means different things to different stakeholders."),

  q("rq-st1", "strategic tradeoffs",
    "Enterprise wants customisation. SMB wants simplicity. Engineering can't build both. You...",
    ["Build for enterprise — they pay more", "Model the long-term revenue impact of each segment before recommending", "Let the sales team decide — they're closest to customers"],
    1, "Defaulting to the higher-paying segment ignores churn risk and future growth. The right call requires modelling both scenarios."),

  q("rq-st2", "strategic tradeoffs",
    "A feature would increase MAU but cannbalise revenue per user. You...",
    ["Reject it — revenue per user matters more than raw growth", "Model both effects over 12 months before making a call", "Launch it — MAU growth always unlocks more revenue eventually"],
    1, "Neither answer is right without data. The job is to quantify the tradeoff, not to hold a prior opinion about which metric matters more."),

  q("rq-dd1", "data-driven diagnosis",
    "Checkout completion drops 12% overnight. No deployments. Your first move?",
    ["Alert the team and roll back the last release", "Segment the drop by device, geo, payment method, and cohort", "Message customer support to check complaint volume"],
    1, "Segmenting before escalating is how you isolate the cause and avoid false alarms. Rolling back before diagnosing may fix nothing."),

  q("rq-dd2", "data-driven diagnosis",
    "DAU is up 15% but revenue is flat. First thing you check?",
    ["Whether it's a seasonal pattern and wait another week", "Whether the DAU definition changed or includes free / test accounts", "Whether the revenue pipeline has a reporting lag"],
    1, "Metric discrepancies almost always trace back to definition changes or data pipeline issues — not business performance. Check the definitions first."),

  q("rq-pr1", "prioritisation",
    "Three features are competing for next sprint. Limited data on all three. You...",
    ["Pick the most technically interesting one", "Score each on expected impact, effort, and confidence", "Ask sales which one they need most urgently"],
    1, "Even with limited data, a structured scoring exercise forces explicit assumptions and reveals hidden disagreements across the team."),

  q("rq-pr2", "prioritisation",
    "A low-visibility feature saves 8% of failed transactions. A flashy feature has unclear ROI. You...",
    ["Build the flashy feature — visibility drives team morale", "Build the transaction fix — revenue impact is clearer and compounding", "Present both to leadership and let them decide"],
    1, "Unglamorous fixes with clear impact almost always beat visible features with uncertain ROI. The 8% compounds every month you delay."),

  q("rq-od1", "onboarding design",
    "Signup-to-activation is 30%. Onboarding has 8 steps. First change you test?",
    ["Add a progress bar to motivate completion", "Reduce to 3 steps and show immediate value before requesting more data", "Improve the copy on each existing step"],
    1, "Progress bars don't fix too much friction — they just make friction feel nicer. Removing steps solves the actual problem."),

  q("rq-od2", "onboarding design",
    "Users drop off at step 3 of onboarding where you first request credit card. You...",
    ["Add 'you won't be charged' reassurance copy", "Move the payment ask to after the user has experienced core value", "Make step 3 visually simpler and cleaner"],
    1, "Reassurance copy treats the symptom. Moving the friction point to post-value treats the cause. Users need a reason to trust you before they give you payment details."),

  q("rq-rm1", "retention mechanics",
    "D7 retention is 20%. Users say they 'forget to come back.' First move?",
    ["Add push notifications immediately", "Find what triggers re-engagement in retained users and build that habit loop", "Add more features to give users more reasons to return"],
    1, "Push notifications treat the symptom. Understanding what makes retained users return gives you the actual lever — then you design the product to create that trigger naturally."),

  q("rq-rm2", "retention mechanics",
    "Power users have 80% D30 retention. Casual users have 15%. You...",
    ["Focus resources entirely on casual users — that's the growth opportunity", "Identify what behaviour separates power users and architect it for casual users", "Build loyalty features to protect the power user base"],
    1, "The power users tell you what 'good' looks like. Your job is to make that pattern accessible earlier in the journey for everyone else."),

  q("rq-us1", "user segmentation",
    "70% of revenue comes from 10% of users. Your next initiative should...",
    ["Focus only on the top 10% — they're the business", "Investigate why the other 90% are low-value before deciding", "Run paid acquisition to find more users like the top 10%"],
    1, "You can't grow the 90% without understanding why they're disengaged. The answer determines whether it's a product, pricing, or positioning problem."),

  q("rq-us2", "user segmentation",
    "A new unplanned user segment starts growing organically. You...",
    ["Build the features they've been requesting in support tickets", "Interview 5-10 of them to understand the job they're hiring your product for", "Wait to see if the growth is sustained before investing"],
    1, "Feature requests without context lead to wrong solutions. JTBD interviews reveal the underlying need, which may be solvable in a way that benefits all segments."),

  q("rq-up1", "user psychology",
    "A user says your app is 'confusing.' You investigate by...",
    ["Simplifying the UI based on design best practices", "Asking them to walk you through exactly where they got stuck and why", "Comparing your NPS to industry benchmarks"],
    1, "'Confusing' is a label, not a diagnosis. You need to observe the specific failure point — what they expected vs what happened."),

  q("rq-up2", "user psychology",
    "You're designing for Tier-2 city users and assume they want simpler UI. You...",
    ["Build the simpler UI — it's a safe assumption", "Validate the assumption with 5 user interviews before committing", "Check analytics to see if these users engage with complex features less"],
    1, "Assumptions about underserved users are often projections, not insights. These users may want capability, not simplicity — interview first."),

  q("rq-ld1", "launch decisions",
    "A critical bug found 2 days before launch affects 5% of users. You...",
    ["Always delay — never ship a broken product", "Assess who's affected, the severity, and the competitive cost of a 3-week delay", "Ship on time and patch post-launch — velocity matters"],
    1, "Neither 'always delay' nor 'always ship' is a strategy. Good launch decisions require assessing blast radius, user criticality, and opportunity cost."),

  q("rq-ld2", "launch decisions",
    "You're ready to launch. Your instinct is to skip a soft launch to save time. You...",
    ["Skip it — staged rollouts are for big companies only", "Run a 5% rollout to catch unexpected issues before full launch", "Launch to everyone — staged rollouts confuse users"],
    1, "Soft launches catch the 1% of edge cases that slip through QA. The cost is 2 extra days. The avoided cost is potentially millions in user trust."),

  q("rq-pl1", "post-launch analysis",
    "A feature you shipped 6 weeks ago isn't moving the target metric. You...",
    ["Accept it and move on — not every bet pays off", "Run a post-mortem: was the hypothesis wrong, execution wrong, or too early?", "Ship v2 immediately based on the first 6 weeks of feedback"],
    1, "Moving on without diagnosis means you'll repeat the same mistake. Iterating without a post-mortem means building on a broken foundation."),

  q("rq-pl2", "post-launch analysis",
    "Your post-launch data is inconclusive after 3 weeks. You...",
    ["Wait 6 more weeks for the data to stabilise", "Define what data you'd need to make a call and set a specific decision deadline", "Declare success — the absence of bad news is good news"],
    1, "Inconclusive doesn't mean 'wait longer.' It means your success criteria weren't defined clearly enough. Name what you need to see and by when."),

  q("rq-sp1", "spec precision",
    "Engineering built your feature differently from the spec. UX is compromised. You...",
    ["Accept it — engineers understand constraints better than you do", "Find the minimum change that preserves UX intent and propose it in a 1:1", "Escalate to the engineering manager"],
    1, "Accepting silently erodes UX. Escalating damages trust. The right move is a collaborative 1:1 where you propose a specific, minimal fix."),

  q("rq-sp2", "spec precision",
    "Writing a spec for a complex feature. What do you define first?",
    ["The exact technical implementation approach", "The user problem, expected outcome, and non-negotiable constraints", "Every edge case and failure mode upfront"],
    1, "PMs own the 'what' and 'why', not the 'how'. Start with the problem and outcome — engineering needs the space to solve the implementation."),

  q("rq-sn1", "scope negotiation",
    "Engineering estimates 8 weeks. You think 4 is achievable. You...",
    ["Accept the estimate — you don't have an engineering background", "Ask for the breakdown by task to see where the time is going", "Challenge the estimate openly in sprint planning"],
    1, "Accepting blindly abdicates your responsibility. Challenging publicly creates conflict. Asking for a breakdown is the only collaborative path forward."),

  q("rq-sn2", "scope negotiation",
    "Mid-sprint, a critical bug needs engineering time. You...",
    ["Interrupt the sprint — critical bugs always take priority", "Assess severity and negotiate which sprint work can be deferred or parallelised", "Add it to the next sprint backlog"],
    1, "'Always interrupt' and 'never interrupt' are both wrong. Good PMs assess blast radius, weigh the cost of deferral, and present options — not mandates."),

  q("rq-ec1", "estimation challenge",
    "An estimate seems too high for a small feature. You...",
    ["Accept it — you don't have technical expertise to push back", "Ask if there's a simpler v1 that solves the core need in less time", "Challenge it publicly in standup to create accountability"],
    1, "The right move is scoping down, not pushing back on the estimate directly. Asking 'what if we only build the core need?' opens a collaborative negotiation."),

  q("rq-ec2", "estimation challenge",
    "Engineering says the current estimate is the minimum. You want to ship faster. You...",
    ["Push harder — engineers always pad estimates", "Ask which parts of scope could be reduced without losing core user value", "Hire contractors to compress the timeline"],
    1, "The fastest path to shipping isn't pressure — it's scope reduction. Find the v0.1 that delivers the core outcome and negotiate around that."),

  q("rq-dq1", "data quality instinct",
    "Your conversion rate dropped 3% after a release. First move?",
    ["Roll back the release", "Segment the drop by cohort, device, traffic source, and compare pre/post", "Declare a data incident and alert leadership"],
    1, "Rolling back assumes causation before diagnosis. Segment first — the drop may affect only one browser, one traffic source, or one user cohort."),

  q("rq-dq2", "data quality instinct",
    "A new dashboard shows 40% higher revenue than the old one. You...",
    ["Celebrate — the old dashboard was probably wrong", "Investigate what changed in the data pipeline or metric definition before acting", "Ignore it — the difference is probably noise"],
    1, "Unexplained improvements are as suspicious as unexplained drops. A 40% jump usually means a definition change, not a business miracle."),

  q("rq-bb1", "build vs buy",
    "You need search. Build takes 10 weeks; Algolia costs ₹8L/yr. You...",
    ["Always build in-house — control over search is too important to outsource", "Model the total cost of ownership for each option over 2 years", "Let engineering decide — it's fundamentally a technical call"],
    1, "Build vs buy is always a financial and strategic question, not a technical one. Model the 2-year TCO including engineer opportunity cost before making a call."),

  q("rq-bb2", "build vs buy",
    "Evaluating a third-party payments provider. Your main concern should be...",
    ["Does it have the features we need today?", "What's the lock-in risk and how does it perform at 10× our current volume?", "Is it the cheapest option available?"],
    1, "Today's features solve today's problems. The PM's job is to evaluate the decision at future scale — lock-in and scalability almost always cost more than they appeared upfront."),

  q("rq-ep1", "engineering partnership",
    "An engineer says your feature needs a major architectural change. You...",
    ["Postpone the feature indefinitely", "Ask for the breakdown — what's the core change and is there a simpler v1 path?", "Accept the estimate and update the roadmap"],
    1, "Major architectural constraints deserve investigation, not capitulation. Asking for a breakdown often surfaces a smaller path that unblocks the core user need this quarter."),

  q("rq-ep2", "engineering partnership",
    "You've just joined a new team. You want to build trust with engineering. You start by...",
    ["Demonstrating technical knowledge to establish credibility fast", "Asking how they prefer to receive specs and what slows them down most", "Requesting weekly status updates to stay aligned"],
    1, "Trust with engineering is built by removing friction, not by impressing them. Asking what slows them down shows you're there to serve the team, not manage it."),

  q("rq-cr1", "conflict resolution",
    "The eng lead disagrees with your top priority the night before the all-hands. You...",
    ["Hold firm — the roadmap is approved and it's too late to change", "Have a direct 1:1 tonight to understand the concern before the presentation", "Loop in the VP of Engineering immediately to pre-empt conflict"],
    1, "Holding firm ignores a potentially valid concern. Escalating overnight creates more conflict. A direct 1:1 surfaces the issue and resolves it without drama."),

  q("rq-cr2", "conflict resolution",
    "Two teams have conflicting requirements for your feature. You...",
    ["Let leadership decide — it's above your pay grade", "Map each team's underlying goals and find a path that serves both", "Delay the feature until consensus forms naturally"],
    1, "Escalating prematurely makes you a bottleneck, not a leader. Your job is to surface the underlying goals of each team and find the intersection before escalating."),

  q("rq-xc1", "executive communication",
    "The CFO says your infrastructure proposal 'sounds expensive.' You respond by...",
    ["Explaining the user experience improvements it unlocks", "Modelling the LTV impact against the cost, with a payback timeline", "Offering to reduce the scope to lower the cost upfront"],
    1, "CFOs speak in returns, not features. Reframe the cost as an investment with a specific payback period and confidence interval — that's the language that unlocks budget."),

  q("rq-xc2", "executive communication",
    "You need ₹40L for a feature. The exec wants a one-pager. You lead with...",
    ["The user pain point and the experience you want to create", "The expected business return, cost, and confidence interval", "Competitor benchmarks showing similar investments paid off"],
    1, "Executives approve investments, not features. Lead with the financial return — the user story is context, not the argument."),

  q("rq-fa1", "facilitation",
    "Two senior engineers disagree on architecture. You're the PM. You...",
    ["Stay out of it — this is their technical domain", "Ask both to evaluate their approach against a specific near-term user scenario", "Defer to the more senior engineer — seniority implies correctness"],
    1, "PMs don't own technical decisions, but they own the process of making them. Grounding the debate in a real user scenario gives both engineers a shared evaluation criterion."),

  q("rq-fa2", "facilitation",
    "A meeting is going in circles on a decision. You...",
    ["Let it run — everyone deserves to be heard", "Name the explicit tradeoff and set a specific decision deadline", "End the meeting and send a Slack poll"],
    1, "Circular discussions usually mean the tradeoff isn't clearly named. As PM, your job is to surface it explicitly and force a decision — not to keep the conversation comfortable."),

  q("rq-bf1", "business case framing",
    "You need buy-in for a costly feature. The CEO's first concern is budget. You...",
    ["Explain the feature's user experience benefits in detail", "Model the cost against the projected retention improvement and LTV impact", "Show competitor benchmarks for similar investments"],
    1, "User benefits don't move budget decisions — financial returns do. Model the LTV impact explicitly and present the cost as a ratio, not an absolute number."),

  q("rq-bf2", "business case framing",
    "You're presenting a ₹1Cr infrastructure investment. How do you open?",
    ["'Users are frustrated by slow load times and this will fix it'", "'This investment will recover ₹3Cr in retained revenue over 18 months'", "'Our engineering team strongly recommends this upgrade'"],
    1, "Lead with the return, not the problem. Framing the ask in recovery terms (₹3Cr saved vs ₹1Cr spent) positions the investment as a financial win, not a cost."),
];

// ─── Exported: flat resource array + getter ───────────────────────────────────

export function getResourcesBySubcategory(subcat: Subcategory): RoadmapResource[] {
  return allResources.filter((r) => r.subcategory === subcat);
}

// ─── Exported: reflection questions ──────────────────────────────────────────

export function getReflectionQuestions(
  completedSubcategories: Subcategory[],
  dayNumber: number
): ReflectionQuestion[] {
  const eligible = REFLECTION_QUESTIONS.filter((q) =>
    completedSubcategories.includes(q.subcategory)
  );
  if (eligible.length === 0) return [];

  // Rotate through available questions by dayNumber to avoid repetition
  const offset = (dayNumber - 1) % Math.max(1, eligible.length);
  const rotated = [...eligible.slice(offset), ...eligible.slice(0, offset)];
  return rotated.slice(0, Math.min(3, rotated.length));
}

// ─── generateDailyPlan ────────────────────────────────────────────────────────

export function generateDailyPlan(
  profile:    ScoreProfile,
  duration:   GoalDuration,
  dayNumber:  number
): DailyTask[] {
  const daysAvailable = GOAL_DAYS[duration];
  const maxPerDay     = MAX_PER_DAY[duration];

  // Filter gap map to canonical subcategories with red/amber status
  const relevantGaps = profile.gapMap
    .filter((e) => CANONICAL_SUBCATS.has(e.subcategory) && (e.status === "red" || e.status === "amber"))
    .sort((a, b) => a.score - b.score); // lowest score = biggest gap = first

  // Build flat ordered resource list
  const ordered: { resource: RoadmapResource; subcategory: Subcategory; status: "red" | "amber" | "green" }[] = [];
  for (const gap of relevantGaps) {
    const subcat = gap.subcategory as Subcategory;
    getResourcesBySubcategory(subcat).forEach((res) => {
      ordered.push({ resource: res, subcategory: subcat, status: gap.status });
    });
  }

  if (ordered.length === 0) return [];

  // Tasks per day (capped)
  const rawPerDay   = Math.ceil(ordered.length / daysAvailable);
  const tasksPerDay = Math.min(rawPerDay, maxPerDay);

  // Slice for this day
  const startIdx = (dayNumber - 1) * tasksPerDay;
  let dayTasks   = ordered.slice(startIdx, startIdx + tasksPerDay);

  // Wrap around if past end of plan
  if (dayTasks.length === 0) {
    const wrapIdx = ((dayNumber - 1) * tasksPerDay) % ordered.length;
    dayTasks      = ordered.slice(wrapIdx, wrapIdx + tasksPerDay);
  }

  // Weekday (Mon-Fri) = prefer bite-sized; weekend = no preference
  // Assume day 1 = Monday of week 1
  const dayOfWeek = ((dayNumber - 1) % 7) + 1; // 1=Mon … 7=Sun
  const isWeekend = dayOfWeek >= 6;
  if (!isWeekend) {
    dayTasks.sort((a, b) => {
      if (a.resource.biteSized && !b.resource.biteSized) return -1;
      if (!a.resource.biteSized && b.resource.biteSized) return 1;
      return 0;
    });
  }

  // Ensure no two consecutive videos
  for (let i = 1; i < dayTasks.length; i++) {
    if (dayTasks[i].resource.type === "video" && dayTasks[i - 1].resource.type === "video") {
      for (let j = i + 1; j < dayTasks.length; j++) {
        if (dayTasks[j].resource.type !== "video") {
          [dayTasks[i], dayTasks[j]] = [dayTasks[j], dayTasks[i]];
          break;
        }
      }
    }
  }

  return dayTasks.map(({ resource, subcategory, status }) => ({
    resource,
    subcategory,
    status,
    whyThis: WHY_THIS[subcategory],
  }));
}

// ─── generateWeeklyPlan ───────────────────────────────────────────────────────

export function generateWeeklyPlan(
  profile:  ScoreProfile,
  duration: GoalDuration
): WeekPlan[] {
  const daysTotal = GOAL_DAYS[duration];
  const weekCount = Math.ceil(daysTotal / 7);
  const plans: WeekPlan[] = [];

  for (let w = 0; w < weekCount; w++) {
    const days: { dayNumber: number; tasks: DailyTask[] }[] = [];
    const subcatCount: Partial<Record<Subcategory, number>> = {};

    for (let d = 1; d <= 7; d++) {
      const dayNum = w * 7 + d;
      if (dayNum > daysTotal) break;
      const tasks = generateDailyPlan(profile, duration, dayNum);
      days.push({ dayNumber: dayNum, tasks });
      tasks.forEach((t) => {
        subcatCount[t.subcategory] = (subcatCount[t.subcategory] ?? 0) + 1;
      });
    }

    // Primary subcat = most frequent this week
    let primarySubcat: Subcategory = "problem framing";
    let maxCount = 0;
    for (const [sc, count] of Object.entries(subcatCount) as [Subcategory, number][]) {
      if (count > maxCount) { maxCount = count; primarySubcat = sc; }
    }

    const primaryDim = SUBCAT_TO_DIM[primarySubcat];
    const weekLabel  = w === 0 ? "Foundation" : w < 4 ? "Build" : w < 8 ? "Deepen" : "Reinforce";

    plans.push({
      weekNumber:       w + 1,
      title:            `${weekLabel}: ${primarySubcat}`,
      primaryDimension: primaryDim,
      days,
    });
  }

  return plans;
}

// ─── Legacy export (used by lib/roadmap-engine.ts) ────────────────────────────

export const roadmapContent: Record<ArchetypeKey, RoadmapContent> = {
  builder: {
    archetype: "builder",
    weeks: [
      { week: 1, theme: "Strategic Narrative", objectives: ["Frame technical decisions in business terms", "Write a one-page product strategy doc for a product you use daily"], resources: [{ type: "article", title: "Shreyas Doshi on Thinking in Bets vs Thinking in Outcomes", url: "https://twitter.com/shreyas/status/1370824336745197568" }, { type: "video", title: "Good Strategy Bad Strategy — Summary", url: "https://www.youtube.com/watch?v=Pj0cME8Drpc" }] },
      { week: 2, theme: "Stakeholder Communication", objectives: ["Write a crisp 1-page memo (Amazon-style) for a technical initiative", "Present a build vs buy decision to a non-technical audience"], resources: [{ type: "article", title: "Amazon's 6-Pager Memo Format Explained", url: "https://www.productplan.com/glossary/amazon-6-pager/" }] },
      { week: 3, theme: "Product Sense", objectives: ["Run 5 user interviews using the Jobs-to-be-Done framework", "Complete a PM interview teardown for a product you want to work on"], resources: [{ type: "video", title: "JTBD Interviews with Bob Moesta", url: "https://www.youtube.com/watch?v=sfGtd2UXidU" }] },
      { week: 4, theme: "PM Interview Prep", objectives: ["Complete 10 mock product design questions", "Record a 5-minute walkthrough of a product you'd improve"], resources: [{ type: "article", title: "Exponent PM Interview Question Bank", url: "https://www.tryexponent.com/practice/product-manager" }] },
    ],
  },
  strategist: {
    archetype: "strategist",
    weeks: [
      { week: 1, theme: "From Strategy to Spec", objectives: ["Write a full PRD for a feature you'd add to Swiggy or CRED", "Include success metrics, edge cases, and rollout plan"], resources: [{ type: "article", title: "How to Write a Great PRD — Gibson Biddle", url: "https://gibsonbiddle.medium.com/how-to-write-a-good-prd-product-requirements-document-6b07c15c1d8f" }] },
      { week: 2, theme: "Technical Fluency", objectives: ["Learn the basics of API design and when to use REST vs GraphQL", "Shadow an engineering standup and write a summary"], resources: [{ type: "video", title: "APIs for Non-Engineers", url: "https://www.youtube.com/watch?v=ByGJQzlzxQg" }] },
      { week: 3, theme: "Metric Mastery", objectives: ["Define a North Star metric for 3 different product types", "Build a simple cohort analysis in a spreadsheet"], resources: [{ type: "article", title: "Lenny's North Star Metric Framework", url: "https://www.lennysnewsletter.com/p/north-star-metric" }] },
      { week: 4, theme: "PM Interview Prep", objectives: ["Practice estimation questions (DAU to revenue)", "Complete a full mock strategy case"], resources: [{ type: "video", title: "How to Answer PM Strategy Questions", url: "https://www.youtube.com/watch?v=0bF7oX39N4A" }] },
    ],
  },
  advocate: {
    archetype: "advocate",
    weeks: [
      { week: 1, theme: "Business Case Building", objectives: ["Learn to model LTV and CAC for a consumer product", "Write a business case for a feature you'd add to a product you love"], resources: [{ type: "article", title: "Unit Economics for PMs — Reforge", url: "https://www.reforge.com/blog/unit-economics" }] },
      { week: 2, theme: "Data-Driven Product Thinking", objectives: ["Learn funnel analysis — map the drop-off points in an app you use", "Write a hypothesis and define what would prove/disprove it"], resources: [{ type: "video", title: "Product Analytics Deep Dive — Mixpanel", url: "https://www.youtube.com/watch?v=vhekbT7JWRM" }] },
      { week: 3, theme: "Roadmap Prioritisation", objectives: ["Build a prioritisation matrix for 10 features using RICE scoring", "Write a 1-page roadmap brief for a 6-month horizon"], resources: [{ type: "article", title: "RICE Scoring Model Explained", url: "https://www.productplan.com/glossary/rice-scoring-model/" }] },
      { week: 4, theme: "PM Interview Prep", objectives: ["Complete 5 product design and 5 metrics mock questions", "Prepare your 'why PM from design' narrative"], resources: [{ type: "article", title: "From Designer to PM — Jackie Bavaro", url: "https://www.producthunt.com/stories/from-designer-to-product-manager" }] },
    ],
  },
  operator: {
    archetype: "operator",
    weeks: [
      { week: 1, theme: "Product Vision", objectives: ["Write a 3-year product vision for a product in your target domain", "Map the competitive landscape and identify your differentiation"], resources: [{ type: "article", title: "How to Write a Compelling Product Vision", url: "https://www.svpg.com/the-product-vision/" }] },
      { week: 2, theme: "User Empathy", objectives: ["Run 5 user interviews using contextual inquiry", "Build a journey map for a product you want to PM"], resources: [{ type: "video", title: "User Interview Masterclass", url: "https://www.youtube.com/watch?v=Qq3OiHQ-HCU" }] },
      { week: 3, theme: "Technical Depth", objectives: ["Read about database design basics and explain CAP theorem in plain English", "Write a technical spec for a simple API"], resources: [{ type: "article", title: "System Design for PMs", url: "https://medium.com/geekculture/system-design-for-product-managers-6f8b6c9c0e7f" }] },
      { week: 4, theme: "PM Interview Prep", objectives: ["Practice 5 execution and 5 estimation mock questions", "Prepare your operations-to-PM transition story"], resources: [{ type: "video", title: "PM Execution Interview Framework", url: "https://www.youtube.com/watch?v=9BLh_q77CRk" }] },
    ],
  },
  explorer: {
    archetype: "explorer",
    weeks: [
      { week: 1, theme: "Execution Rigour", objectives: ["Write a launch checklist for a product you'd build", "Define a go-to-market plan for a new feature"], resources: [{ type: "article", title: "Product Launch Checklist — Lenny Rachitsky", url: "https://www.lennysnewsletter.com/p/product-launch" }] },
      { week: 2, theme: "Metrics & Accountability", objectives: ["Build a dashboard spec for a product you'd launch", "Write a post-mortem for a launch that 'failed'"], resources: [{ type: "article", title: "Writing Good Post-Mortems", url: "https://sre.google/sre-book/postmortem-culture/" }] },
      { week: 3, theme: "Stakeholder Alignment", objectives: ["Draft a roadmap presentation for a sceptical executive", "Practice pushback scenarios with a mock engineering lead"], resources: [{ type: "video", title: "How to Influence Without Authority", url: "https://www.youtube.com/watch?v=V97Iy_XR0KA" }] },
      { week: 4, theme: "PM Interview Prep", objectives: ["Practice 5 product strategy and 5 product design mock questions", "Prepare a 0→1 case study from your career"], resources: [{ type: "video", title: "0-to-1 PM Interview Questions", url: "https://www.youtube.com/watch?v=qDVNEBZN5Ow" }] },
    ],
  },
};
