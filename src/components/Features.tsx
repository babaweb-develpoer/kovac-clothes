import { ArrowUpRight, Feather, ShieldCheck, Wind, Zap } from "lucide-react";
import { SectionHeading, Stagger, Item } from "./ui";
import type { LucideIcon } from "lucide-react";

type Feature = {
  icon: LucideIcon;
  title: string;
  body: string;
  stat: string;
};

const FEATURES: Feature[] = [
  {
    icon: Zap,
    title: "KovaShell™ 3-Layer",
    body: "A hydrophilic membrane sandwiched between a durable face and a soft tricot backer. Rain stays out at 20,000 mm of pressure — while sweat still escapes.",
    stat: "20,000 mm waterproof",
  },
  {
    icon: Feather,
    title: "Featherlight Systems",
    body: "Every gram is audited. A storm shell at 860 g, a heavyweight hoodie at 610 g — protection and warmth without the bulk you'd expect.",
    stat: "540–860 g per piece",
  },
  {
    icon: Wind,
    title: "Breathable By Design",
    body: "25,000 g/m²/24h moisture-vapor transmission rate means you climb stairs, sprint for trains, and never show up steamed.",
    stat: "25K g/m²/24h breath",
  },
  {
    icon: ShieldCheck,
    title: "StormLock™ Construction",
    body: "Bonded seams, 20 mm seam taping, and storm plackets behind every AquaGuard zip. Where most outerwear leaks by mile one, ours is dry at year two.",
    stat: "Fully sealed",
  },
];

const MACRO =
  "https://images.pexels.com/photos/13717230/pexels-photo-13717230.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200";

export default function Features() {
  return (
    <section id="technology" aria-labelledby="tech-heading" className="relative py-24 md:py-36">
      <div
        className="absolute left-1/2 top-0 h-96 w-[60vw] -translate-x-1/2 rounded-full bg-ember/[0.05] blur-[120px]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <div id="tech-heading">
          <SectionHeading
            eyebrow="Material science"
            parts={["Lab-built. ", { text: "Street-proven.", className: "text-gradient" }]}
            sub="Every Kovac piece is a system: membrane, fabric, seams, and hardware tuned together — not bolted together."
          />
        </div>

        <Stagger className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
          {/* Large media card */}
          <Item className="group relative overflow-hidden rounded-3xl border border-line bg-panel md:col-span-2 md:row-span-1">
            <img
              src={MACRO}
              alt="Macro photograph of KovaWeave technical textile with cobalt stitch detailing"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover opacity-60 transition-all duration-700 group-hover:scale-105 group-hover:opacity-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-transparent" aria-hidden />
            <div className="relative flex h-full min-h-[340px] flex-col justify-end p-8 md:min-h-[380px] md:p-10">
              <span className="mb-auto inline-flex w-fit items-center gap-2 rounded-full border border-line bg-ink/60 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-bone backdrop-blur">
                KovaWeave™ Textiles
              </span>
              <h3 className="mt-6 font-display text-2xl font-bold tracking-tight text-bone md:text-3xl">
                Fabric that works while you sleep.
              </h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-bone/70 md:text-base">
                Dyed, washed, and tested in Portland. Brushed faces, looped
                backs, taped seams — every square inch has a reason to exist.
              </p>
            </div>
            <ArrowUpRight
              size={20}
              className="absolute right-6 top-6 text-bone/40 transition-all duration-500 group-hover:rotate-45 group-hover:text-ember"
              aria-hidden
            />
          </Item>

          {/* Standard cards */}
          {FEATURES.map((f) => (
            <Item
              key={f.title}
              className="group relative overflow-hidden rounded-3xl border border-line bg-panel p-8 transition-colors duration-500 hover:border-ember/40"
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(120% 90% at 50% 0%, rgba(61, 123, 255,0.10), transparent 60%)",
                }}
                aria-hidden
              />
              <span className="relative grid h-12 w-12 place-items-center rounded-2xl bg-ember/12 text-ember ring-1 ring-ember/25 transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-105">
                <f.icon size={20} />
              </span>
              <h3 className="relative mt-6 font-display text-xl font-bold tracking-tight text-bone">
                {f.title}
              </h3>
              <p className="relative mt-3 text-sm leading-relaxed text-smoke">{f.body}</p>
              <p className="relative mt-6 inline-flex items-center gap-2 border-t border-line pt-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-ember">
                {f.stat}
              </p>
            </Item>
          ))}

          {/* Assurance bar */}
          <Item className="md:col-span-3">
            <div className="flex flex-col items-center justify-between gap-6 rounded-3xl border border-line bg-gradient-to-r from-panel via-coal to-panel px-8 py-8 md:flex-row md:px-12">
              <div className="flex items-center gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-ember/12 text-ember ring-1 ring-ember/25">
                  <ShieldCheck size={22} />
                </span>
                <p className="font-display text-lg font-bold tracking-tight text-bone md:text-xl">
                  Backed to the last stitch.
                </p>
              </div>
              <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm text-smoke">
                {["30-day wear trial", "2-year warranty", "Free returns, no questions"].map((t) => (
                  <li key={t} className="flex items-center gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-ember" aria-hidden />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </Item>
        </Stagger>
      </div>
    </section>
  );
}
