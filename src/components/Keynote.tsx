import {
  AnimatePresence,
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
} from "framer-motion";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "../utils/cn";
import {
  ATLAS_CAMPAIGN_IMG,
  HARDWARE_DETAIL_IMG,
  HERO_LOOP_VIDEO,
  KEYNOTE_VIDEO_1,
  KEYNOTE_VIDEO_2,
  KEYNOTE_VIDEO_3,
  LIFESTYLE_NIGHT_IMG,
  MACRO_WOOL_IMG,
} from "../utils/assets";
import { EASE, SectionHeading } from "./ui";

const DURATION = 6500;

type Slide = {
  frame: string;
  time: string;
  eyebrow: string;
  title: string;
  body: string;
  stat: { label: string; value: string };
  img: string;
  video?: string;
  align?: "left" | "right";
};

const ATLAS_MAIN = ATLAS_CAMPAIGN_IMG;
const MACRO_WOOL = MACRO_WOOL_IMG;
const MACRO_DENIM = HARDWARE_DETAIL_IMG;

const SLIDES: Slide[] = [
  {
    frame: "01",
    time: "05:42 AM",
    eyebrow: "First light",
    title: "The first mile decides the day.",
    body: "Before the city wakes, the Atlas is already on. A 20,000 mm KovaShell™ membrane shrugs off the overnight drizzle — you don't plan around the weather, it plans around you.",
    stat: { label: "Waterproofing", value: "20K mm" },
    img: ATLAS_MAIN,
    video: KEYNOTE_VIDEO_1,
  },
  {
    frame: "02",
    time: "08:15 AM",
    eyebrow: "The commute",
    title: "Breathes through the rush.",
    body: "Packed platform, three flights of stairs, a sprint for closing doors. 25,000 g/m²/24h breathability dumps heat exactly where it builds — so you arrive composed, not steamed.",
    stat: { label: "Breathability", value: "25K g/m²" },
    img: MACRO_WOOL,
    video: KEYNOTE_VIDEO_2,
    align: "right",
  },
  {
    frame: "03",
    time: "12:30 PM",
    eyebrow: "The detail",
    title: "Sealed twice. Zipped once.",
    body: "StormLock™ 20 mm seam tape, YKK AquaGuard zips, storm plackets on every closure. Look close — that hardware is the whole argument for buying once.",
    stat: { label: "Seam tape", value: "20 mm" },
    img: MACRO_DENIM,
    video: KEYNOTE_VIDEO_3,
  },
  {
    frame: "04",
    time: "11:48 PM",
    eyebrow: "After dark",
    title: "Home is a 40-block walk. Good.",
    body: "Wet asphalt, one more bar, the long way home. The Atlas keeps the cold out and the night quiet — the last layer you take off is the first one you reach for.",
    stat: { label: "Layers", value: "3-Layer" },
    img: LIFESTYLE_NIGHT_IMG,
    video: HERO_LOOP_VIDEO,
    align: "right",
  },
];

export default function Keynote() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const progress = useMotionValue(0);
  const pRef = useRef(0);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const go = useCallback(
    (i: number) => {
      pRef.current = 0;
      progress.set(0);
      setActive(((i % SLIDES.length) + SLIDES.length) % SLIDES.length);
    },
    [progress]
  );

  useAnimationFrame((_, delta) => {
    if (paused || userPaused || reduced || !inView) return;
    pRef.current += delta / DURATION;
    if (pRef.current >= 1) {
      pRef.current = 0;
      setActive((a) => (a + 1) % SLIDES.length);
    }
    progress.set(pRef.current);
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!inView) return;
      if (e.key === "ArrowRight") go(active + 1);
      if (e.key === "ArrowLeft") go(active - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, go, inView]);

  const s = SLIDES[active];

  return (
    <section id="keynote" aria-labelledby="keynote-heading" className="relative py-24 md:py-36">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <div id="keynote-heading">
          <SectionHeading
            eyebrow="A day in the Atlas"
            parts={["One layer. ", { text: "Four frames.", className: "text-gradient" }]}
            sub="Twenty-four hours, told by the shell. Sit back — or scrub through with the arrows."
          />
        </div>

        <div
          ref={ref}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="group relative h-[82vh] min-h-[600px] overflow-hidden rounded-[2rem] border border-line bg-coal shadow-[0_50px_120px_-40px_rgba(0,0,0,0.9)]"
          role="region"
          aria-roledescription="carousel"
          aria-label="A day in the Atlas Storm Shell"
        >
          {/* Media */}
          <AnimatePresence initial={false}>
            <motion.div
              key={active}
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: EASE }}
              className="absolute inset-0"
            >
              {s.video ? (
                <video
                  className="h-full w-full object-cover"
                  src={s.video}
                  poster={s.img}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
              ) : (
                <motion.img
                  src={s.img}
                  alt=""
                  initial={{ scale: 1 }}
                  animate={{ scale: 1.1 }}
                  transition={{ duration: DURATION / 1000 + 1, ease: "linear" }}
                  className="h-full w-full object-cover"
                />
              )}
              <div
                className={cn(
                  "absolute inset-0",
                  s.align === "right"
                    ? "bg-gradient-to-l from-ink/85 via-ink/40 to-ink/10"
                    : "bg-gradient-to-r from-ink/85 via-ink/40 to-ink/10"
                )}
              />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/90 to-transparent" />
            </motion.div>
          </AnimatePresence>

          {/* Progress bars */}
          <div className="absolute inset-x-0 top-0 z-20 flex gap-2 p-5 md:p-7">
            {SLIDES.map((sl, i) => (
              <button
                key={sl.frame}
                type="button"
                onClick={() => go(i)}
                aria-label={`Go to frame ${sl.frame}: ${sl.eyebrow}`}
                aria-current={i === active}
                className="group/bar relative h-6 flex-1"
              >
                <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-bone/20 transition-all group-hover/bar:h-[3px]" />
                <motion.span
                  className="absolute inset-x-0 top-1/2 h-px origin-left -translate-y-1/2 bg-ember transition-[height] group-hover/bar:h-[3px]"
                  style={{ scaleX: i < active ? 1 : i === active ? progress : 0 }}
                />
              </button>
            ))}
          </div>

          {/* Frame number + time */}
          <div className="absolute right-6 top-14 z-20 text-right md:right-9 md:top-16">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-bone/60">
                  Frame {s.frame} · {s.time}
                </p>
                <p className="text-stroke mt-1 font-display text-7xl font-bold leading-none md:text-9xl" aria-hidden>
                  {s.frame}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Copy */}
          <div
            className={cn(
              "absolute inset-x-0 bottom-0 z-20 p-6 md:p-12",
              s.align === "right" ? "md:pl-[42%]" : "md:pr-[38%]"
            )}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial="hidden"
                animate="show"
                exit="exit"
                variants={{
                  hidden: {},
                  show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
                  exit: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
                }}
              >
                {[
                  <span key="eb" className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.26em] text-ember">
                    <span className="h-1.5 w-1.5 rounded-full bg-ember" /> {s.eyebrow}
                  </span>,
                  <h3 key="t" className="mt-4 max-w-2xl font-display text-3xl font-bold leading-[1.02] tracking-[-0.03em] text-bone sm:text-5xl md:text-6xl">
                    {s.title}
                  </h3>,
                  <p key="b" className="mt-4 max-w-xl text-sm leading-relaxed text-bone/75 md:text-base">
                    {s.body}
                  </p>,
                  <div key="s" className="mt-6 inline-flex items-center gap-4 rounded-2xl border border-line bg-ink/50 px-5 py-3.5 backdrop-blur">
                    <span className="font-display text-3xl font-bold text-bone">{s.stat.value}</span>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-smoke">{s.stat.label}</span>
                  </div>,
                ].map((node, i) => (
                  <motion.div
                    key={i}
                    variants={{
                      hidden: { opacity: 0, y: 26 },
                      show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
                      exit: { opacity: 0, y: -14, transition: { duration: 0.3 } },
                    }}
                  >
                    {node}
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2 md:bottom-10 md:right-10">
            <button
              type="button"
              onClick={() => setUserPaused((v) => !v)}
              aria-label={userPaused ? "Play slideshow" : "Pause slideshow"}
              className="grid h-11 w-11 place-items-center rounded-full border border-line bg-ink/50 text-bone backdrop-blur transition-colors hover:border-ember hover:text-ember"
            >
              {userPaused ? <Play size={14} fill="currentColor" /> : <Pause size={14} fill="currentColor" />}
            </button>
            <button
              type="button"
              onClick={() => go(active - 1)}
              aria-label="Previous frame"
              className="grid h-11 w-11 place-items-center rounded-full border border-line bg-ink/50 text-bone backdrop-blur transition-colors hover:border-ember hover:text-ember"
            >
              <ArrowLeft size={16} />
            </button>
            <button
              type="button"
              onClick={() => go(active + 1)}
              aria-label="Next frame"
              className="grid h-11 w-11 place-items-center rounded-full bg-bone text-ink transition-colors hover:bg-ember"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
