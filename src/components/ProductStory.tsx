import {
  AnimatePresence,
  motion,
  useInView,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Feather,
  GripHorizontal,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useCart } from "../context/CartContext";
import { APPAREL_SIZES, PRODUCTS, type Product, type GarmentSize } from "../data/products";
import { PERFORMANCE, STORY_CHAPTERS, type StoryChapter } from "../data/story";
import { cn } from "../utils/cn";
import { EASE, Eyebrow, FadeIn, RevealText } from "./ui";

const scrollToChapter = (i: number) =>
  document.getElementById(`chapter-${i}`)?.scrollIntoView({ behavior: "smooth", block: "center" });

/* ------------------------- Chapter text section ------------------------- */

function ChapterSection({
  chapter,
  index,
  total,
  onActive,
}: {
  chapter: StoryChapter;
  index: number;
  total: number;
  onActive: (i: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-42% 0px -42% 0px" });

  useEffect(() => {
    if (inView) onActive(index);
  }, [inView, index, onActive]);

  return (
    <div ref={ref} id={`chapter-${index}`} className="flex min-h-[78vh] items-center lg:min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 44 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-30% 0px" }}
        transition={{ duration: 0.8, ease: EASE }}
        className="glass w-full max-w-lg rounded-3xl p-7 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] backdrop-blur-xl md:p-9"
      >
        <div className="flex items-center justify-between">
          <span className="font-display text-xs font-bold tracking-[0.28em] text-ember">CH.{chapter.step}</span>
          <span className="font-mono text-[11px] text-smoke">
            {chapter.step} / {String(total).padStart(2, "0")}
          </span>
        </div>
        <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.24em] text-smoke">{chapter.eyebrow}</p>
        <h3 className="mt-2 font-display text-2xl font-bold leading-tight tracking-tight text-bone md:text-4xl">
          {chapter.title}
        </h3>
        <p className="mt-4 text-sm leading-relaxed text-smoke md:text-[15px]">{chapter.body}</p>
        <div className="mt-6 flex items-center justify-between border-t border-line pt-5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-smoke">{chapter.specLabel}</span>
          <span className="font-display text-lg font-bold text-ember">{chapter.specValue}</span>
        </div>
      </motion.div>
    </div>
  );
}

/* --------------------------- Draggable gallery --------------------------- */

function Gallery({ chapters, productId }: { chapters: StoryChapter[]; productId: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [limit, setLimit] = useState(0);

  useEffect(() => {
    const measure = () =>
      setLimit(Math.max(0, (trackRef.current?.scrollWidth ?? 0) - (wrapRef.current?.clientWidth ?? 0)));
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [productId]);

  return (
    <div className="relative mx-auto max-w-7xl px-5 pb-16 md:px-8">
      <FadeIn className="mb-5 flex items-center justify-between">
        <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-smoke">
          <GripHorizontal size={14} className="text-ember" /> Gallery · drag to browse · tap to jump
        </p>
        <span className="font-mono text-[11px] text-smoke">{chapters.length} chapters</span>
      </FadeIn>
      <div ref={wrapRef} className="overflow-hidden">
        <motion.div
          ref={trackRef}
          drag="x"
          dragConstraints={{ left: -limit, right: 0 }}
          dragElastic={0.08}
          className="flex cursor-grab gap-4 active:cursor-grabbing"
        >
          {chapters.map((ch, i) => (
            <motion.button
              key={ch.step}
              type="button"
              onTap={() => scrollToChapter(i)}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: EASE, delay: i * 0.06 }}
              whileHover={{ y: -6 }}
              className="group relative aspect-[4/5] w-[200px] shrink-0 overflow-hidden rounded-2xl border border-line bg-panel text-left md:w-[240px]"
              aria-label={`Jump to chapter ${ch.step}: ${ch.eyebrow}`}
            >
              <img
                src={ch.img}
                alt=""
                draggable={false}
                className={cn(
                  "h-full w-full object-cover transition-transform duration-700 group-hover:scale-110",
                  ch.focusY === "top" && "object-[50%_20%]",
                  ch.focusY === "bottom" && "object-[50%_85%]"
                )}
                style={ch.scale ? { transform: `scale(${ch.scale})` } : undefined}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="font-display text-xs font-bold tracking-[0.28em] text-ember">CH.{ch.step}</p>
                <p className="mt-1 font-display text-sm font-bold text-bone">{ch.eyebrow}</p>
              </div>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

/* ------------------------------ Main page ------------------------------ */

export default function ProductStory() {
  const { storyProductId, closeProductStory, openProductStory, addItem } = useCart();

  const product: Product = PRODUCTS.find((p) => p.id === storyProductId) ?? PRODUCTS[0];
  const chapters = STORY_CHAPTERS[product.id] ?? [];
  const perf = PERFORMANCE[product.id] ?? [];

  const [activeChapter, setActiveChapter] = useState(0);
  const [selectedSize, setSelectedSize] = useState<GarmentSize>("M");
  const [selectedColor, setSelectedColor] = useState(0);
  const [added, setAdded] = useState(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: stageRef, offset: ["start start", "end end"] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["-3%", "3%"]);
  const ringRotate = useTransform(scrollYProgress, [0, 1], [0, 240]);

  useEffect(() => {
    setActiveChapter(0);
    setSelectedSize("M");
    setSelectedColor(0);
    setAdded(false);
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [product.id]);

  const heroImg = product.img;
  const active = chapters[activeChapter] ?? chapters[0];
  const others = PRODUCTS.filter((p) => p.id !== product.id);
  const fromTop = activeChapter % 2 === 0;

  const handleAdd = () => {
    if (added) return;
    setAdded(true);
    addItem(product.id, selectedSize, selectedColor, 1, true);
    window.setTimeout(() => setAdded(false), 1500);
  };

  const [first, ...rest] = product.name.split(" ");

  return (
    <div className="bg-ink text-bone">
      {/* ============================== INTRO ============================== */}
      <section className="relative flex min-h-[92vh] flex-col overflow-hidden pt-28">
        <div className="bg-blueprint absolute inset-0" aria-hidden />
        <div
          className="absolute left-1/2 top-[-15%] h-[55vh] w-[75vw] -translate-x-1/2 rounded-full blur-[130px]"
          style={{ background: product.glow, opacity: 0.5 }}
          aria-hidden
        />

        <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col px-5 md:px-8">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => closeProductStory("lineup")}
              className="group inline-flex items-center gap-2 rounded-full border border-line bg-panel/80 px-4 py-2 text-xs font-semibold text-smoke backdrop-blur transition-colors hover:border-bone/30 hover:text-bone"
            >
              <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
              Back to the Lineup
            </button>
            <span className="hidden font-mono text-[11px] uppercase tracking-[0.2em] text-smoke md:block">
              KOVAC Anatomy Series · {chapters.length} chapters
            </span>
          </div>

          <div className="grid flex-1 grid-cols-1 items-center gap-10 py-10 lg:grid-cols-12">
            <div className="relative z-10 lg:col-span-6">
              <FadeIn>
                <Eyebrow>{product.subtitle}</Eyebrow>
              </FadeIn>
              <h1 className="mt-6 font-display text-[13vw] font-bold leading-[0.94] tracking-[-0.035em] sm:text-6xl lg:text-7xl xl:text-[5.2rem]">
                <RevealText
                  parts={[first + " ", { text: rest.join(" "), className: "text-gradient" }]}
                  delay={0.1}
                  stagger={0.1}
                />
              </h1>
              <FadeIn delay={0.2}>
                <p className="mt-5 max-w-lg text-base leading-relaxed text-smoke md:text-lg">{product.description}</p>
              </FadeIn>

              <FadeIn delay={0.28} className="mt-8 flex flex-wrap gap-2.5">
                {[product.specs.weight, product.specs.drop, product.specs.terrain].map((s) => (
                  <span
                    key={s}
                    className="glass rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-bone"
                  >
                    {s}
                  </span>
                ))}
              </FadeIn>

              <FadeIn delay={0.36} className="mt-9 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => scrollToChapter(0)}
                  className="group inline-flex items-center gap-3 rounded-full bg-bone px-7 py-4 text-sm font-semibold text-ink transition-colors hover:bg-ember"
                >
                  Begin the anatomy
                  <ArrowRight size={16} className="rotate-90 transition-transform group-hover:translate-y-1" />
                </button>
                <button
                  type="button"
                  onClick={() => addItem(product.id, "M", 0, 1, true)}
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-bone/[0.03] px-6 py-4 text-sm font-semibold text-bone backdrop-blur transition-colors hover:border-ember/50"
                >
                  <ShoppingBag size={15} /> Quick add · ${product.price}
                </button>
              </FadeIn>
            </div>

            {/* Hero visual stage */}
            <div className="relative lg:col-span-6" aria-hidden>
              <motion.div
                initial={{ opacity: 0, scale: 0.88, rotate: -5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1.2, ease: EASE, delay: 0.2 }}
                className="relative mx-auto aspect-square w-full max-w-[560px]"
              >
                <div className="absolute inset-[8%] animate-rot rounded-full border border-dashed border-bone/15" />
                <div className="absolute inset-[18%] rounded-full blur-[70px]" style={{ background: product.glow, opacity: 0.55 }} />
                <motion.img
                  src={heroImg}
                  alt=""
                  animate={{ y: [0, -14, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="h-full w-full object-cover"
                />
                <p className="text-stroke pointer-events-none absolute -bottom-2 left-1/2 -translate-x-1/2 select-none font-display text-[18vw] font-bold leading-none tracking-tight sm:text-[7rem] lg:text-[8.5rem]">
                  <span className="align-top text-[0.45em]">$</span>
                  {product.price}
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery strip */}
      <Gallery chapters={chapters} productId={product.id} />

      {/* ===================== STICKY ANATOMY SCROLL ===================== */}
      <section ref={stageRef} aria-label={`${product.name} anatomy chapters`} className="relative border-t border-line">
        <div className="lg:grid lg:grid-cols-2">
          {/* Sticky image stage */}
          <div className="sticky top-[72px] z-0 h-[52vh] overflow-hidden sm:h-[46vh] lg:top-0 lg:h-screen">
            <div className="relative h-full w-full bg-ink">
              {/* Ghost chapter number */}
              <AnimatePresence mode="wait">
                <motion.span
                  key={activeChapter}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.55, ease: EASE }}
                  className="text-stroke pointer-events-none absolute left-1/2 top-8 z-10 -translate-x-1/2 select-none font-display text-[26vw] font-bold leading-none lg:left-auto lg:right-6 lg:top-6 lg:translate-x-0 lg:text-[13rem]"
                  aria-hidden
                >
                  {active.step}
                </motion.span>
              </AnimatePresence>

              {/* Rotating ring + glow (hidden on full-bleed chapters) */}
              <motion.div
                style={{ rotate: ringRotate, opacity: active.full ? 0 : 1 }}
                className="absolute left-1/2 top-1/2 aspect-square w-[74%] max-w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-bone/15 transition-opacity duration-700"
                aria-hidden
              />
              <div
                className="absolute left-1/2 top-1/2 aspect-square w-[56%] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[80px] transition-opacity duration-700"
                style={{ background: product.glow, opacity: active.full ? 0 : 0.5 }}
                aria-hidden
              />

              {/* Image stack — shutter-wipe pic-to-pic transitions */}
              <motion.div style={{ y: parallaxY }} className="absolute inset-0">
                <AnimatePresence mode="sync">
                  <motion.div
                    key={`${product.id}-${activeChapter}`}
                    initial={{
                      clipPath: fromTop ? "inset(0 0 100% 0)" : "inset(100% 0 0 0)",
                      scale: (active.scale ?? 1) * 1.08,
                    }}
                    animate={{ clipPath: "inset(0 0 0% 0)", scale: active.scale ?? 1 }}
                    exit={{ opacity: 0, scale: (active.scale ?? 1) * 0.98, filter: "blur(8px)" }}
                    transition={{
                      clipPath: { duration: 0.9, ease: EASE },
                      scale: { duration: 1.2, ease: EASE },
                      opacity: { duration: 0.5 },
                      filter: { duration: 0.5 },
                    }}
                    className="absolute inset-0"
                  >
                    <img
                      src={active.img}
                      alt={active.imgAlt}
                      className={cn(
                        "h-full w-full object-cover",
                        active.full ? "opacity-90" : "opacity-100",
                        active.focusY === "top" && "object-[50%_18%]",
                        active.focusY === "bottom" && "object-[50%_85%]"
                      )}
                    />
                    {active.full && (
                      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-ink/40" aria-hidden />
                    )}
                  </motion.div>
                </AnimatePresence>
              </motion.div>

              {/* Chapter HUD */}
              <div className="absolute bottom-5 left-1/2 z-10 -translate-x-1/2 lg:bottom-8 lg:left-10 lg:translate-x-0">
                <div className="glass flex items-center gap-3 rounded-full px-4 py-2">
                  <Feather size={13} className="text-ember" aria-hidden />
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={activeChapter}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.35 }}
                      className="whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.2em] text-bone"
                    >
                      {active.specLabel} · {active.specValue}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>

              {/* Filmstrip navigator (desktop) */}
              <div className="absolute bottom-8 right-8 z-20 hidden items-end gap-2 lg:flex">
                {chapters.map((ch, i) => (
                  <button
                    key={ch.step}
                    type="button"
                    onClick={() => scrollToChapter(i)}
                    aria-label={`Jump to chapter ${ch.step}: ${ch.eyebrow}`}
                    aria-current={activeChapter === i}
                    className={cn(
                      "relative overflow-hidden rounded-lg border bg-panel transition-all duration-500",
                      activeChapter === i
                        ? "h-16 w-12 border-ember shadow-[0_0_24px_-6px_rgba(61, 123, 255,0.8)]"
                        : "h-12 w-9 border-line opacity-60 hover:opacity-100"
                    )}
                  >
                    <img
                      src={ch.img}
                      alt=""
                      className={cn("h-full w-full object-cover", !ch.full )}
                    />
                    <span className="absolute bottom-0.5 left-1 font-mono text-[8px] font-bold text-bone">{ch.step}</span>
                  </button>
                ))}
              </div>

              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink to-transparent lg:hidden" aria-hidden />
            </div>
          </div>

          {/* Scrolling chapters */}
          <div className="relative z-10 -mt-[6vh] px-5 pb-10 md:px-10 lg:mt-0 lg:px-14">
            {chapters.map((ch, i) => (
              <ChapterSection key={ch.step} chapter={ch} index={i} total={chapters.length} onActive={setActiveChapter} />
            ))}
          </div>
        </div>
      </section>

      {/* ====================== PERFORMANCE + COMPARISON ====================== */}
      <section aria-label="Performance profile" className="relative border-t border-line py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-5 md:px-8 lg:grid-cols-12">
          {/* Meters */}
          <FadeIn className="lg:col-span-5">
            <div className="h-full rounded-3xl border border-line bg-panel p-7 md:p-9">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-ember">Performance profile</p>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-bone">Lab numbers, plain English.</h2>
              <div className="mt-8 space-y-6">
                {perf.map((m, i) => (
                  <div key={m.label}>
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm font-semibold text-bone">{m.label}</span>
                      <span className="font-display text-lg font-bold text-bone">
                        {m.value}
                        <span className="text-xs text-smoke">/100</span>
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink">
                      <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: m.value / 100 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 1.3, ease: EASE, delay: 0.1 + i * 0.08 }}
                        className="h-full origin-left rounded-full bg-gradient-to-r from-ember-2 to-ember"
                      />
                    </div>
                    <p className="mt-1.5 text-[11px] text-smoke">{m.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Comparison */}
          <FadeIn delay={0.1} className="lg:col-span-7">
            <div className="h-full overflow-hidden rounded-3xl border border-line bg-panel">
              <div className="flex items-center justify-between px-7 pt-7 md:px-9">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-ember">How it stacks up</p>
                  <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-bone">Across the lineup.</h2>
                </div>
              </div>
              <div className="no-scrollbar mt-6 overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead>
                    <tr className="border-y border-line text-[10px] uppercase tracking-[0.2em] text-smoke">
                      <th className="px-7 py-3 font-semibold md:px-9">Spec</th>
                      {[product, ...others].map((p) => (
                        <th
                          key={p.id}
                          className={cn("px-4 py-3 font-semibold", p.id === product.id && "bg-ember/10 text-ember")}
                        >
                          {p.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(
                      [
                        ["Price", (p: Product) => `$${p.price}`],
                        ["Weight", (p: Product) => p.specs.weight.split(" (")[0]],
                        ["Fit", (p: Product) => p.specs.drop],
                        ["Plate", (p: Product) => p.specs.plate],
                        ["Upper", (p: Product) => p.specs.upper],
                        ["Terrain", (p: Product) => p.specs.terrain],
                      ] as [string, (p: Product) => string][]
                    ).map(([label, get]) => (
                      <tr key={label} className="border-b border-line last:border-0">
                        <td className="px-7 py-3.5 text-xs font-semibold uppercase tracking-wider text-smoke md:px-9">{label}</td>
                        {[product, ...others].map((p) => (
                          <td
                            key={p.id}
                            className={cn(
                              "px-4 py-3.5 text-[13px]",
                              p.id === product.id ? "bg-ember/10 font-semibold text-bone" : "text-bone/70"
                            )}
                          >
                            {get(p)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* =========================== FINALE / CTA =========================== */}
      <section aria-label="Configure and buy" className="relative border-t border-line py-20 md:py-28">
        <div
          className="absolute left-1/2 top-0 h-72 w-[60vw] -translate-x-1/2 rounded-full blur-[130px]"
          style={{ background: product.glow, opacity: 0.4 }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-7xl px-5 md:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <FadeIn>
                <Eyebrow>Make it yours</Eyebrow>
              </FadeIn>
              <h2 className="mt-6 font-display text-4xl font-bold leading-[1.02] tracking-[-0.03em] sm:text-5xl">
                <RevealText parts={["Locked. Loaded. ", { text: "Yours.", className: "text-gradient" }]} delay={0.1} />
              </h2>
              <FadeIn delay={0.14}>
                <p className="mt-5 max-w-md text-sm leading-relaxed text-smoke md:text-base">
                  {product.name} ships in 24h with free express air, a prepaid return label, and the full 30-day wear trial.
                </p>
              </FadeIn>
              <FadeIn delay={0.2} className="mt-8 space-y-3.5">
                {[
                  { icon: Truck, text: "Free express air — 2–3 business days" },
                  { icon: RotateCcw, text: "30-day outdoor trial, prepaid returns" },
                  { icon: ShieldCheck, text: "2-year structural warranty included" },
                ].map((f) => (
                  <div key={f.text} className="flex items-center gap-3 text-sm text-bone/85">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-ember/12 text-ember ring-1 ring-ember/25">
                      <f.icon size={15} />
                    </span>
                    {f.text}
                  </div>
                ))}
              </FadeIn>
            </div>

            <div className="lg:col-span-7">
              <FadeIn delay={0.1}>
                <div className="rounded-3xl border border-line bg-panel p-6 md:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-ember">{product.subtitle}</p>
                      <p className="mt-1 font-display text-2xl font-bold text-bone">{product.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-3xl font-bold text-bone">${product.price}</p>
                      {product.compare && <p className="text-xs text-smoke line-through">${product.compare}</p>}
                    </div>
                  </div>

                  <div className="mt-7">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold uppercase tracking-wider text-smoke">Colorway</span>
                      <span className="font-medium text-bone">{product.colorways[selectedColor]?.name}</span>
                    </div>
                    <div className="mt-2.5 flex flex-wrap items-center gap-2">
                      {product.colorways.map((cw, i) => (
                        <button
                          key={cw.name}
                          type="button"
                          onClick={() => setSelectedColor(i)}
                          aria-pressed={selectedColor === i}
                          className={cn(
                            "flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all",
                            selectedColor === i
                              ? "border-ember bg-ember/15 text-bone ring-1 ring-ember"
                              : "border-line bg-ink/60 text-smoke hover:border-bone/30 hover:text-bone"
                          )}
                        >
                          <span className="h-3.5 w-3.5 rounded-full border border-white/20" style={{ backgroundColor: cw.hex }} />
                          {cw.name.split("/")[0].trim()}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold uppercase tracking-wider text-smoke">Size</span>
                      <span className="font-display font-bold text-ember">{selectedSize} selected</span>
                    </div>
                    <div className="mt-2.5 grid grid-cols-6 gap-1.5 sm:grid-cols-12">
                      {APPAREL_SIZES.map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => setSelectedSize(sz)}
                          aria-pressed={selectedSize === sz}
                          className={cn(
                            "rounded-xl border py-2.5 font-display text-[11px] font-bold transition-all",
                            selectedSize === sz
                              ? "border-ember bg-ember text-ink shadow-[0_0_22px_-6px_rgba(61, 123, 255,0.8)]"
                              : "border-line bg-ink/60 text-bone hover:border-bone/35"
                          )}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAdd}
                    className={cn(
                      "mt-8 flex w-full items-center justify-center gap-2.5 rounded-full py-4 font-display text-sm font-bold transition-all duration-300",
                      added
                        ? "bg-emerald-400 text-ink"
                        : "bg-ember text-ink shadow-[0_0_50px_-12px_rgba(61, 123, 255,0.8)] hover:bg-ember-2"
                    )}
                  >
                    {added ? (
                      <>
                        <Check size={17} strokeWidth={3} /> Added to Bag — Size {selectedSize}
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={16} /> Add to Bag · Size {selectedSize} — ${product.price}
                      </>
                    )}
                  </button>
                </div>
              </FadeIn>
            </div>
          </div>

          {/* Related */}
          <div className="mt-20">
            <FadeIn>
              <div className="flex items-center justify-between">
                <h3 className="font-display text-2xl font-bold tracking-tight text-bone">Next chapter</h3>
                <button
                  type="button"
                  onClick={() => closeProductStory("lineup")}
                  className="group inline-flex items-center gap-1.5 text-xs font-semibold text-ember"
                >
                  View all
                  <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </FadeIn>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {others.map((o) => (
                <FadeIn key={o.id}>
                  <button
                    type="button"
                    onClick={() => openProductStory(o.id)}
                    className="group relative flex w-full items-center gap-4 overflow-hidden rounded-3xl border border-line bg-panel p-5 text-left transition-all duration-400 hover:-translate-y-1 hover:border-ember/40"
                  >
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-ink">
                      <img
                        src={o.img}
                        alt={o.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-ember">{o.subtitle}</p>
                      <p className="truncate font-display text-base font-bold text-bone">
                        {o.name} — ${o.price}
                      </p>
                      <p className="truncate text-xs text-smoke">{o.blurb}</p>
                    </div>
                    <ArrowUpRight size={18} className="shrink-0 text-smoke transition-all duration-300 group-hover:rotate-45 group-hover:text-ember" />
                  </button>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
