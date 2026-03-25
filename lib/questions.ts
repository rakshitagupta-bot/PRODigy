import type { AssessmentQuestion } from "@/types";

export const questions: AssessmentQuestion[] = [
  // ── THINKING & STRATEGY (Q1–Q4) ──────────────────────────────────────────

  {
    id: "q1",
    dimension: "thinking_strategy",
    subcategories: ["problem framing", "growth strategy", "diagnosis before action"],
    tier: 1,
    stem: "Your fintech startup's core payment product has plateaued at 2M MAU for six months. The CEO wants 3× growth in 12 months and is expecting your roadmap next week. What is your first move?",
    options: [
      {
        label: "A",
        text: "Launch a referral programme immediately — growth loops are the fastest lever available.",
        points: 1,
        subcatScores: { "growth strategy": 1, "diagnosis before action": 0 },
      },
      {
        label: "B",
        text: "Audit the full user journey — activation, engagement, and retention — to find where value is leaking before committing to a growth strategy.",
        points: 4,
        subcatScores: { "problem framing": 4, "diagnosis before action": 4 },
      },
      {
        label: "C",
        text: "Benchmark against competitors and identify which features are missing from our product.",
        points: 2,
        subcatScores: { "problem framing": 2, "growth strategy": 1 },
      },
      {
        label: "D",
        text: "Run 20 user interviews this week to understand why they use us versus alternatives.",
        points: 3,
        subcatScores: { "diagnosis before action": 3, "problem framing": 2 },
      },
    ],
  },

  {
    id: "q2",
    dimension: "thinking_strategy",
    subcategories: ["strategic tradeoffs", "stakeholder framing", "business model thinking"],
    tier: 2,
    stem: "You're PM at a B2B SaaS company. Enterprise clients (₹1 Cr+ ARR each) want deep customisation. SMB clients (high volume, low ACV) want a simple, fast product. Engineering says they can't sustainably build for both segments. How do you frame this decision for leadership?",
    options: [
      {
        label: "A",
        text: "Present the revenue math: enterprise upside vs SMB churn risk, with a clear recommendation and sensitivity analysis.",
        points: 4,
        subcatScores: { "strategic tradeoffs": 4, "stakeholder framing": 4, "business model thinking": 4 },
      },
      {
        label: "B",
        text: "Propose splitting into two product lines — enterprise and SMB — with separate roadmaps and teams.",
        points: 3,
        subcatScores: { "strategic tradeoffs": 3, "business model thinking": 2 },
      },
      {
        label: "C",
        text: "Ask engineering to scope a modular architecture that could eventually serve both segments.",
        points: 2,
        subcatScores: { "strategic tradeoffs": 1, "business model thinking": 2 },
      },
      {
        label: "D",
        text: "Let sales decide — they're closest to the customers and know which segment generates more revenue.",
        points: 0,
        subcatScores: { "stakeholder framing": 0, "strategic tradeoffs": 0 },
      },
    ],
  },

  {
    id: "q3",
    dimension: "thinking_strategy",
    subcategories: ["root cause analysis", "data-driven diagnosis", "crisis prioritisation"],
    tier: 2,
    stem: "Your e-commerce app's checkout completion rate drops 12% overnight. No deployments happened. You have the first 30 minutes. What do you do?",
    options: [
      {
        label: "A",
        text: "Alert engineering to check for any infra changes or third-party service issues in the last 24 hours.",
        points: 2,
        subcatScores: { "root cause analysis": 2, "crisis prioritisation": 2 },
      },
      {
        label: "B",
        text: "Segment the drop immediately: is it on a specific device type, geography, payment method, or user cohort? Isolate before escalating.",
        points: 4,
        subcatScores: { "data-driven diagnosis": 4, "root cause analysis": 4, "crisis prioritisation": 3 },
      },
      {
        label: "C",
        text: "Message customer support to check if complaint volume has spiked and flag it to the team.",
        points: 1,
        subcatScores: { "crisis prioritisation": 1, "root cause analysis": 1 },
      },
      {
        label: "D",
        text: "Launch an A/B test on the checkout flow to identify the friction point causing the drop.",
        points: 0,
        subcatScores: { "root cause analysis": 0, "data-driven diagnosis": 0 },
      },
    ],
  },

  {
    id: "q4",
    dimension: "thinking_strategy",
    subcategories: ["prioritisation", "business value assessment", "opportunity cost thinking"],
    tier: 1,
    stem: "You have three features competing for next quarter: a social sharing layer (high user delight, unclear revenue), an analytics dashboard for power users (moderate usage, clear upsell path), and payment retry logic (low visibility, saves ~8% failed transactions). How do you prioritise?",
    options: [
      {
        label: "A",
        text: "Social sharing — delight drives virality and organic brand growth, which has compounding long-term value.",
        points: 1,
        subcatScores: { "business value assessment": 1, "prioritisation": 1 },
      },
      {
        label: "B",
        text: "Payment retry — the revenue impact is the clearest and most immediate. It's likely underweighted because it's unglamorous.",
        points: 4,
        subcatScores: { "prioritisation": 4, "business value assessment": 4, "opportunity cost thinking": 4 },
      },
      {
        label: "C",
        text: "Analytics dashboard — it has the strongest business case because the upsell path is already defined.",
        points: 3,
        subcatScores: { "business value assessment": 3, "prioritisation": 3 },
      },
      {
        label: "D",
        text: "Run a scoring matrix with the full team across impact, effort, and confidence before deciding.",
        points: 2,
        subcatScores: { "prioritisation": 2, "opportunity cost thinking": 2 },
      },
    ],
  },

  // ── USER RESEARCH & PRODUCT SENSE (Q5–Q7) ────────────────────────────────

  {
    id: "q5",
    dimension: "user_research",
    subcategories: ["onboarding design", "value-before-ask", "user psychology"],
    tier: 1,
    stem: "You're designing a new onboarding flow for a personal finance app targeting first-time earners aged 22–26 in India. Which onboarding approach would you test first?",
    options: [
      {
        label: "A",
        text: "A step-by-step form collecting salary, expenses, and goals before showing any personalised content.",
        points: 1,
        subcatScores: { "onboarding design": 1, "value-before-ask": 0 },
      },
      {
        label: "B",
        text: "Show a personalised 'money health score' after just three questions — give the user a clear win before asking for more data.",
        points: 4,
        subcatScores: { "onboarding design": 4, "value-before-ask": 4, "user psychology": 4 },
      },
      {
        label: "C",
        text: "A full product tour highlighting every feature before asking the user for any information.",
        points: 0,
        subcatScores: { "onboarding design": 0, "user psychology": 0 },
      },
      {
        label: "D",
        text: "Skip structured onboarding entirely — let users explore and surface data requests contextually.",
        points: 2,
        subcatScores: { "onboarding design": 2, "value-before-ask": 2 },
      },
    ],
  },

  {
    id: "q6",
    dimension: "user_research",
    subcategories: ["user feedback synthesis", "retention mechanics", "contradictory data resolution"],
    tier: 2,
    stem: "Retention on your language-learning app drops sharply after day 3. Users say the app is 'too hard' but also 'too boring' in the same survey. How do you reconcile this apparent contradiction?",
    options: [
      {
        label: "A",
        text: "The survey is noisy — focus on the behavioural data and ignore the qualitative contradiction.",
        points: 1,
        subcatScores: { "user feedback synthesis": 0, "contradictory data resolution": 0 },
      },
      {
        label: "B",
        text: "Both can be true simultaneously: difficulty without visible progress feels pointless. Add explicit progress milestones so users see movement even when the content is hard.",
        points: 4,
        subcatScores: { "user feedback synthesis": 4, "retention mechanics": 4, "contradictory data resolution": 4 },
      },
      {
        label: "C",
        text: "Create separate 'easy' and 'hard' modes and let users self-select their difficulty level.",
        points: 2,
        subcatScores: { "retention mechanics": 2, "contradictory data resolution": 1 },
      },
      {
        label: "D",
        text: "Run follow-up user interviews focused specifically on what 'boring' means to this segment before acting.",
        points: 3,
        subcatScores: { "user feedback synthesis": 3, "contradictory data resolution": 3 },
      },
    ],
  },

  {
    id: "q7",
    dimension: "user_research",
    subcategories: ["user segmentation", "retention vs growth", "insight before action"],
    tier: 2,
    stem: "You're PM for a food delivery app. 70% of all orders come from 20% of users. You have budget for one initiative this quarter. What do you build?",
    options: [
      {
        label: "A",
        text: "A loyalty programme for the top 20% — protect the revenue base that drives the business.",
        points: 3,
        subcatScores: { "user segmentation": 3, "retention vs growth": 3 },
      },
      {
        label: "B",
        text: "An activation campaign for the casual 80% — there's more growth upside in converting them.",
        points: 2,
        subcatScores: { "retention vs growth": 2, "user segmentation": 1 },
      },
      {
        label: "C",
        text: "First investigate why the 80% are low-frequency — are they price-sensitive, unaware of the product, or churned? The answer determines the initiative.",
        points: 4,
        subcatScores: { "insight before action": 4, "user segmentation": 4, "retention vs growth": 4 },
      },
      {
        label: "D",
        text: "Add more restaurant partners to improve selection — more choice naturally drives more orders across both segments.",
        points: 1,
        subcatScores: { "user segmentation": 1, "insight before action": 0 },
      },
    ],
  },

  // ── EXECUTION (Q8–Q11) ────────────────────────────────────────────────────

  {
    id: "q8",
    dimension: "execution",
    subcategories: ["launch decisions", "risk assessment", "delivery tradeoffs"],
    tier: 2,
    stem: "You're two weeks from a major product launch. Engineering discovers a critical bug that will push the date by three weeks, or you can ship with a degraded experience affecting 10% of users. What do you do?",
    options: [
      {
        label: "A",
        text: "Always delay — never ship a broken product. The reputational cost of a bad launch outweighs any timing advantage.",
        points: 2,
        subcatScores: { "launch decisions": 1, "risk assessment": 1 },
      },
      {
        label: "B",
        text: "Assess specifically: which 10% are affected, is it on the critical path, and what is the competitive cost of a three-week delay? Make the call with data.",
        points: 4,
        subcatScores: { "launch decisions": 4, "risk assessment": 4, "delivery tradeoffs": 4 },
      },
      {
        label: "C",
        text: "Ship on time and patch post-launch — velocity matters and users will forgive a quick fix.",
        points: 1,
        subcatScores: { "delivery tradeoffs": 0, "launch decisions": 1 },
      },
      {
        label: "D",
        text: "Do a limited beta to the unaffected 90% on schedule, fix the bug, then roll out to the remaining 10%.",
        points: 4,
        subcatScores: { "delivery tradeoffs": 4, "launch decisions": 4, "risk assessment": 3 },
      },
    ],
  },

  {
    id: "q9",
    dimension: "execution",
    subcategories: ["post-launch analysis", "hypothesis ownership", "learning velocity"],
    tier: 2,
    stem: "A major feature you shipped six weeks ago isn't moving the retention metric it was designed to improve. Engineering has already moved on to the next sprint. How do you handle this?",
    options: [
      {
        label: "A",
        text: "Accept the outcome and move on — not every bet pays off, and dwelling on it wastes capacity.",
        points: 0,
        subcatScores: { "post-launch analysis": 0, "hypothesis ownership": 0 },
      },
      {
        label: "B",
        text: "Run a structured post-mortem: was the hypothesis wrong, was the execution wrong, or is it genuinely too early to call? Document the finding either way.",
        points: 4,
        subcatScores: { "post-launch analysis": 4, "hypothesis ownership": 4, "learning velocity": 4 },
      },
      {
        label: "C",
        text: "Immediately ship a v2 iteration based on initial user feedback from the first six weeks.",
        points: 2,
        subcatScores: { "learning velocity": 2, "post-launch analysis": 1 },
      },
      {
        label: "D",
        text: "Pull engineers back from the current sprint to fix the feature before the window of relevance closes.",
        points: 1,
        subcatScores: { "post-launch analysis": 0, "hypothesis ownership": 1 },
      },
    ],
  },

  {
    id: "q10",
    dimension: "execution",
    subcategories: ["spec precision", "cross-functional resolution", "UX ownership"],
    tier: 2,
    stem: "A product spec you wrote is being built differently from what you intended. Engineering made a reasonable technical call, but it compromises the key user experience. You discover this mid-sprint. What's your response?",
    options: [
      {
        label: "A",
        text: "Trust the engineers — they understand implementation constraints better than you do.",
        points: 1,
        subcatScores: { "UX ownership": 0, "cross-functional resolution": 0 },
      },
      {
        label: "B",
        text: "Understand the constraint they hit, identify the minimum viable change that preserves the UX intent, and propose it clearly in a 1:1.",
        points: 4,
        subcatScores: { "spec precision": 4, "cross-functional resolution": 4, "UX ownership": 4 },
      },
      {
        label: "C",
        text: "Escalate to the engineering manager to flag the misalignment before it ships.",
        points: 1,
        subcatScores: { "cross-functional resolution": 1, "UX ownership": 1 },
      },
      {
        label: "D",
        text: "Let it ship this sprint, then rewrite the spec with tighter constraints to prevent this in the next cycle.",
        points: 2,
        subcatScores: { "spec precision": 3, "UX ownership": 1 },
      },
    ],
  },

  {
    id: "q11",
    dimension: "execution",
    subcategories: ["scope negotiation", "sprint management", "prioritisation under pressure"],
    tier: 1,
    stem: "Mid-sprint, a critical customer escalation comes in and the CEO wants engineering to drop everything and fix it. Your current sprint contains a launch-critical feature with an external deadline. What do you do?",
    options: [
      {
        label: "A",
        text: "Tell the CEO the sprint is locked and the escalation should go into next sprint's queue.",
        points: 1,
        subcatScores: { "scope negotiation": 0, "prioritisation under pressure": 1 },
      },
      {
        label: "B",
        text: "Interrupt the sprint entirely to handle the escalation — customer escalations always take precedence.",
        points: 1,
        subcatScores: { "sprint management": 0, "prioritisation under pressure": 0 },
      },
      {
        label: "C",
        text: "Assess the actual severity of the escalation, the blast radius of the customer impact, and the cost of missing the external deadline. Bring both options to the CEO with a recommendation.",
        points: 4,
        subcatScores: { "scope negotiation": 4, "prioritisation under pressure": 4, "sprint management": 4 },
      },
      {
        label: "D",
        text: "Assign one engineer to the escalation and protect the rest of the sprint with the remaining capacity.",
        points: 3,
        subcatScores: { "sprint management": 3, "prioritisation under pressure": 3 },
      },
    ],
  },

  // ── TECHNICAL FLUENCY (Q12–Q14) ───────────────────────────────────────────

  {
    id: "q12",
    dimension: "technical_fluency",
    subcategories: ["estimation challenge", "build decomposition", "engineering partnership"],
    tier: 2,
    stem: "Engineering estimates a feature you've scoped at eight weeks. You believe three weeks is reasonable based on similar work you've seen. You don't have an engineering background. How do you navigate this without damaging the relationship?",
    options: [
      {
        label: "A",
        text: "Accept the estimate without question — engineering knows the implementation better than you do.",
        points: 0,
        subcatScores: { "estimation challenge": 0, "engineering partnership": 0 },
      },
      {
        label: "B",
        text: "Ask for the estimate broken down by task, identify the large blocks, and ask which dependencies could be parallelised or descoped for a v1.",
        points: 4,
        subcatScores: { "estimation challenge": 4, "build decomposition": 4, "engineering partnership": 4 },
      },
      {
        label: "C",
        text: "Get a quiet second opinion from another engineer before raising the discrepancy with the team.",
        points: 2,
        subcatScores: { "engineering partnership": 1, "estimation challenge": 2 },
      },
      {
        label: "D",
        text: "Challenge the estimate openly in the sprint planning meeting to create accountability.",
        points: 1,
        subcatScores: { "engineering partnership": 0, "estimation challenge": 1 },
      },
    ],
  },

  {
    id: "q13",
    dimension: "technical_fluency",
    subcategories: ["metric discrepancy analysis", "data quality instinct", "analytical depth"],
    tier: 3,
    stem: "The data team reports that DAU is up 15% over the past month, but revenue is flat. Your monetisation model charges per active session. The discrepancy doesn't make sense. What do you investigate first?",
    options: [
      {
        label: "A",
        text: "Check whether the DAU definition changed recently, or whether it now includes non-revenue users like free-tier accounts, bots, or internal test accounts.",
        points: 4,
        subcatScores: { "metric discrepancy analysis": 4, "data quality instinct": 4, "analytical depth": 4 },
      },
      {
        label: "B",
        text: "Audit the revenue pipeline — transactions may be tracked but not attributed correctly, especially after any recent payment infrastructure changes.",
        points: 3,
        subcatScores: { "analytical depth": 3, "data quality instinct": 3 },
      },
      {
        label: "C",
        text: "Flag it as likely seasonal fluctuation and monitor for another week before drawing conclusions.",
        points: 1,
        subcatScores: { "analytical depth": 0, "metric discrepancy analysis": 1 },
      },
      {
        label: "D",
        text: "Present the discrepancy to leadership as a concern that needs a formal data audit.",
        points: 2,
        subcatScores: { "data quality instinct": 1, "metric discrepancy analysis": 2 },
      },
    ],
  },

  {
    id: "q14",
    dimension: "technical_fluency",
    subcategories: ["build vs buy", "platform strategy", "total cost of ownership"],
    tier: 2,
    stem: "You need a search feature. Engineering says building in-house will take 10 weeks and give full control. Using Algolia would take 2 weeks to integrate and costs ₹8L per year at your current scale. Engineering prefers building in-house. What factors drive your decision?",
    options: [
      {
        label: "A",
        text: "Always build core features in-house — giving up control over search means giving up the ability to differentiate on it.",
        points: 1,
        subcatScores: { "build vs buy": 1, "platform strategy": 0 },
      },
      {
        label: "B",
        text: "Use Algolia now and revisit building in-house only if search becomes a genuine product differentiator — which most products never reach.",
        points: 4,
        subcatScores: { "build vs buy": 4, "total cost of ownership": 3, "platform strategy": 4 },
      },
      {
        label: "C",
        text: "Model Algolia's total cost at projected scale versus the 10-week opportunity cost for engineering. Present both scenarios to leadership.",
        points: 4,
        subcatScores: { "total cost of ownership": 4, "build vs buy": 4, "platform strategy": 3 },
      },
      {
        label: "D",
        text: "Let engineering make the call — it's fundamentally a technical decision and they should own it.",
        points: 0,
        subcatScores: { "build vs buy": 0, "platform strategy": 0 },
      },
    ],
  },

  // ── COMMUNICATION & INFLUENCE (Q15–Q17) ──────────────────────────────────

  {
    id: "q15",
    dimension: "communication",
    subcategories: ["pre-meeting alignment", "conflict resolution", "leadership presence"],
    tier: 2,
    stem: "Your roadmap for next quarter was approved by product and company leadership. The engineering lead disagrees with your top priority and brings it up for the first time the evening before the all-hands where you'll present it. How do you handle this?",
    options: [
      {
        label: "A",
        text: "Hold firm — the roadmap is approved and raising it now is too late.",
        points: 1,
        subcatScores: { "conflict resolution": 0, "pre-meeting alignment": 0 },
      },
      {
        label: "B",
        text: "Have a direct 1:1 immediately to understand the concern. If it's substantive, adjust the roadmap. If not, acknowledge it clearly and move forward as a unified team.",
        points: 4,
        subcatScores: { "pre-meeting alignment": 4, "conflict resolution": 4, "leadership presence": 4 },
      },
      {
        label: "C",
        text: "Acknowledge the engineering lead's concern publicly at the all-hands to demonstrate you're listening.",
        points: 2,
        subcatScores: { "leadership presence": 2, "conflict resolution": 1 },
      },
      {
        label: "D",
        text: "Loop in the VP of Engineering tonight to pre-empt any conflict at tomorrow's presentation.",
        points: 1,
        subcatScores: { "pre-meeting alignment": 1, "conflict resolution": 0 },
      },
    ],
  },

  {
    id: "q16",
    dimension: "communication",
    subcategories: ["executive communication", "business case framing", "financial fluency"],
    tier: 3,
    stem: "You need buy-in from a sceptical CFO for a feature that will increase infrastructure costs by ₹40L per year but is projected to improve annual retention by 8%. The CFO's first response is 'that sounds expensive.' How do you structure your response?",
    options: [
      {
        label: "A",
        text: "Lead with the user story — explain the pain users experience today and why this matters to the product.",
        points: 1,
        subcatScores: { "executive communication": 1, "business case framing": 0 },
      },
      {
        label: "B",
        text: "Model the LTV impact of 8% retention improvement against the ₹40L cost. Show the payback timeline, the confidence interval on the retention estimate, and the cost of not doing it.",
        points: 4,
        subcatScores: { "financial fluency": 4, "business case framing": 4, "executive communication": 4 },
      },
      {
        label: "C",
        text: "Show benchmarks of what competitors have achieved with similar retention investments.",
        points: 2,
        subcatScores: { "business case framing": 2, "executive communication": 2 },
      },
      {
        label: "D",
        text: "Ask for a smaller pilot budget to run a controlled test before committing to full cost.",
        points: 3,
        subcatScores: { "executive communication": 3, "business case framing": 3, "financial fluency": 2 },
      },
    ],
  },

  {
    id: "q17",
    dimension: "communication",
    subcategories: ["facilitation", "technical tiebreaking", "decisiveness"],
    tier: 2,
    stem: "You've just joined as PM on a new team. Two senior engineers disagree on how to architect a critical system — one wants a microservices approach, the other wants a monolith for now. Both look to you to break the tie. What do you do?",
    options: [
      {
        label: "A",
        text: "Default to the recommendation of the more senior engineer — they've earned the authority to make this call.",
        points: 0,
        subcatScores: { "decisiveness": 0, "facilitation": 0 },
      },
      {
        label: "B",
        text: "Ask both engineers to walk through their approach against a specific near-term scenario. Make a call based on what serves the user outcomes and near-term roadmap best.",
        points: 4,
        subcatScores: { "facilitation": 4, "technical tiebreaking": 4, "decisiveness": 4 },
      },
      {
        label: "C",
        text: "Defer the architectural decision — you're too new to weigh in and the team should resolve it.",
        points: 1,
        subcatScores: { "decisiveness": 0, "facilitation": 1 },
      },
      {
        label: "D",
        text: "Propose a time-boxed spike to prototype both approaches and let the data decide.",
        points: 3,
        subcatScores: { "facilitation": 3, "decisiveness": 3, "technical tiebreaking": 3 },
      },
    ],
  },
];
