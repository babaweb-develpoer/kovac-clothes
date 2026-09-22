import { BadgeCheck, Star } from "lucide-react";
import { SectionHeading, Stagger, Item } from "./ui";

const QUOTES = [
  {
    quote:
      "Six months of Boston winters in the Atlas and I've stopped checking the forecast. Bone dry, still looks new, and the hood finally fits a grown man's head.",
    name: "Marcus T.",
    role: "Founder, logistics",
    grad: "from-sky-400 to-blue-600",
  },
  {
    quote:
      "Twelve-hour ER shifts used to mean a second change of clothes. The Atlas layers over everything and scrubs clean in minutes. It's the only shell I own now.",
    name: "Devon A.",
    role: "ER nurse, Chicago",
    grad: "from-slate-400 to-slate-600",
  },
  {
    quote:
      "Took the Ridge through a Scottish-style squall on the ridge line — sideways rain, wind you can lean on. Not a drop inside. The pit zips saved the descent.",
    name: "Andre K.",
    role: "Trail guide",
    grad: "from-blue-500 to-indigo-600",
  },
  {
    quote:
      "One layer for the airport, the client meeting, and the bar after. The Mercer reads sharp over a shirt and shrugs off a carry-on's abuse. It just works.",
    name: "Chris L.",
    role: "Consultant, 200k miles/yr",
    grad: "from-stone-400 to-stone-600",
  },
  {
    quote:
      "Bought the Midnight hoodie as a throw-on. It's become my uniform — studio, gym, flights. 480 gsm that drapes instead of tents. Half the studio wears one now.",
    name: "Sam R.",
    role: "Studio owner",
    grad: "from-sky-300 to-blue-500",
  },
  {
    quote:
      "The canvas on the Mercer is the real deal — creases like an old chore coat, cleans up like day one. Ordered the slate herringbone the same week.",
    name: "Leo M.",
    role: "Daily commuter, Brooklyn",
    grad: "from-blue-400 to-indigo-700",
  },
];

export default function Testimonials() {
  return (
    <section id="reviews" aria-labelledby="reviews-heading" className="relative py-24 md:py-36">
      <div
        className="absolute right-0 top-24 h-96 w-[40vw] rounded-full bg-ember/[0.05] blur-[130px]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <div id="reviews-heading">
          <SectionHeading
            eyebrow="Verified reviews"
            parts={["4.9 stars. ", { text: "12,400+ men.", className: "text-gradient" }]}
            sub="Unedited feedback from guys who put serious wear on their pieces."
          />
        </div>

        <Stagger className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3" gap={0.09}>
          {QUOTES.map((q) => (
            <Item key={q.name}>
              <figure className="group flex h-full flex-col rounded-3xl border border-line bg-panel p-7 transition-all duration-500 hover:-translate-y-1.5 hover:border-ember/35 hover:shadow-[0_24px_60px_-30px_rgba(61, 123, 255,0.25)]">
                <div className="flex items-center gap-1" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} className="fill-ember text-ember" aria-hidden />
                  ))}
                </div>
                <blockquote className="mt-5 flex-1 text-[15px] leading-relaxed text-bone/85">
                  “{q.quote}”
                </blockquote>
                <figcaption className="mt-7 flex items-center gap-3.5 border-t border-line pt-5">
                  <span
                    className={`grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br font-display text-xs font-bold text-ink ${q.grad}`}
                    aria-hidden
                  >
                    {q.name
                      .split(" ")
                      .map((w) => w[0])
                      .join("")}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-bone">{q.name}</p>
                    <p className="truncate text-xs text-smoke">{q.role}</p>
                  </div>
                  <span className="ml-auto inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-ember">
                    <BadgeCheck size={14} aria-hidden /> Verified
                  </span>
                </figcaption>
              </figure>
            </Item>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
