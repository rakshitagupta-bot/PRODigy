export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#0B0E1A] flex items-center justify-center p-6">
      <div className="w-full max-w-[600px] text-center space-y-4">
        <p className="text-white/40 text-sm font-outfit">Returning user</p>
        <h1 className="text-2xl font-bold text-white font-outfit">Welcome back</h1>
        <p className="text-white/50 text-sm font-outfit">
          Placeholder — returning user dashboard with score history, roadmap progress, and next actions.
        </p>
      </div>
    </main>
  );
}
