import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

type Variant = "default" | "link" | "view" | "hidden";

export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [variant, setVariant] = useState<Variant>("default");
  const [label, setLabel] = useState("");
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const sx = useSpring(x, { stiffness: 520, damping: 42, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 520, damping: 42, mass: 0.6 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
    document.documentElement.classList.add("has-cursor");

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);

      const t = e.target as HTMLElement | null;
      if (!t) return;
      const labelled = t.closest<HTMLElement>("[data-cursor]");
      if (labelled) {
        setVariant("view");
        setLabel(labelled.dataset.cursor || "VIEW");
        return;
      }
      if (t.closest("input, textarea, select")) {
        setVariant("hidden");
        return;
      }
      if (t.closest("a, button, [role='button'], [role='tab'], label, summary")) {
        setVariant("link");
        return;
      }
      setVariant("default");
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
      document.documentElement.classList.remove("has-cursor");
    };
  }, [x, y]);

  if (!enabled) return null;

  const size =
    variant === "view" ? 96 : variant === "link" ? 56 : variant === "hidden" ? 0 : 16;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[400]"
      style={{ x: sx, y: sy, opacity: visible ? 1 : 0 }}
    >
      {/* Ring / badge */}
      <motion.div
        animate={{
          width: size,
          height: size,
          backgroundColor:
            variant === "view" ? "rgba(61, 123, 255,1)" : "rgba(244,241,234,1)",
          opacity: variant === "hidden" ? 0 : 1,
        }}
        transition={{ type: "spring", stiffness: 380, damping: 28, mass: 0.7 }}
        className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
        style={{
          mixBlendMode: variant === "view" ? "normal" : "difference",
        }}
      >
        <motion.span
          animate={{ opacity: variant === "view" ? 1 : 0, scale: variant === "view" ? 1 : 0.6 }}
          transition={{ duration: 0.25 }}
          className="whitespace-nowrap font-display text-[10px] font-bold uppercase tracking-[0.22em] text-ink"
        >
          {label}
        </motion.span>
      </motion.div>
    </motion.div>
  );
}
