"use client";
import { useState, useRef, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, User, ChevronDown } from "lucide-react";
import Image from "next/image";

export default function TopBar() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (status === "loading") return (
    <div
      className="flex items-center justify-end px-5 h-11 flex-shrink-0"
      style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-surface)" }}
    >
      <div className="w-7 h-7 rounded-full animate-pulse" style={{ background: "var(--bg-elevated)" }} />
    </div>
  );

  const user = session?.user;
  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? "?";

  return (
    <div
      className="flex items-center justify-end px-5 h-11 flex-shrink-0"
      style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-surface)" }}
    >
      {user ? (
        <div ref={ref} className="relative">
          {/* Avatar button */}
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors hover:bg-white/5"
          >
            <div
              className="w-7 h-7 rounded-full overflow-hidden flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #06b6d4, #3b82f6)", color: "white" }}
            >
              {user.image ? (
                <Image src={user.image} alt={user.name ?? "User"} width={28} height={28} className="w-full h-full object-cover" />
              ) : (
                initials
              )}
            </div>
            <span className="text-xs font-medium max-w-[120px] truncate hidden sm:block" style={{ color: "var(--text-secondary)" }}>
              {user.name ?? user.email}
            </span>
            <ChevronDown
              className="w-3 h-3 transition-transform hidden sm:block"
              style={{ color: "var(--text-faint)", transform: open ? "rotate(180deg)" : "rotate(0)" }}
            />
          </button>

          {/* Dropdown */}
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.97 }}
                transition={{ duration: 0.14 }}
                className="absolute right-0 top-full mt-1.5 w-56 rounded-xl overflow-hidden shadow-2xl z-50"
                style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
              >
                {/* User info */}
                <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--border)" }}>
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center text-sm font-bold flex-shrink-0"
                      style={{ background: "linear-gradient(135deg, #06b6d4, #3b82f6)", color: "white" }}
                    >
                      {user.image ? (
                        <Image src={user.image} alt={user.name ?? "User"} width={36} height={36} className="w-full h-full object-cover" />
                      ) : (
                        initials
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold truncate" style={{ color: "var(--text-primary)" }}>{user.name}</p>
                      <p className="text-[10px] truncate" style={{ color: "var(--text-faint)" }}>{user.email}</p>
                    </div>
                  </div>
                </div>

                {/* Profile */}
                <button
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs transition-colors hover:bg-white/5"
                  style={{ color: "var(--text-secondary)" }}
                  onClick={() => setOpen(false)}
                >
                  <User className="w-3.5 h-3.5" style={{ color: "var(--text-muted)" }} />
                  Profile
                </button>

                {/* Sign out */}
                <button
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs transition-colors hover:bg-red-500/10"
                  style={{ color: "#f87171", borderTop: "1px solid var(--border)" }}
                  onClick={() => signOut({ callbackUrl: "/login" })}
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        // Not signed in — show Sign in button
        <a
          href="/login"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
          style={{
            background: "var(--bg-elevated)",
            border: "1px solid var(--border)",
            color: "var(--text-secondary)",
          }}
        >
          Sign in
        </a>
      )}
    </div>
  );
}
