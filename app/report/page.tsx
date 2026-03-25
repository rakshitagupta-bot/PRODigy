"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { AssessmentDimension } from "@/types";
import type { ScoreProfile } from "@/lib/scoring";
import {
  DIMENSION_LABELS,
  DIMENSION_COLORS,
  scoreLabel,
  scoreColor,
} from "@/lib/scoring";
import { getArchetype } from "@/lib/archetypes";
import { createClient } from "@/lib/supabase";
import ArchetypeCard from "@/components/report/ArchetypeCard";
import SkillGapMap from "@/components/report/SkillGapMap";
import InsightBox from "@/components/report/InsightBox";
import ScoreRing from "@/components/ui/ScoreRing";

// ─── Constants ─────────────────────────────────────────────────────────────────

// Overall average benchmark (0–100 scale)
const OVERALL_BENCHMARK = 63;


// ─── Loading spinner ────────────────────────────────────────────────────────────

function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-[#0B0E1A] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-[#6B5BFF]/30 border-t-[#6B5BFF] animate-spin" />
    </div>
  );
}

// ─── Bottom nav ─────────────────────────────────────────────────────────────────

function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const links = [
    { label: "Report", href: "/report", icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="3" y="3" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4"/>
        <rect x="10" y="3" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4"/>
        <rect x="3" y="10" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4"/>
        <rect x="10" y="10" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4"/>
      </svg>
    )},
    { label: "Roadmap", href: "/roadmap", icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M3 9h12M9 3l6 6-6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )},
    { label: "Dashboard", href: "/dashboard", icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M9 6v3l2 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    )},
  ];

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-6 py-3 safe-area-inset-bottom"
      style={{
        background: "rgba(11,14,26,0.92)",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(16px)",
      }}
    >
      {links.map(({ label, href, icon }) => {
        const active = pathname === href;
        return (
          <button
            key={href}
            onClick={() => router.push(href)}
            className="flex flex-col items-center gap-1 min-w-[60px] transition-opacity"
            style={{ opacity: active ? 1 : 0.4 }}
          >
            <span
              style={{ color: active ? "#8B8FFF" : "white" }}
            >
              {icon}
            </span>
            <span
              className="text-[10px] font-outfit font-semibold"
              style={{ color: active ? "#8B8FFF" : "rgba(255,255,255,0.5)" }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Report content ─────────────────────────────────────────────────────────────

function ReportContent() {
  const router = useRouter();
  const [score, setScore] = useState<ScoreProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const savedRef = useRef(false);
  const supabaseRef = useRef<SupabaseClient | null>(null);

  function getSupabase() {
    if (!supabaseRef.current) supabaseRef.current = createClient();
    return supabaseRef.current;
  }

  // Load: try Supabase first, fall back to localStorage
  useEffect(() => {
    async function load() {
      try {
        const { data: { session } } = await getSupabase().auth.getSession();
        if (session) {
          const { data } = await getSupabase()
            .from("assessments")
            .select("scores")
            .eq("user_id", session.user.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

          if (data?.scores) {
            setScore(data.scores as ScoreProfile);
            setLoading(false);
            return;
          }
        }
      } catch {
        // Table may not exist yet — fall through to localStorage
      }

      const raw = localStorage.getItem("prodigy_score");
      if (raw) {
        try { setScore(JSON.parse(raw)); } catch {}
      }
      setLoading(false);
    }
    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Save to Supabase once per session
  useEffect(() => {
    if (!score || savedRef.current) return;
    if (sessionStorage.getItem("prodigy_saved")) { savedRef.current = true; return; }
    savedRef.current = true;
    const captured = score;

    async function persist() {
      try {
        const { data: { session } } = await getSupabase().auth.getSession();
        if (!session) return;
        await getSupabase().from("assessments").insert({
          user_id: session.user.id,
          answers: {},
          scores: captured,
          archetype: captured.archetype,
          role_type: captured.roleType,
          readiness_score: captured.overallReadiness,
        });
        sessionStorage.setItem("prodigy_saved", "1");
      } catch {
        // Schema not set up yet — fail silently
      }
    }
    persist();
  }, [score]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) return <LoadingSpinner />;

  if (!score) {
    return (
      <main className="min-h-screen bg-[#0B0E1A] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <p className="text-white/40 text-sm font-outfit">No assessment found.</p>
        <button
          onClick={() => router.push("/warmup")}
          className="px-6 py-3 rounded-xl text-sm font-outfit font-semibold text-white transition-all active:scale-[0.98]"
          style={{ background: "linear-gradient(135deg, #4A6CF7, #8B5CF6)" }}
        >
          Take the assessment
        </button>
      </main>
    );
  }

  const archetype = getArchetype(score.archetype);
  const overallPct = Math.round(score.overallReadiness * 10); // 0–100

  // Strongest dimension
  const sortedDims = (
    Object.entries(score.dimensionScores) as [AssessmentDimension, number][]
  ).sort((a, b) => b[1] - a[1]);
  const [strongestDim, strongestScore] = sortedDims[0];

  // Top 2 gap areas
  const gapEntries = score.gapMap.filter(
    (e) => e.status === "red" || e.status === "amber"
  );
  const gap1 = gapEntries[0]?.subcategory.replace(/_/g, " ") ?? "";
  const gap2 = gapEntries[1]?.subcategory.replace(/_/g, " ") ?? "";

  const strengthInsight = `Your ${DIMENSION_LABELS[strongestDim]} score (${strongestScore.toFixed(1)}/10) is your standout strength — this is where you naturally add value.`;
  const gapInsight = gap1
    ? `The clearest gaps are in ${gap1}${gap2 ? ` and ${gap2}` : ""} — focused practice here will move your readiness score the most.`
    : "Keep building across all dimensions to strengthen your overall readiness.";

  const fadeProp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  };

  return (
    <main className="min-h-screen bg-[#0B0E1A] pb-28">
      {/* Ambient glow */}
      <div
        className="pointer-events-none fixed inset-0 opacity-20"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 0%, #6B5BFF30 0%, transparent 65%)",
        }}
      />

      <div className="relative z-10 w-full max-w-[800px] mx-auto px-4 pt-8 space-y-5">
        {/* Page label */}
        <motion.p
          {...fadeProp}
          className="text-xs text-white/25 font-outfit uppercase tracking-widest"
        >
          PM Diagnostic Report
        </motion.p>

        {/* ── A. ArchetypeCard ────────────────────────────────────── */}
        <motion.div {...fadeProp} transition={{ ...fadeProp.transition, delay: 0.05 }}>
          <ArchetypeCard archetype={archetype} />
        </motion.div>

        {/* ── B. Score ring ────────────────────────────────────────── */}
        <motion.div
          {...fadeProp}
          transition={{ ...fadeProp.transition, delay: 0.1 }}
          className="rounded-2xl p-7"
          style={{
            background: "rgba(21,26,46,0.85)",
            border: "1px solid rgba(255,255,255,0.06)",
            backdropFilter: "blur(16px)",
          }}
        >
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <ScoreRing
              score={overallPct}
              benchmark={OVERALL_BENCHMARK}
              size={150}
              strokeWidth={11}
            />

            <div className="space-y-4 flex-1">
              <div>
                <p className="text-[10px] font-semibold text-white/30 font-outfit uppercase tracking-widest mb-1">
                  Overall Readiness
                </p>
                <p
                  className="text-2xl font-extrabold font-outfit"
                  style={{ color: scoreColor(score.overallReadiness) }}
                >
                  {scoreLabel(score.overallReadiness)}
                </p>
              </div>

              {/* Dimension mini scores */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
                {sortedDims.map(([dim, val]) => (
                  <div key={dim} className="flex items-center gap-2">
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: DIMENSION_COLORS[dim] }}
                    />
                    <span className="text-xs text-white/45 font-outfit flex-1 truncate">
                      {DIMENSION_LABELS[dim]}
                    </span>
                    <span
                      className="text-xs font-semibold font-outfit"
                      style={{ color: DIMENSION_COLORS[dim] }}
                    >
                      {val.toFixed(1)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Benchmark note */}
              <p className="text-[10px] text-white/20 font-outfit">
                Benchmark: {(OVERALL_BENCHMARK / 10).toFixed(1)}/10 · based on Indian PM candidates
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── C. Skill Gap Map ─────────────────────────────────────── */}
        <motion.div
          {...fadeProp}
          transition={{ ...fadeProp.transition, delay: 0.15 }}
          className="rounded-2xl p-6"
          style={{
            background: "rgba(21,26,46,0.85)",
            border: "1px solid rgba(255,255,255,0.06)",
            backdropFilter: "blur(16px)",
          }}
        >
          <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
            <h2 className="text-xs font-semibold text-white/35 font-outfit uppercase tracking-widest">
              Skill Gap Map
            </h2>
            <div className="flex items-center gap-3 text-[10px] font-outfit text-white/25">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444]" />
                Focus
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]" />
                Develop
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
                Strength
              </span>
              <span className="text-white/15">· line = benchmark</span>
            </div>
          </div>
          <SkillGapMap gapMap={score.gapMap} />
        </motion.div>

        {/* ── InsightBox ───────────────────────────────────────────── */}
        <motion.div
          {...fadeProp}
          transition={{ ...fadeProp.transition, delay: 0.2 }}
          className="space-y-3"
        >
          <InsightBox
            type="strength"
            dimension={DIMENSION_LABELS[strongestDim]}
            insight={strengthInsight}
          />
          {gap1 && (
            <InsightBox
              type="gap"
              dimension="Priority Focus Areas"
              insight={gapInsight}
            />
          )}
        </motion.div>

        {/* ── D. RoadmapDirection teaser ────────────────────────────── */}
        <motion.div
          {...fadeProp}
          transition={{ ...fadeProp.transition, delay: 0.25 }}
          className="rounded-2xl p-6 space-y-5"
          style={{
            background: "rgba(21,26,46,0.85)",
            border: "1px solid rgba(255,255,255,0.06)",
            backdropFilter: "blur(16px)",
          }}
        >
          <h2 className="text-xs font-semibold text-white/35 font-outfit uppercase tracking-widest">
            Your Next Move
          </h2>

          <p className="text-white/70 text-sm font-outfit leading-relaxed">
            You have a personalised roadmap ready — daily tasks built around your weakest areas as a{" "}
            <span className="text-white/90">{archetype.name}</span>.
          </p>

          <button
            onClick={() => router.push("/roadmap")}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-outfit font-semibold text-sm text-white transition-all duration-200 active:scale-[0.98] hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #4A6CF7, #8B5CF6)" }}
          >
            Build my roadmap
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </motion.div>
      </div>

      {/* ── Bottom nav ───────────────────────────────────────────────── */}
      <BottomNav />
    </main>
  );
}

// ─── Page export ────────────────────────────────────────────────────────────────

export default function ReportPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ReportContent />
    </Suspense>
  );
}
