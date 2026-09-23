import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowRight, Feather, Play, Star, Wind, Zap } from "lucide-react";
import { useRef } from "react";
import { useCart } from "../context/CartContext";
import { HERO_LOOP_VIDEO, HERO_STAGE_IMG, LIFESTYLE_NIGHT_IMG } from "../utils/assets";
import { EASE, Eyebrow, Magnetic, RevealText } from "./ui";

const CHIPS = [
  { icon: Feather, label: "KovaShell™", value: "3-layer", pos: "left-[2%] top-[18%]" },
  { icon: Zap, label: "Waterproof", value: "20K mm", pos: "right-[0%] top-[38%]" },
  { icon: Wind, label: "Breathability", value: "25K g/m²", pos: "left-[6%] bottom-[12%]" },
];

const AVATARS = [
  { initials: "MT", bg: "from-sky-400 to-blue-600" },
  { initials: "DK", bg: "from-slate-400 to-slate-600" },
  { initials: "JR", bg: "from-blue-400 to-indigo-600" },
  { initials: "AL", bg: "from-stone-400 to-stone-600" },
  { initials: "SB", bg: "from-sky-300 to-blue-500" },
];

const HERO_VIDEO = HERO_LOOP_VIDEO;

export default function Hero({ ready }: { ready: boolean }) {
  const { openProductStory } = useCart();
  const ref = useRef<HTMLElement>(null);

  // mouse parallax
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 55, damping: 16 });
  const sy = useSpring(my, { stiffness: 55, damping: 16 });
  const chipX = useTransform(sx, (v) => v * -0.55);
  const chipY = useTransform(sy, (v) => v * -0.55);

  // scroll parallax
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const stageY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const stageScale = useTransform(scrollYProgress, [0, 1], [1, 0.86]);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  const show = ready ? "show" : "hidden";
  const rise = (delay: number) => ({
    hidden: { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0, transition: { duration: 1, ease: EASE, delay } },
  });

  return (
    <section
      ref={ref}
      id="top"
      aria-labelledby="hero-heading"
      className="relative overflow-hidden"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(((e.clientX - r.left) / r.width - 0.5) * 26);
        my.set(((e.clientY - r.top) / r.height - 0.5) * 18);
      }}
    >
      {/* Cinematic video backdrop */}
      <motion.div style={{ scale: videoScale }} className="absolute inset-0" aria-hidden>
        <video
          className="h-full w-full object-cover opacity-[0.28] saturate-[0.6]"
          src={HERO_VIDEO}
          poster={LIFESTYLE_NIGHT_IMG}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/60 to-ink" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/40 to-ink/70" />
      </motion.div>

      {/* Ambient background */}
      <div className="bg-blueprint absolute inset-0" aria-hidden />
      <div
        className="absolute left-1/2 top-[-20%] h-[60vh] w-[80vw] -translate-x-1/2 rounded-full bg-ember/[0.13] blur-[130px]"
        aria-hidden
      />
      <motion.div
        className="absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-ember/[0.07] blur-[100px]"
        animate={{ x: [0, 60, 0], y: [0, -40, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-5 pb-16 pt-36 md:px-8 lg:min-h-screen lg:grid-cols-12 lg:gap-6 lg:pb-10 lg:pt-28">
        {/* Copy */}
        <motion.div style={{ y: copyY, opacity: copyOpacity }} className="relative z-10 lg:col-span-6">
          <motion.div initial="hidden" animate={show} variants={rise(0.1)}>
            <Eyebrow>Atlas Storm Shell · Limited first drop</Eyebrow>
          </motion.div>

          <h1
            id="hero-heading"
            className="mt-7 font-display text-[13.5vw] font-bold leading-[0.94] tracking-[-0.035em] text-bone sm:text-7xl lg:text-[5.4rem] xl:text-[6.2rem]"
          >
            <RevealText parts={["BUILT FOR"]} animate={show} delay={0.2} stagger={0.08} />
            <br />
            <RevealText
              parts={["THE ", { text: "LONG GAME.", className: "text-gradient" }]}
              animate={show}
              delay={0.38}
              stagger={0.08}
            />
          </h1>

          <motion.p
            initial="hidden"
            animate={show}
            variants={rise(0.6)}
            className="mt-7 max-w-xl text-base leading-relaxed text-smoke md:text-lg"
          >
            Kovac fuses 3-layer membranes, storm-locked seams, and tailoring-grade
            construction into technical apparel — engineered for men who measure
            life in miles, not meetings.
          </motion.p>

          <motion.div
            initial="hidden"
            animate={show}
            variants={rise(0.74)}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Magnetic strength={0.25}>
              <button
                type="button"
                onClick={() => openProductStory("atlas")}
                className="group inline-flex items-center gap-3 rounded-full bg-ember px-8 py-4 text-sm font-semibold text-ink shadow-[0_0_50px_-10px_rgba(61, 123, 255,0.65)] transition-all duration-300 hover:shadow-[0_0_70px_-8px_rgba(61, 123, 255,0.8)]"
              >
                Shop the Atlas — $289
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </Magnetic>
            <a
              href="#keynote"
              className="group inline-flex items-center gap-3 rounded-full border border-line bg-bone/[0.03] px-7 py-4 text-sm font-semibold text-bone backdrop-blur transition-colors duration-300 hover:border-bone/30"
            >
              <span className="grid h-6 w-6 place-items-center rounded-full bg-bone/10 transition-colors group-hover:bg-ember group-hover:text-ink">
                <Play size={10} fill="currentColor" />
              </span>
              Watch a day in the shell
            </a>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={show}
            variants={rise(0.88)}
            className="mt-11 flex flex-wrap items-center gap-4"
          >
            <div className="flex -space-x-2.5">
              {AVATARS.map((a) => (
                <span
                  key={a.initials}
                  className={`grid h-9 w-9 place-items-center rounded-full border-2 border-ink bg-gradient-to-br text-[10px] font-bold text-ink ${a.bg}`}
                  aria-hidden
                >
                  {a.initials}
                </span>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1" aria-label="Rated 4.9 out of 5 stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={13} className="fill-ember text-ember" aria-hidden />
                ))}
                <span className="ml-1.5 text-sm font-semibold text-bone">4.9</span>
              </div>
              <p className="mt-0.5 text-xs text-smoke">12,400+ verified reviews from men on the move</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Product stage */}
        <motion.div style={{ y: stageY, scale: stageScale }} className="relative lg:col-span-6" aria-hidden>
          <motion.div
            initial={{ opacity: 0, scale: 0.86, rotate: -6 }}
            animate={ready ? { opacity: 1, scale: 1, rotate: 0 } : {}}
            transition={{ duration: 1.5, ease: EASE, delay: 0.3 }}
            className="relative mx-auto aspect-square w-full max-w-[640px]"
          >
            <div className="absolute inset-[7%] animate-rot rounded-full border border-dashed border-bone/15" />
            <div className="absolute inset-[16%] rounded-full border border-line" />
            <div className="absolute inset-[18%] rounded-full bg-ember/[0.16] blur-[70px]" />

            <motion.div style={{ x: sx, y: sy }} className="absolute inset-0">
              <motion.img
                src={HERO_STAGE_IMG}
                alt=""
                animate={{ y: [0, -16, 0], rotate: [0, -1.2, 0] }}
                transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
                className="h-full w-full object-cover"
                loading="eager"
              />
            </motion.div>

            {CHIPS.map((c, i) => (
              <motion.div key={c.label} style={{ x: chipX, y: chipY }} className={`absolute ${c.pos} hidden md:block`}>
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={ready ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, ease: EASE, delay: 1.1 + i * 0.16 }}
                  className="animate-float rounded-2xl glass px-4 py-3 shadow-2xl"
                  style={{ animationDelay: `${i * 1.4}s` }}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-ember/15 text-ember">
                      <c.icon size={14} />
                    </span>
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-smoke">{c.label}</p>
                      <p className="font-display text-sm font-bold text-bone">{c.value}</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}

            <p className="text-stroke pointer-events-none absolute -bottom-4 left-1/2 -translate-x-1/2 select-none font-display text-[17vw] font-bold leading-none tracking-tight sm:text-[7.5rem] lg:text-[9rem]">
              ATLAS
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : {}}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 items-center gap-3 lg:flex"
        aria-hidden
      >
        <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-smoke">Scroll</span>
        <span className="relative h-10 w-px overflow-hidden bg-bone/15">
          <motion.span
            className="absolute left-0 top-0 h-4 w-px bg-ember"
            animate={{ y: [-16, 40] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.div>
    </section>
  );
}
