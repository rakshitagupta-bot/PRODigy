import type { Archetype, ArchetypeKey } from "@/types";

export const archetypes: Record<ArchetypeKey, Archetype> = {
  builder: {
    key: "builder",
    name: "The Builder",
    tagline: "You ship systems, not just features.",
    description:
      "You think in architectures. You're most effective when there's ambiguity in the problem space and you need to design from first principles. Engineers trust you because you understand their world. You thrive at technical product companies, developer platforms, and infrastructure-heavy products.",
    icon: "⚙️",
    strengths: [
      "System Architecture",
      "Technical Trade-offs",
      "Build vs Buy",
      "API Strategy",
    ],
    watchOuts: [
      "Can over-engineer simple problems",
      "May underweight the 'why' vs the 'how'",
    ],
    targetCompanies: ["Razorpay", "Zepto", "Postman", "Setu", "CRED"],
    targetRoles: ["Platform PM", "API/Developer PM", "0→1 PM"],
    color: "#4A6CF7",
  },
  strategist: {
    key: "strategist",
    name: "The Strategist",
    tagline: "You see the market before the market does.",
    description:
      "You connect dots across the business, the competition, and the user. You're most valuable when companies need to find the next growth lever or decide what NOT to build. You speak the language of business leaders and can translate market insight into a product roadmap.",
    icon: "🎯",
    strengths: [
      "Market Positioning",
      "Competitive Moats",
      "Prioritisation Frameworks",
      "Business Modelling",
    ],
    watchOuts: [
      "Execution detail can feel tedious",
      "Risk of paralysis in strategy without bias to action",
    ],
    targetCompanies: ["Flipkart", "Meesho", "PhonePe", "Zepto", "Groww"],
    targetRoles: ["Growth PM", "Consumer PM", "0→1 PM"],
    color: "#8B5CF6",
  },
  advocate: {
    key: "advocate",
    name: "The Advocate",
    tagline: "You build what people actually need.",
    description:
      "You have an unusually deep instinct for user needs. You translate human insight into product decisions with precision. You're most valuable when a product needs to move from feature-complete to genuinely loved — or when it's targeting a segment that's traditionally been underserved.",
    icon: "💬",
    strengths: [
      "User Research",
      "UX Craft",
      "Persona Development",
      "Empathy-Driven Decisions",
    ],
    watchOuts: [
      "Can over-index on user requests vs user needs",
      "Business case may need strengthening",
    ],
    targetCompanies: ["CRED", "Zepto", "Zomato", "Nykaa", "Swiggy"],
    targetRoles: ["Consumer PM", "Growth PM", "Data PM"],
    color: "#EC4899",
  },
  operator: {
    key: "operator",
    name: "The Operator",
    tagline: "You turn chaos into a repeatable machine.",
    description:
      "You are the PM who makes things actually happen. Processes, metrics, OKRs, cross-functional alignment — you excel at the unsexy work of making a product org function well. You're most valuable at scaling companies where execution bottlenecks are the real constraint.",
    icon: "📊",
    strengths: [
      "Process Design",
      "Metrics Frameworks",
      "Cross-Functional Alignment",
      "Launch Excellence",
    ],
    watchOuts: [
      "May under-invest in vision and strategy",
      "Risk of optimising the wrong system",
    ],
    targetCompanies: ["Swiggy", "Zomato", "Ola", "Urban Company", "BigBasket"],
    targetRoles: ["Enterprise PM", "Growth PM"],
    color: "#F59E0B",
  },
  explorer: {
    key: "explorer",
    name: "The Explorer",
    tagline: "You find the opportunities no one else is looking at.",
    description:
      "You're at your best at the edges — exploring new spaces, testing hypotheses, and finding signals in noise. You're a natural 0→1 PM who can validate a new product domain before a company commits resources. You thrive with ambiguity and have a high tolerance for failure.",
    icon: "🔭",
    strengths: [
      "Zero-to-One Thinking",
      "Hypothesis Testing",
      "Market Expansion",
      "Ambiguity Tolerance",
    ],
    watchOuts: [
      "May lose interest once product reaches scale",
      "Needs strong execution partners",
    ],
    targetCompanies: ["Razorpay", "BrowserStack", "Setu", "Fi Money", "Jar"],
    targetRoles: ["0→1 PM", "Growth PM", "Data PM"],
    color: "#10B981",
  },
};

// ─── Assignment Logic (accepts scoring output directly) ───────────────────────

export function assignArchetype(key: ArchetypeKey): ArchetypeKey {
  return key; // scoring.ts now owns the assignment logic; this is a passthrough
}

export function getArchetype(key: ArchetypeKey): Archetype {
  return archetypes[key];
}
