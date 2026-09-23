import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import { useCart } from "../context/CartContext";
import { LIFESTYLE_IMG } from "../utils/assets";
import { Eyebrow, FadeIn, RevealText } from "./ui";

type Benefit = {
  n: string;
  eyebrow: string;
  title: string;
  body: string;
  stat: string;
  statLabel: string;
  img: string;
};

const MACRO_WOOL =
  "https://images.pexels.com/photos/13717230/pexels-photo-13717230.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200";
const MACRO_DENIM =
  "https://images.pexels.com/photos/235525/pexels-photo-235525.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200";
const RAIN =
  "https://images.pexels.com/photos/13980607/pexels-photo-13980607.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800";

const BENEFITS: Benefit[] = [
  {
    n: "01",
    eyebrow: "Day one",
    title: "No break-in. Wear it to work tomorrow.",
    body: "Every piece is garment-washed before it reaches you — pre-softened, pre-shrunk, and ready. Straight from the box, straight into a full day.",
    stat: "0",
    statLabel: "Break-in days",
    img: MACRO_WOOL,
  },
  {
    n: "02",
    eyebrow: "Versatility",
    title: "Boardroom to trailhead. One kit.",
    body: "Quiet design that survives a client meeting and still looks right on the ridge at 6 a.m. Three or four pieces now replace a wardrobe of maybes.",
    stat: "3",
    statLabel: "Seasons covered",
    img: LIFESTYLE_IMG,
  },
  {
    n: "03",
    eyebrow: "Durability",
    title: "Built to outlast the trend cycle.",
    body: "50,000 Martindale abrasion rubs, taped seams, and a 2-year warranty. Most brands design clothes to be replaced. We design them to be handed down.",
    stat: "50K",
    statLabel: "Abrasion rubs",
    img: RAIN,
  },
  {
    n: "04",
    eyebrow: "Proof",
    title: "Tested by men who punish gear.",
    body: "Firefighters, line cooks, trail runners, night-shift nurses. 10,000+ hours of field testing went into the final spec — not a focus group and a mood board.",
    stat: "10K+",
    statLabel: "Field-test hours",
    img: MACRO_DENIM,
  },
];

function StackCard({
  b,
  i,
  total,
  progress,
}: {
  b: Benefit;
  i: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const targetScale = 1 - (total - 1 - i) * 0.045;
  const scale = useTransform(progress, [i / total, 1], [1, targetScale]);
  const brightness = useTransform(progress, [i / total, 1], [1, 0.55]);
  const filter = useTransform(brightness, (v) => `brightness(${v})`);

  return (
    <div className="sticky" style={{ top: `calc(88px + ${i * 22}px)` }}>
      <motion.article
        style={{ scale, filter, transformOrigin: "top center" }}
        className="grid min-h-[520px] overflow-hidden rounded-[2rem] border border-line bg-panel shadow-[0_-20px_80px_-40px_rgba(0,0,0,0.9)] lg:h-[68vh] lg:grid-cols-2"
      >
        <div className="flex flex-col justify-between p-8 md:p-12">
          <div className="flex items-center justify-between">
            <span className="font-display text-sm font-bold tracking-[0.3em] text-ember">{b.n}</span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-smoke">{b.eyebrow}</span>
          </div>
          <div>
            <h3 className="font-display text-3xl font-bold leading-[1.02] tracking-[-0.03em] text-bone md:text-5xl">
              {b.title}
            </h3>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-smoke md:text-base">{b.body}</p>
          </div>
          <div className="mt-8 flex items-end gap-4 border-t border-line pt-6">
            <span className="font-display text-5xl font-bold tracking-tight text-bone md:text-6xl">{b.stat}</span>
            <span className="pb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-smoke">{b.statLabel}</span>
          </div>
        </div>
        <div className="relative min-h-[260px] overflow-hidden bg-ink">
          <img src={b.img} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-panel via-transparent to-transparent lg:from-panel/90" aria-hidden />
          <div className="absolute inset-0 bg-gradient-to-t from-panel/60 to-transparent lg:hidden" aria-hidden />
        </div>
      </motion.article>
    </div>
  );
}

export default function Benefits() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const { openProductStory } = useCart();

  return (
    <section id="benefits" aria-labelledby="benefits-heading" className="relative py-24 md:py-36">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="mx-auto mb-14 max-w-3xl text-center md:mb-20">
          <FadeIn>
            <Eyebrow>Why men switch</Eyebrow>
          </FadeIn>
          <h2
            id="benefits-heading"
            className="mt-6 font-display text-4xl font-bold leading-[1.02] tracking-[-0.03em] text-bone sm:text-5xl md:text-6xl"
          >
            <RevealText parts={["One kit. ", { text: "Every arena.", className: "text-gradient" }]} delay={0.1} />
          </h2>
          <FadeIn delay={0.16}>
            <p className="mt-5 text-base leading-relaxed text-smoke md:text-lg">
              Four reasons the Atlas ends up being the only layer by the door.
            </p>
          </FadeIn>
        </div>

        <div ref={ref} className="flex flex-col gap-[10vh] pb-[16vh]">
          {BENEFITS.map((b, i) => (
            <StackCard key={b.n} b={b} i={i} total={BENEFITS.length} progress={scrollYProgress} />
          ))}
        </div>

        <FadeIn className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={() => openProductStory("atlas")}
            className="group inline-flex items-center gap-3 rounded-full border border-line bg-bone/[0.03] px-7 py-4 text-sm font-semibold text-bone backdrop-blur transition-colors hover:border-ember/50"
          >
            Scroll the full anatomy
            <ArrowRight size={16} className="text-ember transition-transform group-hover:translate-x-1" />
          </button>
        </FadeIn>
      </div>
    </section>
  );
}
