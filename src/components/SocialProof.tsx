import { CountUp, FadeIn, Stagger, Item } from "./ui";

const PRESS = [
  { name: "GQ", cls: "font-display font-bold tracking-[0.28em]" },
  { name: "Esquire", cls: "font-serif italic text-2xl" },
  { name: "HYPEBEAST", cls: "font-display font-bold tracking-tight" },
  { name: "COMPLEX", cls: "font-black tracking-[0.32em]" },
  { name: "Men's Health", cls: "font-serif italic text-2xl" },
  { name: "WIRED", cls: "font-display font-bold tracking-[0.3em]" },
  { name: "Forbes", cls: "font-serif text-2xl" },
  { name: "Highsnobiety", cls: "font-display font-semibold tracking-wider" },
];

const STATS: { value: number; suffix: string; decimals?: number; label: string }[] = [
  { value: 128, suffix: "K+", label: "Pieces in the wild" },
  { value: 4.9, suffix: "/5", decimals: 1, label: "Average rating" },
  { value: 92, suffix: "%", label: "Would buy again" },
  { value: 34, suffix: "", label: "Countries shipped" },
];

export default function SocialProof() {
  return (
    <section aria-label="Press and social proof" className="relative">
      {/* Press marquee */}
      <div className="border-b border-line py-14">
        <FadeIn>
          <p className="mb-9 text-center text-[11px] font-semibold uppercase tracking-[0.3em] text-smoke">
            Worn by athletes · Rated by editors
          </p>
        </FadeIn>
        <div
          className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
          aria-hidden
        >
          <div className="flex w-max animate-marquee items-center hover:[animation-play-state:paused]">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex shrink-0 items-center gap-16 pr-16 md:gap-24 md:pr-24">
                {PRESS.map((p) => (
                  <span
                    key={p.name}
                    className={`whitespace-nowrap text-xl text-bone/30 transition-colors duration-500 hover:text-bone/80 ${p.cls}`}
                  >
                    {p.name}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Stagger className="grid grid-cols-2 border-b border-line md:grid-cols-4" gap={0.14}>
          {STATS.map((s, i) => (
            <Item
              key={s.label}
              className={`flex flex-col items-center gap-2 border-line px-6 py-12 text-center md:py-16 ${
                i % 2 === 1 ? "border-l" : ""
              } ${i >= 2 ? "border-t md:border-t-0" : ""} ${i > 0 ? "md:border-l" : ""}`}
            >
              <span className="font-display text-4xl font-bold tracking-tight text-bone md:text-5xl lg:text-6xl">
                <CountUp to={s.value} suffix={s.suffix} decimals={s.decimals ?? 0} />
              </span>
              <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-smoke">{s.label}</span>
            </Item>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
