import { AnimatePresence, animate, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { EASE } from "./ui";

const WORDS = ["ENGINEERED", "FOR MEN", "WHO MEASURE", "LIFE IN MILES"];

export default function Preloader({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(0);
  const [word, setWord] = useState(0);
  const [exit, setExit] = useState(false);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const controls = animate(0, 100, {
      duration: 1.9,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => {
        const n = Math.round(v);
        setCount(n);
        setWord(Math.min(WORDS.length - 1, Math.floor((n / 100) * WORDS.length)));
      },
      onComplete: () => {
        setExit(true);
        window.setTimeout(() => {
          document.body.style.overflow = prev;
          onDone();
        }, 700);
      },
    });

    return () => {
      controls.stop();
      document.body.style.overflow = prev;
    };
  }, [onDone]);

  return (
    <AnimatePresence>
      {!exit && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[300] flex flex-col justify-between overflow-hidden bg-ink px-6 py-6 md:px-10 md:py-8"
          exit={{ y: "-100%", transition: { duration: 0.95, ease: EASE } }}
          aria-label="Loading KOVAC"
          role="status"
        >
          <div className="bg-blueprint absolute inset-0 opacity-70" aria-hidden />
          <div
            className="absolute left-1/2 top-1/2 h-[50vh] w-[60vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember/[0.1] blur-[130px]"
            aria-hidden
          />

          <div className="relative flex items-center justify-between">
            <span className="font-display text-sm font-bold tracking-[0.3em] text-bone">
              KOVAC<span className="text-ember">®</span>
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-smoke">
              Portland, OR · EST. 2019
            </span>
          </div>

          <div className="relative flex flex-col items-center">
            <div className="h-8 overflow-hidden md:h-10">
              <AnimatePresence mode="wait">
                <motion.span
                  key={word}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "-100%", opacity: 0 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="block font-display text-xl font-bold tracking-[0.28em] text-bone/80 md:text-2xl"
                >
                  {WORDS[word]}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>

          <div className="relative flex items-end justify-between">
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-smoke">
                Loading experience
              </span>
              <div className="h-px w-40 overflow-hidden bg-bone/10 md:w-64">
                <motion.div
                  className="h-full origin-left bg-ember"
                  style={{ scaleX: count / 100 }}
                />
              </div>
            </div>
            <span className="font-display text-[22vw] font-bold leading-[0.8] tracking-[-0.05em] text-bone tabular-nums md:text-[11rem]">
              {String(count).padStart(2, "0")}
              <span className="text-[0.3em] text-ember">%</span>
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
