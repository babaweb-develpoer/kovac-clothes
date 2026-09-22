import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ArrowRight, ArrowUpRight, Plus } from "lucide-react";
import { useRef, useState } from "react";
import { useCart } from "../context/CartContext";
import { PRODUCTS, type Product } from "../data/products";
import { cn } from "../utils/cn";
import { Eyebrow, FadeIn, useMediaQuery } from "./ui";

const N = PRODUCTS.length;

/* ------------------------------- Desktop panel ------------------------------ */

function Panel({
  p,
  i,
  progress,
}: {
  p: Product;
  i: number;
  progress: MotionValue<number>;
}) {
  const { openProductStory, addItem } = useCart();
  const start = (i - 1) / (N - 1);
  const mid = i / (N - 1);
  const end = (i + 1) / (N - 1);

  const imgX = useTransform(progress, [start, mid, end], ["26%", "0%", "-26%"]);
  const imgRotate = useTransform(progress, [start, mid, end], [10, 0, -10]);
  const imgScale = useTransform(progress, [start, mid, end], [0.82, 1, 0.82]);
  const ghostX = useTransform(progress, [start, mid, end], ["45%", "0%", "-45%"]);
  const textY = useTransform(progress, [start, mid, end], [60, 0, -60]);
  const textOpacity = useTransform(progress, [start, mid - 0.12, mid, mid + 0.12, end], [0, 1, 1, 1, 0]);

  return (
    <div className="relative flex h-full w-screen shrink-0 items-center overflow-hidden">
      {/* ambient glow */}
      <div
        className="absolute right-[10%] top-1/2 h-[70vh] w-[45vw] -translate-y-1/2 rounded-full blur-[140px]"
        style={{ background: p.glow, opacity: 0.55 }}
        aria-hidden
      />
      {/* ghost name */}
      <motion.p
        style={{ x: ghostX }}
        className="text-stroke pointer-events-none absolute bottom-[6vh] left-[4vw] select-none whitespace-nowrap font-display text-[16vw] font-bold leading-none tracking-[-0.04em]"
        aria-hidden
      >
        {p.name.toUpperCase()}
      </motion.p>

      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-12 items-center gap-6 px-8">
        {/* Copy */}
        <motion.div style={{ y: textY, opacity: textOpacity }} className="col-span-5">
          <div className="flex items-center gap-4">
            <span className="font-display text-sm font-bold tracking-[0.3em] text-ember">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="h-px w-12 bg-bone/20" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-smoke">
              {p.subtitle}
            </span>
          </div>
          <h3 className="mt-6 font-display text-6xl font-bold leading-[0.95] tracking-[-0.04em] text-bone xl:text-7xl">
            {p.name}
          </h3>
          <p className="mt-5 max-w-md text-base leading-relaxed text-smoke">
            {p.description}
          </p>

          <div className="mt-7 flex flex-wrap gap-2">
            {[p.specs.weight, p.specs.plate, p.specs.terrain].map((s) => (
              <span
                key={s}
                className="rounded-full border border-line bg-bone/[0.04] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-bone/80"
              >
                {s}
              </span>
            ))}
          </div>

          <div className="mt-9 flex items-center gap-4">
            <button
              type="button"
              onClick={() => openProductStory(p.id)}
              className="group inline-flex items-center gap-3 rounded-full bg-bone px-7 py-4 text-sm font-semibold text-ink transition-colors duration-300 hover:bg-ember"
            >
              Explore the anatomy
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <button
              type="button"
              onClick={() => addItem(p.id, "M", 0, 1, true)}
              className="group inline-flex items-center gap-2 rounded-full border border-line bg-bone/[0.03] px-6 py-4 text-sm font-semibold text-bone backdrop-blur transition-colors hover:border-ember/50"
            >
              <Plus size={15} /> Quick add · ${p.price}
            </button>
          </div>
        </motion.div>

        {/* Image */}
        <div className="col-span-7 flex items-center justify-center">
          <motion.button
            type="button"
            onClick={() => openProductStory(p.id)}
            style={{ x: imgX, rotate: imgRotate, scale: imgScale }}
            className="relative aspect-square w-full max-w-[640px]"
            aria-label={`Explore ${p.name}`}
          >
            <div className="absolute inset-[9%] animate-rot rounded-full border border-dashed border-bone/15" />
            <img
              src={p.img}
              alt={` — men's technical jacket`}
              loading="lazy"
              draggable={false}
              className="h-full w-full object-cover"
            />
            <span className="absolute bottom-[10%] right-[6%] flex items-center gap-2 rounded-full border border-line bg-ink/60 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-bone backdrop-blur">
              ${p.price}
              {p.compare && <span className="text-smoke line-through">${p.compare}</span>}
              <ArrowUpRight size={13} className="text-ember" />
            </span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}

function DesktopTrack() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 1], ["0vw", `-${(N - 1) * 100}vw`]);
  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) =>
    setActive(Math.min(N - 1, Math.max(0, Math.round(v * (N - 1)))))
  );

  const jumpTo = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const top = el.offsetTop + (i / (N - 1)) * (el.offsetHeight - window.innerHeight);
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <section
      ref={ref}
      id="collection"
      aria-label="The collection"
      style={{ height: `${N * 100}vh` }}
      className="relative"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* header */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between px-8 pt-24">
          <div className="pointer-events-auto">
            <Eyebrow>The Collection</Eyebrow>
          </div>
          <div className="flex items-center gap-6">
            <nav aria-label="Collection slides" className="pointer-events-auto flex items-center gap-1">
              {PRODUCTS.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => jumpTo(i)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors",
                    active === i ? "bg-bone text-ink" : "text-smoke hover:text-bone"
                  )}
                >
                  {p.name}
                </button>
              ))}
            </nav>
            <span className="font-mono text-xs text-smoke">
              <span className="text-bone">{String(active + 1).padStart(2, "0")}</span> / {String(N).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* progress line */}
        <div className="absolute inset-x-8 top-[7.5rem] z-20 h-px bg-bone/10">
          <motion.div style={{ scaleX: scrollYProgress }} className="h-full origin-left bg-ember" />
        </div>

        {/* track */}
        <motion.div style={{ x }} className="flex h-full will-change-transform">
          {PRODUCTS.map((p, i) => (
            <Panel key={p.id} p={p} i={i} progress={scrollYProgress} />
          ))}
        </motion.div>

        {/* scroll hint */}
        <div className="pointer-events-none absolute bottom-8 right-8 z-20 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-smoke">
          Keep scrolling
          <span className="relative h-px w-14 overflow-hidden bg-bone/15">
            <motion.span
              className="absolute left-0 top-0 h-px w-5 bg-ember"
              animate={{ x: [-20, 60] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </span>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ Mobile carousel ----------------------------- */

function MobileCarousel() {
  const { openProductStory, addItem } = useCart();
  const [active, setActive] = useState(0);
  const scroller = useRef<HTMLDivElement>(null);

  return (
    <section id="collection" aria-label="The collection" className="relative overflow-hidden py-20">
      <div className="px-5">
        <FadeIn>
          <Eyebrow>The Collection</Eyebrow>
        </FadeIn>
        <FadeIn delay={0.08}>
          <h2 className="mt-5 font-display text-4xl font-bold leading-[1.02] tracking-[-0.03em] text-bone">
            Four pieces. <span className="text-gradient">Swipe through.</span>
          </h2>
        </FadeIn>
      </div>

      <div
        ref={scroller}
        onScroll={(e) => {
          const el = e.currentTarget;
          setActive(Math.round(el.scrollLeft / (el.clientWidth * 0.86)));
        }}
        className="no-scrollbar mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4"
      >
        {PRODUCTS.map((p, i) => (
          <article
            key={p.id}
            className="relative w-[86vw] shrink-0 snap-center overflow-hidden rounded-[2rem] border border-line bg-panel"
          >
            <div
              className="absolute left-1/2 top-[28%] h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[70px]"
              style={{ background: p.glow, opacity: 0.6 }}
              aria-hidden
            />
            <button
              type="button"
              onClick={() => openProductStory(p.id)}
              className="relative block aspect-[4/3] w-full"
              aria-label={`Explore ${p.name}`}
            >
              <img
                src={p.img}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover"
              />
              <span className="absolute left-4 top-4 font-display text-xs font-bold tracking-[0.3em] text-ember">
                {String(i + 1).padStart(2, "0")}
              </span>
            </button>
            <div className="relative p-6 pt-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-ember">{p.subtitle}</p>
              <h3 className="mt-1 font-display text-3xl font-bold tracking-tight text-bone">{p.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-smoke">{p.blurb}</p>
              <div className="mt-5 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openProductStory(p.id)}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-bone py-3.5 text-xs font-bold text-ink"
                >
                  Explore anatomy <ArrowRight size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => addItem(p.id, "M", 0, 1, true)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-3.5 text-xs font-bold text-bone"
                >
                  <Plus size={14} /> ${p.price}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-2 flex items-center justify-center gap-2" aria-hidden>
        {PRODUCTS.map((p, i) => (
          <span
            key={p.id}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              active === i ? "w-8 bg-ember" : "w-1.5 bg-bone/20"
            )}
          />
        ))}
      </div>
    </section>
  );
}

export default function Collection() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  return isDesktop ? <DesktopTrack /> : <MobileCarousel />;
}
