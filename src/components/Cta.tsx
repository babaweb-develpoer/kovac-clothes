import { motion } from "framer-motion";
import { ArrowRight, Check, Flame } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FadeIn, RevealText } from "./ui";

function useCountdown() {
  const target = useRef(Date.now() + 1000 * 60 * 60 * 24 * 11 + 1000 * 60 * 60 * 7 + 1000 * 60 * 42);
  const [left, setLeft] = useState(target.current - Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setLeft(Math.max(0, target.current - Date.now())), 1000);
    return () => window.clearInterval(id);
  }, []);

  const s = Math.floor(left / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    mins: Math.floor((s % 3600) / 60),
    secs: s % 60,
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

export default function Cta() {
  const { days, hours, mins, secs } = useCountdown();
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const cells = [
    { v: pad(days), l: "Days" },
    { v: pad(hours), l: "Hours" },
    { v: pad(mins), l: "Min" },
    { v: pad(secs), l: "Sec" },
  ];

  return (
    <section id="cta" aria-labelledby="cta-heading" className="relative px-5 py-24 md:px-8 md:py-32">
      <FadeIn className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-line bg-coal">
          {/* ambient */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(110% 130% at 50% 0%, rgba(61, 123, 255,0.18), transparent 55%), radial-gradient(60% 60% at 85% 100%, rgba(138, 180, 255,0.08), transparent 70%)",
            }}
            aria-hidden
          />
          <div className="bg-blueprint absolute inset-0 opacity-60" aria-hidden />
          <motion.div
            className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-ember/15 blur-[100px]"
            animate={{ scale: [1, 1.25, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden
          />

          <div className="relative flex flex-col items-center px-6 py-16 text-center md:px-16 md:py-24">
            <span className="inline-flex items-center gap-2 rounded-full border border-ember/30 bg-ember/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-ember">
              <Flame size={13} aria-hidden /> First drop · numbered run
            </span>

            <h2
              id="cta-heading"
              className="mt-7 max-w-3xl font-display text-4xl font-bold leading-[1.02] tracking-[-0.03em] text-bone sm:text-5xl md:text-6xl"
            >
              <RevealText parts={["The drop won't wait."]} delay={0.1} />
              <br />
              <RevealText parts={[{ text: "Neither should you.", className: "text-gradient" }]} delay={0.35} />
            </h2>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-smoke md:text-lg">
              Launch pricing ends when the timer does — then the first drop is gone for good.
              Lock in your piece, or get first notice of the next drop.
            </p>

            {/* Countdown */}
            <div className="mt-10 flex items-stretch gap-3 md:gap-4" role="timer" aria-label="Time left on launch pricing">
              {cells.map((c, i) => (
                <div key={c.l} className="flex items-center gap-3 md:gap-4">
                  <div className="glass flex w-[72px] flex-col items-center rounded-2xl py-4 shadow-xl md:w-24 md:py-5">
                    <span className="font-display text-3xl font-bold tabular-nums tracking-tight text-bone md:text-4xl">
                      {c.v}
                    </span>
                    <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.24em] text-smoke md:text-[10px]">
                      {c.l}
                    </span>
                  </div>
                  {i < cells.length - 1 && (
                    <span className="font-display text-2xl font-bold text-ember/60" aria-hidden>
                      :
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Email capture */}
            <div className="mt-11 w-full max-w-xl">
              {done ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center justify-center gap-3 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-6 py-4"
                  role="status"
                >
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-400 text-ink">
                    <Check size={14} strokeWidth={3} aria-hidden />
                  </span>
                  <p className="text-sm font-semibold text-bone">You're on the list. Watch your inbox.</p>
                </motion.div>
              ) : (
                <form
                  className="flex flex-col gap-3 sm:flex-row"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (email.trim()) setDone(true);
                  }}
                >
                  <label htmlFor="cta-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="cta-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="h-14 flex-1 rounded-full border border-line bg-ink/60 px-6 text-sm text-bone placeholder:text-smoke/70 backdrop-blur transition-colors focus:border-ember/50 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="group inline-flex h-14 items-center justify-center gap-2.5 whitespace-nowrap rounded-full bg-ember px-8 text-sm font-semibold text-ink shadow-[0_0_45px_-10px_rgba(61, 123, 255,0.7)] transition-shadow duration-300 hover:shadow-[0_0_65px_-8px_rgba(61, 123, 255,0.9)]"
                  >
                    Claim yours
                    <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
                  </button>
                </form>
              )}
              <p className="mt-4 text-xs text-smoke">
                Join 48,000+ men on the list · One email per drop · No spam, ever
              </p>
            </div>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
