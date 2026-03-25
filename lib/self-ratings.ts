import type { AssessmentSelfRating } from "@/types";

export const selfRatings: AssessmentSelfRating[] = [
  {
    id: "sr1",
    dimension: "thinking_strategy",
    subcategory: "strategic self-assessment",
    stem: "You're asked to lead a product strategy session. The problem is ambiguous, the brief is thin, and stakeholders have conflicting views. How do you typically show up?",
    options: [
      {
        label: "A",
        text: "I feel uncertain here — I usually rely on others to structure the problem or provide a framework.",
        rawPoints: 1,
        normalisedScore: 2.0,
      },
      {
        label: "B",
        text: "I can structure it when the domain is familiar, but I struggle to frame the problem independently in new contexts.",
        rawPoints: 2,
        normalisedScore: 4.5,
      },
      {
        label: "C",
        text: "I consistently frame ambiguous problems well and can defend my reasoning clearly, even under pressure.",
        rawPoints: 3,
        normalisedScore: 7.0,
      },
      {
        label: "D",
        text: "Strategic framing is a genuine strength — I'm often the person who brings clarity to the room when others are stuck.",
        rawPoints: 4,
        normalisedScore: 9.0,
      },
    ],
  },

  {
    id: "sr2",
    dimension: "user_research",
    subcategory: "product empathy",
    stem: "Think about the last time you made a product or experience decision for someone else. How well did your initial instinct match what they actually needed?",
    options: [
      {
        label: "A",
        text: "My instincts are often off — I've learned to distrust them and rely almost entirely on data and research.",
        rawPoints: 1,
        normalisedScore: 2.0,
      },
      {
        label: "B",
        text: "I sometimes get it right, but I've been genuinely surprised by user reactions often enough to stay cautious.",
        rawPoints: 2,
        normalisedScore: 4.5,
      },
      {
        label: "C",
        text: "My product intuition is reasonably reliable — I've built recognisable patterns for anticipating what users will respond to.",
        rawPoints: 3,
        normalisedScore: 7.0,
      },
      {
        label: "D",
        text: "I have strong, calibrated product instincts. Users consistently validate my initial read, and I know when to trust it.",
        rawPoints: 4,
        normalisedScore: 9.0,
      },
    ],
  },

  {
    id: "sr3",
    dimension: "execution",
    subcategory: "delivery ownership",
    stem: "A feature you championed shipped two weeks ago. Usage is lower than expected and the impact on the target metric is unclear. How do you respond?",
    options: [
      {
        label: "A",
        text: "I'd wait for the data to stabilise and lean on the analytics team to tell me what's happening.",
        rawPoints: 1,
        normalisedScore: 2.0,
      },
      {
        label: "B",
        text: "I'd dig into the data myself, but I'd be unsure what exactly to look for or what to propose next.",
        rawPoints: 2,
        normalisedScore: 4.5,
      },
      {
        label: "C",
        text: "I'd run a structured post-mortem: was the hypothesis wrong, the execution wrong, or is it too early to call? Then propose a specific next step.",
        rawPoints: 3,
        normalisedScore: 7.0,
      },
      {
        label: "D",
        text: "Closing the loop on post-launch outcomes is second nature to me. I'd already have a hypothesis and an action in motion.",
        rawPoints: 4,
        normalisedScore: 9.0,
      },
    ],
  },

  {
    id: "sr4",
    dimension: "technical_fluency",
    subcategory: "engineering partnership",
    stem: "An engineer tells you the feature you want will require a significant architectural change and probably can't be done this quarter. How do you typically handle this?",
    options: [
      {
        label: "A",
        text: "I take it at face value and adjust my plan — technical assessments are outside my expertise.",
        rawPoints: 1,
        normalisedScore: 2.0,
      },
      {
        label: "B",
        text: "I ask a few questions but I'm often not sure whether the concern is a real constraint or a scope negotiation.",
        rawPoints: 2,
        normalisedScore: 4.5,
      },
      {
        label: "C",
        text: "I'd ask them to break it down and explore alternatives — I can usually distinguish genuine architectural constraints from avoidable complexity.",
        rawPoints: 3,
        normalisedScore: 7.0,
      },
      {
        label: "D",
        text: "Technical constraints are part of my regular thinking. I work through these as a collaborative partner and I usually find a path forward.",
        rawPoints: 4,
        normalisedScore: 9.0,
      },
    ],
  },

  {
    id: "sr5",
    dimension: "communication",
    subcategory: "audience adaptation",
    stem: "You need to communicate the same product decision to three different people in one day: your engineering lead, the CFO, and a new user in a research session. How naturally does shifting between these feel?",
    options: [
      {
        label: "A",
        text: "I find it difficult — I tend to communicate the same way regardless of who I'm talking to.",
        rawPoints: 1,
        normalisedScore: 2.0,
      },
      {
        label: "B",
        text: "I can adjust somewhat, but I know certain audiences are harder for me than others.",
        rawPoints: 2,
        normalisedScore: 4.5,
      },
      {
        label: "C",
        text: "I adapt message, tone, and framing to the audience consistently — I think about this deliberately.",
        rawPoints: 3,
        normalisedScore: 7.0,
      },
      {
        label: "D",
        text: "Adapting to audience is completely instinctive — I read the room and adjust in real time without thinking about it.",
        rawPoints: 4,
        normalisedScore: 9.0,
      },
    ],
  },
];
