import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "../utils/cn";

export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* ------------------------------ Media query ------------------------------ */

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const handler = () => setMatches(mq.matches);
    handler();
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [query]);
  return matches;
}

/* ---------------------------------- Reveal --------------------------------- */

export function FadeIn({
  children,
  className,
  delay = 0,
  y = 30,
  once = true,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-70px" }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({
  children,
  className,
  delay = 0,
  gap = 0.11,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  gap?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-70px" }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: gap, delayChildren: delay } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function Item({
  children,
  className,
  y = 26,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y },
        show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE } },
      }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------- RevealText ------------------------------- */

export type TextPart = string | { text: string; className?: string };

/**
 * Word-by-word masked reveal. Accepts plain text or an array of parts so
 * individual words can carry a className (e.g. gradient text).
 */
export function RevealText({
  parts,
  className,
  delay = 0,
  stagger = 0.045,
  once = true,
  animate,
}: {
  parts: TextPart | TextPart[];
  className?: string;
  delay?: number;
  stagger?: number;
  once?: boolean;
  /** Controlled mode: pass "show"/"hidden" to drive manually (e.g. after preloader) */
  animate?: "show" | "hidden";
}) {
  const list = Array.isArray(parts) ? parts : [parts];
  const words: { w: string; cls?: string }[] = [];
  list.forEach((p) => {
    const text = typeof p === "string" ? p : p.text;
    const cls = typeof p === "string" ? undefined : p.className;
    text.split(" ").forEach((w) => {
      if (w.length) words.push({ w, cls });
    });
  });
  const label = words.map((x) => x.w).join(" ");

  const controlled = animate !== undefined;

  return (
    <motion.span
      className={cn("inline", className)}
      aria-label={label}
      initial="hidden"
      {...(controlled
        ? { animate }
        : { whileInView: "show", viewport: { once, margin: "-60px" } })}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
    >
      {words.map((x, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden pb-[0.14em] -mb-[0.14em] align-bottom"
          aria-hidden
        >
          <motion.span
            className={cn("inline-block will-change-transform", x.cls)}
            variants={{
              hidden: { y: "112%", rotate: 4, opacity: 0 },
              show: {
                y: 0,
                rotate: 0,
                opacity: 1,
                transition: { duration: 0.95, ease: EASE },
              },
            }}
          >
            {x.w}
          </motion.span>
          {i < words.length - 1 && "\u00A0"}
        </span>
      ))}
    </motion.span>
  );
}

/* --------------------------------- CountUp --------------------------------- */

export function CountUp({
  to,
  decimals = 0,
  suffix = "",
  prefix = "",
  className,
}: {
  to: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  useEffect(() => {
    if (!inView || !ref.current) return;
    const controls = animate(0, to, {
      duration: 2,
      ease: EASE,
      onUpdate: (v) => {
        if (ref.current) {
          ref.current.textContent =
            prefix +
            v.toLocaleString("en-US", {
              minimumFractionDigits: decimals,
              maximumFractionDigits: decimals,
            }) +
            suffix;
        }
      },
    });
    return () => controls.stop();
  }, [inView, to, decimals, prefix, suffix]);

  return (
    <span ref={ref} className={className}>
      {prefix}0{suffix}
    </span>
  );
}

/* --------------------------------- Magnetic -------------------------------- */

export function Magnetic({
  children,
  className,
  strength = 0.3,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 16, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 180, damping: 16, mass: 0.4 });

  return (
    <motion.div
      ref={ref}
      className={cn("inline-block", className)}
      style={{ x: sx, y: sy }}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        x.set((e.clientX - r.left - r.width / 2) * strength);
        y.set((e.clientY - r.top - r.height / 2) * strength);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------ Section heading ---------------------------- */

export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 rounded-full border border-line bg-bone/[0.04] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-smoke backdrop-blur",
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-ember animate-pulse-ring" aria-hidden />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  parts,
  sub,
  align = "center",
  className,
}: {
  eyebrow: string;
  title?: ReactNode;
  /** When provided, the title is rendered with a word-by-word RevealText */
  parts?: TextPart[];
  sub?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-14 md:mb-20",
        align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-2xl",
        className
      )}
    >
      <FadeIn>
        <Eyebrow>{eyebrow}</Eyebrow>
      </FadeIn>
      {parts ? (
        <h2 className="mt-6 font-display text-4xl font-bold leading-[1.02] tracking-[-0.03em] text-bone sm:text-5xl md:text-6xl">
          <RevealText parts={parts} delay={0.1} />
        </h2>
      ) : (
        <FadeIn delay={0.08}>
          <h2 className="mt-6 font-display text-4xl font-bold leading-[1.02] tracking-[-0.03em] text-bone sm:text-5xl md:text-6xl">
            {title}
          </h2>
        </FadeIn>
      )}
      {sub && (
        <FadeIn delay={0.16}>
          <p className="mt-5 text-base leading-relaxed text-smoke md:text-lg">
            {sub}
          </p>
        </FadeIn>
      )}
    </div>
  );
}
