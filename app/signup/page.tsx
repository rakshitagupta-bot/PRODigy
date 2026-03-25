"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase";

// ─── Google icon ───────────────────────────────────────────────────────────────

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"
        fill="#EA4335"
      />
    </svg>
  );
}

// ─── Signup content ─────────────────────────────────────────────────────────────

function SignupContent() {
  const router = useRouter();

  const supabaseRef = useRef<SupabaseClient | null>(null);
  function getSupabase(): SupabaseClient {
    if (!supabaseRef.current) supabaseRef.current = createClient();
    return supabaseRef.current;
  }

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Show OAuth error if redirected back with ?error=
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const err = params.get("error");
    if (err === "oauth_failed")   setError("Google sign-in was cancelled. Please try again.");
    if (err === "session_failed") setError("Something went wrong. Please try again.");
  }, []);

  // If already signed in: go to /insight if warmup exists, else /report
  useEffect(() => {
    getSupabase().auth.getSession().then(({ data }) => {
      if (!data.session) return;
      router.replace("/assessment");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  async function handleGoogleSignIn() {
    setLoading(true);
    setError(null);

    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/auth/callback`
        : "/auth/callback";

    const { error: oauthError } = await getSupabase().auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        queryParams: {
          access_type: "offline",
          prompt: "select_account",
        },
      },
    });

    if (oauthError) {
      setError(oauthError.message);
      setLoading(false);
    }
    // If no error, browser navigates away — loading stays true
  }

  return (
    <main className="min-h-screen bg-[#0B0E1A] flex flex-col items-center justify-center p-5">
      {/* Ambient glow */}
      <div
        className="pointer-events-none fixed inset-0 opacity-20"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 50% 0%, #6B5BFF35 0%, transparent 65%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[400px] space-y-8"
      >
        {/* Card */}
        <div
          className="rounded-2xl p-8 space-y-7"
          style={{
            background: "rgba(21,26,46,0.8)",
            border: "1px solid rgba(255,255,255,0.06)",
            backdropFilter: "blur(16px)",
          }}
        >
          {/* Headline */}
          <div className="space-y-2 text-center">
            <h1 className="font-serif text-[38px] leading-tight text-white">
              Your insight is{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #4A6CF7, #8B5CF6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontStyle: "italic",
                }}
              >
                ready.
              </span>
            </h1>
            <p className="text-white/50 text-sm font-outfit leading-relaxed">
              Sign in to unlock your personalised PM insight, then take the
              full diagnostic and get your 20-category breakdown.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-xl px-4 py-3 text-sm text-[#f87171] bg-[#ef4444]/10 border border-[#ef4444]/25 font-outfit">
              {error}
            </div>
          )}

          {/* Google button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl font-outfit font-semibold text-sm text-white border transition-all duration-200 hover:border-white/20 hover:bg-white/[0.06] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              background: "rgba(255,255,255,0.04)",
              borderColor: "rgba(255,255,255,0.12)",
            }}
          >
            {loading ? (
              <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
            ) : (
              <GoogleIcon />
            )}
            <span>
              {loading ? "Redirecting to Google…" : "Continue with Google"}
            </span>
          </button>

          {/* No-BS checklist */}
          <div className="space-y-2.5 pt-1">
            {[
              "No password to create or remember",
              "No credit card required",
              "No marketing emails — ever",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2.5">
                <span
                  className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 text-[10px]"
                  style={{ background: "rgba(34,197,94,0.15)", color: "#4ade80" }}
                >
                  ✓
                </span>
                <span className="text-xs text-white/45 font-outfit">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Fine print */}
        <p className="text-center text-xs text-white/20 font-outfit px-4">
          By continuing, you agree to our terms. Your results are stored
          securely and never shared.
        </p>
      </motion.div>
    </main>
  );
}

// ─── Page export ───────────────────────────────────────────────────────────────

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0B0E1A] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#6B5BFF]/30 border-t-[#6B5BFF] animate-spin" />
        </div>
      }
    >
      <SignupContent />
    </Suspense>
  );
}
