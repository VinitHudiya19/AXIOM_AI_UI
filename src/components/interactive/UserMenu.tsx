"use client";
import { useState, useRef, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, ChevronDown, User } from "lucide-react";
import Image from "next/image";

export default function UserMenu() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!session?.user) return null;

  const { name, email, image } = session.user;
  const initials = name
    ? name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : email?.[0]?.toUpperCase() ?? "?";

  return (
    <div ref={ref} className="relative px-3 py-3" style={{ borderTop: "1px solid var(--border)" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg transition-colors hover:bg-white/5"
      >
        {/* Avatar */}
        <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center text-xs font-bold"
          style={{ background: "linear-gradient(135deg, #06b6d4, #3b82f6)", color: "white" }}
        >
          {image ? (
            <Image src={image} alt={name ?? "User"} width={28} height={28} className="w-full h-full object-cover" />
          ) : (
            initials
          )}
        </div>

        {/* Name + email */}
        <div className="flex-1 min-w-0 text-left">
          <p className="text-xs font-medium truncate" style={{ color: "var(--text-primary)" }}>
            {name ?? "User"}
          </p>
          <p className="text-[10px] truncate" style={{ color: "var(--text-faint)" }}>
            {email}
          </p>
        </div>

        <ChevronDown
          className="w-3.5 h-3.5 flex-shrink-0 transition-transform"
          style={{ color: "var(--text-faint)", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-3 right-3 mb-1 rounded-xl overflow-hidden shadow-2xl z-50"
            style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
          >
            {/* User info header */}
            <div className="px-3 py-3" style={{ borderBottom: "1px solid var(--border)" }}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center text-xs font-bold"
                  style={{ background: "linear-gradient(135deg, #06b6d4, #3b82f6)", color: "white" }}
                >
                  {image ? (
                    <Image src={image} alt={name ?? "User"} width={32} height={32} className="w-full h-full object-cover" />
                  ) : (
                    initials
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold truncate" style={{ color: "var(--text-primary)" }}>{name}</p>
                  <p className="text-[10px] truncate" style={{ color: "var(--text-faint)" }}>{email}</p>
                </div>
              </div>
            </div>

            {/* Profile row */}
            <button
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs transition-colors hover:bg-white/5"
              style={{ color: "var(--text-secondary)" }}
              onClick={() => setOpen(false)}
            >
              <User className="w-3.5 h-3.5" style={{ color: "var(--text-muted)" }} />
              Profile
            </button>

            {/* Sign out */}
            <button
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs transition-colors hover:bg-red-500/10"
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
  );
}
