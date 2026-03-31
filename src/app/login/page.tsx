import { signIn } from "@/auth";
import { Activity, ArrowLeft } from "lucide-react";

// GitHub SVG icon
function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

// Google SVG icon
function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

export default function LoginPage() {
  return (
    <div
      className="min-h-screen w-full flex"
      style={{ background: "var(--bg-base)" }}
    >
      {/* Back to home — top left */}
      <a
        href="/"
        className="absolute top-4 left-4 z-50 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:bg-white/5"
        style={{ color: "var(--text-muted)", border: "1px solid var(--border)" }}
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back
      </a>
      {/* Left panel — branding */}
      <div
        className="hidden lg:flex flex-col justify-between w-[45%] p-12 relative overflow-hidden"
        style={{ background: "var(--bg-surface)", borderRight: "1px solid var(--border)" }}
      >
        {/* Ambient glow */}
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(96,165,250,0.08) 0%, transparent 70%)" }}
        />

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold tracking-tight text-lg" style={{ color: "var(--text-primary)" }}>AXIOM AI</p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>Multi-Agent Orchestrator</p>
          </div>
        </div>

        {/* Feature list */}
        <div className="space-y-8 relative z-10">
          <div>
            <h1 className="text-3xl font-bold leading-tight mb-3" style={{ color: "var(--text-primary)" }}>
              Intelligent data analysis,<br />
              <span style={{ color: "#06b6d4" }}>orchestrated by AI.</span>
            </h1>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
              Upload your dataset, ask a question in plain English, and watch a team of specialist AI agents plan, execute, and visualize results in real time.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { icon: "⚡", title: "Real-time execution graph", desc: "Watch tasks flow through a live animated DAG" },
              { icon: "🤖", title: "6 specialist agents", desc: "Context, SQL, Viz, ML, NLP, and Report agents working in parallel" },
              { icon: "📊", title: "Smart result widgets", desc: "Tables, charts, and markdown reports auto-rendered per agent" },
              { icon: "🔍", title: "Live logs terminal", desc: "VS Code-style terminal showing every event as it happens" },
            ].map((f) => (
              <div key={f.title} className="flex items-start gap-3">
                <span className="text-lg mt-0.5">{f.icon}</span>
                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{f.title}</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-xs relative z-10" style={{ color: "var(--text-faint)" }}>
          © 2026 AXIOM AI · GEMRSLIZE Platform
        </p>
      </div>

      {/* Right panel — auth */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold" style={{ color: "var(--text-primary)" }}>AXIOM AI</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
              Welcome back
            </h2>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Sign in to your workspace to continue
            </p>
          </div>

          {/* Auth buttons */}
          <div className="space-y-3">
            {/* Google */}
            <form
              action={async () => {
                "use server";
                await signIn("google", { redirectTo: "/" });
              }}
            >
              <button
                type="submit"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group"
                style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border)",
                  color: "var(--text-primary)",
                }}
              >
                <GoogleIcon />
                <span className="flex-1 text-left">Continue with Google</span>
                <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "var(--text-faint)" }}>→</span>
              </button>
            </form>

            {/* GitHub */}
            <form
              action={async () => {
                "use server";
                await signIn("github", { redirectTo: "/" });
              }}
            >
              <button
                type="submit"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group"
                style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border)",
                  color: "var(--text-primary)",
                }}
              >
                <GitHubIcon />
                <span className="flex-1 text-left">Continue with GitHub</span>
                <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "var(--text-faint)" }}>→</span>
              </button>
            </form>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
            <span className="text-xs" style={{ color: "var(--text-faint)" }}>secure OAuth 2.0</span>
            <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
          </div>

          <p className="text-xs text-center leading-relaxed" style={{ color: "var(--text-faint)" }}>
            By signing in you agree to our terms of service.<br />
            No password required — we use OAuth only.
          </p>
        </div>
      </div>
    </div>
  );
}
