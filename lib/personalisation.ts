import type { ArchetypeKey, Dimension } from "@/types";

// ─── Background → Strength Profile ───────────────────────────────────────────

export type Background =
  | "engineering"
  | "consulting"
  | "design"
  | "data"
  | "bizanalysis"
  | "finance"
  | "marketing"
  | "product"
  | "project"
  | "entrepreneurship"
  | "other";

export interface BackgroundProfile {
  label: string;
  naturalStrengths: Dimension[];
  likelyGaps: Dimension[];
  archetypeAffinity: ArchetypeKey[];
  entryMessage: string;
}

export const backgroundProfiles: Record<Background, BackgroundProfile> = {
  engineering: {
    label: "Software Engineer",
    naturalStrengths: ["technical-fluency", "execution-depth"],
    likelyGaps: ["strategic-thinking", "communication"],
    archetypeAffinity: ["builder", "explorer"],
    entryMessage:
      "Your technical depth is a real asset. The assessment will help you see where strategic thinking and stakeholder communication need development.",
  },
  consulting: {
    label: "Strategy Consultant",
    naturalStrengths: ["strategic-thinking", "communication"],
    likelyGaps: ["technical-fluency", "execution-depth"],
    archetypeAffinity: ["strategist", "operator"],
    entryMessage:
      "You think in frameworks. The assessment will reveal whether you can translate strategy into shipping — the gap most consultants hit.",
  },
  design: {
    label: "UX / Product Designer",
    naturalStrengths: ["product-sense", "communication"],
    likelyGaps: ["strategic-thinking", "technical-fluency"],
    archetypeAffinity: ["advocate", "explorer"],
    entryMessage:
      "Your user empathy is a genuine PM superpower. The assessment will test your ability to make hard tradeoffs when business and user needs conflict.",
  },
  data: {
    label: "Data & Analytics",
    naturalStrengths: ["technical-fluency", "strategic-thinking"],
    likelyGaps: ["product-sense", "communication"],
    archetypeAffinity: ["explorer", "builder"],
    entryMessage:
      "You find signal in noise better than most PMs ever will. The assessment will surface whether you can turn data into decisions — not just dashboards.",
  },
  bizanalysis: {
    label: "Business Analyst",
    naturalStrengths: ["execution-depth", "strategic-thinking"],
    likelyGaps: ["product-sense", "technical-fluency"],
    archetypeAffinity: ["operator", "strategist"],
    entryMessage:
      "You already speak the language of requirements and stakeholders. The assessment will test whether you can lead a product vision, not just document one.",
  },
  finance: {
    label: "Finance & Ops",
    naturalStrengths: ["strategic-thinking", "execution-depth"],
    likelyGaps: ["product-sense", "technical-fluency"],
    archetypeAffinity: ["strategist", "operator"],
    entryMessage:
      "You know how to read a business. The assessment will surface whether you can translate numbers into product intuition.",
  },
  marketing: {
    label: "Sales & Marketing",
    naturalStrengths: ["communication", "product-sense"],
    likelyGaps: ["technical-fluency", "execution-depth"],
    archetypeAffinity: ["advocate", "strategist"],
    entryMessage:
      "You understand users through data. The assessment will reveal whether your product instinct goes deep enough to drive roadmap decisions.",
  },
  product: {
    label: "Product Management",
    naturalStrengths: ["product-sense", "strategic-thinking"],
    likelyGaps: [],
    archetypeAffinity: ["strategist", "builder"],
    entryMessage:
      "You have the vocabulary. The assessment will show whether your instincts hold up under structured diagnostic pressure.",
  },
  project: {
    label: "Project Management",
    naturalStrengths: ["execution-depth", "communication"],
    likelyGaps: ["product-sense", "strategic-thinking"],
    archetypeAffinity: ["operator", "builder"],
    entryMessage:
      "You deliver. The assessment will reveal whether you can own the 'what' and 'why', not just the 'how' and 'when'.",
  },
  entrepreneurship: {
    label: "Entrepreneur / Founder",
    naturalStrengths: ["strategic-thinking", "product-sense"],
    likelyGaps: ["execution-depth", "communication"],
    archetypeAffinity: ["explorer", "builder"],
    entryMessage:
      "You've shipped in the real world. The assessment will test whether that experience maps to the structured craft of PM at a scaled company.",
  },
  other: {
    label: "Other Background",
    naturalStrengths: [],
    likelyGaps: [],
    archetypeAffinity: ["strategist"],
    entryMessage:
      "Every background brings something to PM. The assessment will map exactly what you bring — and what you need to develop.",
  },
};

// ─── Background × Industry Insight Matrix ────────────────────────────────────
// Lookup order: exact (background + industry) → wildcard (background + "*") → fallback

export interface InsightEntry {
  background: string; // Background key or "*"
  industry: string;   // industry key or "*"
  headline: string;
  body: string;
  translatedStrength: string;
}

export const insightMatrix: InsightEntry[] = [
  // ── Consulting ──────────────────────────────────────────────────────────────
  {
    background: "consulting",
    industry: "fintech",
    headline: "You're walking into one of the highest-signal PM markets in India — with the right background.",
    body: "Fintech PMs who came from consulting are some of the most effective operators in the space. Razorpay, PhonePe, and CRED all run products that need exactly what you've built: structuring ambiguous problems, building cases for complex decisions, and managing senior stakeholders without losing the thread.",
    translatedStrength: "What you called a 'recommendation deck' in consulting is exactly what PMs call a 'product strategy doc.' The skill is identical — the audience just ships software.",
  },
  {
    background: "consulting",
    industry: "saas",
    headline: "Your consulting background already gives you one of the hardest PM skills to teach.",
    body: "Stakeholder alignment, structured problem-framing, communicating under ambiguity — these are senior PM skills. Most career-switchers spend months building what you already have. B2B SaaS PMs live inside enterprise complexity. You've been doing that for years.",
    translatedStrength: "What you called 'engagement delivery' in consulting is what PMs call 'shipping a roadmap.' The discipline of managing scope, stakeholders, and outcomes transfers directly.",
  },
  {
    background: "consulting",
    industry: "*",
    headline: "Your consulting background already gives you one of the hardest PM skills to teach.",
    body: "Stakeholder alignment, structured problem-framing, communicating under ambiguity — these are senior PM skills that take most PMs years to develop. You've been doing this professionally. The gap to close is on the execution side: shipping iteratively, owning outcomes post-launch, and building technical fluency with your team.",
    translatedStrength: "What you called 'recommendations' in consulting is exactly what PMs call 'product strategy.' The skill is the same — the format just changes.",
  },

  // ── Engineering ─────────────────────────────────────────────────────────────
  {
    background: "engineering",
    industry: "fintech",
    headline: "Fintech PMs with an engineering background are in high demand right now.",
    body: "Payments, lending, and compliance infrastructure are deeply technical product spaces. Companies like Razorpay, Setu, and BharatPe need PMs who can hold a technical conversation about APIs, latency, and failure modes — not just wireframe features. You have a real head start.",
    translatedStrength: "The system-design thinking you used to build software is the exact same thinking PMs use to architect product solutions. You just need to reframe it toward user outcomes.",
  },
  {
    background: "engineering",
    industry: "saas",
    headline: "SaaS PM is one of the highest-leverage transitions for an engineer.",
    body: "Enterprise SaaS products live or die on how well the PM understands the developer or ops persona. Your ability to reason about APIs, integrations, and technical debt gives you a credibility advantage in rooms where most PMs are treated as outsiders.",
    translatedStrength: "What engineers call 'writing clean interfaces' is what PMs call 'designing good user experiences.' The principle — reduce friction, respect the user's mental model — is the same.",
  },
  {
    background: "engineering",
    industry: "*",
    headline: "Your engineering background is one of the most valued foundations for PM — if you know how to use it.",
    body: "The risk for engineers moving into PM isn't skill — it's framing. You need to stop showing up as a senior IC and start showing up as the person accountable for the outcome, not the implementation. The assessment will reveal where your thinking is already PM-level and where you're still defaulting to engineering instincts.",
    translatedStrength: "What you called 'scoping a ticket' is what PMs call 'writing a spec.' What you called 'debugging' is what PMs call 'root cause analysis.' You already do the work — now lead it.",
  },

  // ── Design ──────────────────────────────────────────────────────────────────
  {
    background: "design",
    industry: "consumer-tech",
    headline: "Consumer product needs exactly what you've been building — the gap is smaller than you think.",
    body: "The best consumer PMs at Swiggy, CRED, and Zomato think like designers: obsessing over the moment of friction, sweating the copy, and advocating for the user in a room full of engineers and data scientists. Your instinct is the rarest thing in most PM teams.",
    translatedStrength: "What you called 'interaction design' is what PMs call 'product thinking.' The difference is that PMs also own the why behind the what — and that's a learnable expansion of your current skill.",
  },
  {
    background: "design",
    industry: "*",
    headline: "User empathy is the one PM skill that can't be taught from a book — you already have it.",
    body: "Most career-switchers spend months learning to see through the user's eyes. You've been doing it professionally. The assessment will test whether you can pair that empathy with hard prioritisation decisions — what to build when you can't build everything.",
    translatedStrength: "What you called 'user flows' in design are what PMs call 'user journeys.' What you called 'heuristic evaluation' is what PMs call 'product review.' The vocabulary shifts; the thinking doesn't.",
  },

  // ── Data ────────────────────────────────────────────────────────────────────
  {
    background: "data",
    industry: "fintech",
    headline: "Data + Fintech is one of the highest-value PM profiles in the Indian market right now.",
    body: "Risk, credit, fraud, and growth at every major fintech company is now a data product problem. PMs who can speak fluently about model performance, feature engineering, and data pipelines — and translate that to a business decision — are genuinely rare. You're positioned better than you probably know.",
    translatedStrength: "What you called 'metric definition' is exactly what PMs call 'success metrics.' What you called 'A/B test design' is what PMs call 'experiment design.' The craft is the same.",
  },
  {
    background: "data",
    industry: "*",
    headline: "Data fluency is one of the highest-leverage PM skills — and you already have it.",
    body: "Most PMs learn to talk about metrics without ever really understanding them. You understand the numbers from first principles. The assessment will surface whether you can convert that analytical fluency into product decisions and stakeholder communication — the translation layer where data analysts often get stuck.",
    translatedStrength: "What you called 'analysis' is what PMs call 'insight generation.' The difference is that PMs need to end on a recommendation, not a chart.",
  },

  // ── Business Analysis ───────────────────────────────────────────────────────
  {
    background: "bizanalysis",
    industry: "saas",
    headline: "B2B SaaS PM is arguably the most natural home for a business analyst.",
    body: "The BA-to-PM path in SaaS is well-worn for a reason. You already know how to elicit requirements, manage stakeholders, and map business processes to system design. The expansion is owning the product vision, not just capturing it — and being the one who decides what gets built, not just documents it.",
    translatedStrength: "What you called 'requirements gathering' is the first half of what PMs call 'product discovery.' You now need to own the second half: deciding what's worth building.",
  },
  {
    background: "bizanalysis",
    industry: "*",
    headline: "You already do half the PM job. The question is whether you can own the other half.",
    body: "Business analysts are frequently the most prepared career-switchers in a PM cohort. You understand systems, you speak to stakeholders, and you can translate business needs into product logic. The gap is decisiveness: PMs are ultimately accountable for the decision, not the documentation.",
    translatedStrength: "What you called 'functional specs' are what PMs call 'PRDs.' What you called 'sign-off meetings' are what PMs call 'roadmap reviews.' You've been sitting in the right room — now you need to lead it.",
  },

  // ── Finance ──────────────────────────────────────────────────────────────────
  {
    background: "finance",
    industry: "fintech",
    headline: "Finance background + Fintech domain = an unusually strong PM foundation.",
    body: "You understand the business model, the regulatory constraints, and the unit economics better than almost anyone transitioning into PM. The risk isn't knowledge — it's learning to think in user flows instead of financial models. Companies like Groww, Zepto, and Slice are actively hiring PMs who can bridge this gap.",
    translatedStrength: "What you called 'unit economics modelling' is exactly what PMs call 'business case framing.' You already know how to quantify the value of a decision.",
  },
  {
    background: "finance",
    industry: "*",
    headline: "Your financial rigour is a genuine PM superpower — almost no one else in the room has it.",
    body: "PMs are often the weakest voice in the room when it comes to business modelling. You're the opposite. The assessment will surface whether you can layer product intuition and user empathy on top of that foundation — the combination that makes a truly exceptional PM.",
    translatedStrength: "What you called 'variance analysis' is what PMs call 'post-launch measurement.' What you called 'scenario planning' is what PMs call 'roadmap prioritisation.' The analytical muscle transfers directly.",
  },

  // ── Marketing ───────────────────────────────────────────────────────────────
  {
    background: "marketing",
    industry: "ecommerce",
    headline: "E-commerce PM is one of the strongest domain fits for a marketing background.",
    body: "Growth, acquisition, retention, conversion — these are both marketing and product problems. PMs at Meesho, Flipkart, and Nykaa live at this intersection. Your ability to think about user behaviour through a commercial lens is rare in PM teams dominated by engineers and analysts.",
    translatedStrength: "What you called 'campaign optimisation' is what PMs call 'growth experimentation.' What you called 'user segmentation' is what PMs call 'persona definition.' The framing changes; the skill doesn't.",
  },
  {
    background: "marketing",
    industry: "consumer-tech",
    headline: "Consumer PM is built on the exact muscle you've been developing.",
    body: "Consumer products need PMs who understand acquisition funnels, retention psychology, and brand voice — not just feature specs. You've been working at the edge of product for years. The assessment will show how close you already are to the PM role you're targeting.",
    translatedStrength: "What you called 'go-to-market strategy' is the first chapter of what PMs call 'launch planning.' You've been running the part most PMs outsource.",
  },
  {
    background: "marketing",
    industry: "*",
    headline: "Your marketing instincts give you something most PMs spend years trying to develop.",
    body: "Understanding user motivation, positioning a product, and communicating value — these are the soft skills that separate good PMs from great ones. Most engineering-background PMs underinvest here. You start with a real edge. The gap to close is technical fluency and execution rigour.",
    translatedStrength: "What you called 'customer insights' are what PMs call 'user research.' What you called 'funnel analysis' is what PMs call 'activation and retention metrics.' You're already doing PM work.",
  },

  // ── Project Management ───────────────────────────────────────────────────────
  {
    background: "project",
    industry: "*",
    headline: "You know how to get things done. The question is whether you know what's worth doing.",
    body: "Project managers often make excellent PMs — but the transition requires a fundamental shift in accountability. PMs don't just deliver the plan. They own the outcome. The assessment will surface whether your instinct is to optimise execution or to define direction. The latter is what you need to demonstrate.",
    translatedStrength: "What you called 'scope management' is what PMs call 'roadmap control.' What you called 'stakeholder updates' are what PMs call 'alignment communication.' The work is familiar — the ownership is new.",
  },

  // ── Entrepreneurship ─────────────────────────────────────────────────────────
  {
    background: "entrepreneurship",
    industry: "*",
    headline: "You've already done the hardest version of PM — without the safety net.",
    body: "Founders who move into PM are often the most compelling candidates in any hiring process. You've done customer discovery, made prioritisation calls with no playbook, and shipped under uncertainty. The challenge is recalibrating: at a company, you're collaborating on a product you don't own — and that requires a different kind of influence.",
    translatedStrength: "What you called 'product-market fit discovery' is exactly what PMs call 'strategic vision and user research combined.' You've lived the full PM loop. Now formalise it.",
  },

  // ── Product (already in PM) ──────────────────────────────────────────────────
  {
    background: "product",
    industry: "*",
    headline: "You have the title. The assessment will tell you whether your instincts match the craft.",
    body: "PMs assessing themselves are often the most surprised by the results. The structured diagnostic approach surfaces gaps that day-to-day work masks — particularly in dimensions like strategic framing and execution rigour where 'getting things done' can hide shallow thinking. The assessment will give you a calibrated signal.",
    translatedStrength: "You already have the vocabulary. The assessment tests whether the instincts underneath the vocabulary are strong — the part that separates good PMs from exceptional ones.",
  },

  // ── Universal fallback ───────────────────────────────────────────────────────
  {
    background: "*",
    industry: "*",
    headline: "Your background has more PM relevance than you probably realise.",
    body: "Every professional background transfers to PM in specific ways. The diagnostic will map your existing strengths to the five PM dimensions and show you exactly where you're already equipped — and what to close before your first PM interview.",
    translatedStrength: "The skills you've built professionally are the foundation. PM is about applying them to product decisions — and that translation is learnable.",
  },
];

// ─── Lookup function ──────────────────────────────────────────────────────────

export function getInsight(background: string, industry: string): InsightEntry {
  // 1. Exact match
  const exact = insightMatrix.find(
    (e) => e.background === background && e.industry === industry
  );
  if (exact) return exact;

  // 2. Background wildcard on industry
  const bgMatch = insightMatrix.find(
    (e) => e.background === background && e.industry === "*"
  );
  if (bgMatch) return bgMatch;

  // 3. Universal fallback
  return insightMatrix.find((e) => e.background === "*" && e.industry === "*")!;
}

// ─── Experience framing ───────────────────────────────────────────────────────

export function getExperienceFrame(experience: string): string {
  switch (experience) {
    case "0-2":
      return "With 0–2 years of experience, you're in the best position to shape your PM career from the start — no habits to unlearn.";
    case "3-5":
      return "With 3–5 years of experience, you have enough depth to be taken seriously and enough flexibility to redirect.";
    case "6-10":
      return "With 6–10 years of experience, you're bringing real seniority. The diagnostic will show how much of that maps directly to PM impact.";
    case "10+":
      return "With 10+ years of experience, you're not entry-level anything. The question is targeting: which PM role matches your actual level?";
    default:
      return "Your experience level gives you a foundation to build from.";
  }
}

// ─── Exported helpers (kept for backwards compat) ─────────────────────────────

export function getPersonalisedIntroMessage(background: Background): string {
  return backgroundProfiles[background]?.entryMessage ?? backgroundProfiles.other.entryMessage;
}

export function getBackgroundProfile(background: string): BackgroundProfile {
  return (
    backgroundProfiles[background as Background] ?? backgroundProfiles.other
  );
}
