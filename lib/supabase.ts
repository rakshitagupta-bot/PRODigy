import { createBrowserClient } from "@supabase/ssr";

// createBrowserClient validates URL format strictly, so we guard here.
// Real values come from .env.local at runtime; these placeholders keep
// the build from crashing before env vars are set.
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith("https://")
    ? process.env.NEXT_PUBLIC_SUPABASE_URL
    : "https://placeholder.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

// ─── Browser client (use in client components) ────────────────────────────────
// createBrowserClient handles cookie-based session management automatically.
export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

// Singleton for convenience in client components
export const supabase = createClient();
