import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Flame } from "lucide-react";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { cn } from "../utils/cn";
import { EASE, SectionHeading, Stagger, Item } from "./ui";

const TIERS = [
  {
    id: "mercer",
    line: "Essentials",
    name: "Mercer Overshirt",
    price: 189,
    blurb: "The bone-canvas anchor piece.",
    features: [
      "12 oz garment-washed canvas",
      "Corozo buttons, tailored cut",
      "Shirt or light jacket — your call",
      "Free express shipping",
      "30-day wear trial",
    ],
    featured: false,
    cta: "Get Mercer",
  },
  {
    id: "atlas",
    line: "Signature",
    name: "Atlas Storm Shell",
    price: 289,
    blurb: "The storm-proof flagship.",
    features: [
      "KovaShell™ 3-layer · 20K mm",
      "StormLock™ taped seams",
      "25K g/m² breathability · 860 g",
      "Priority express shipping",
      "30-day trial + 2-year warranty",
    ],
    featured: true,
    cta: "Get Atlas",
  },
  {
    id: "ridge",
    line: "Limited",
    name: "Ridge Parka LTD",
    price: 329,
    blurb: "Numbered alpine edition.",
    features: [
      "Everything in Signature",
      "1 of 500 — individually numbered",
      "Kevlar yoke + 40D ripstop",
      "Numbered drop box + care kit",
      "Early access to future drops",
    ],
    featured: false,
    cta: "Get Ridge",
  },
];

export default function Pricing() {
  const { addItem, applyPromo } = useCart();
  const [duo, setDuo] = useState(false);

  const handleSelectTier = (productId: string) => {
    if (duo) {
      addItem(productId, "M", 0, 2, true);
      applyPromo("FIRST15");
    } else {
      addItem(productId, "M", 0, 1, true);
    }
  };

  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      className="relative py-24 md:py-36"
    >
      <div
        className="absolute left-1/2 top-1/2 h-[50vh] w-[70vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember/[0.06] blur-[140px]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <div id="pricing-heading">
          <SectionHeading
            eyebrow="Pricing"
            parts={["Choose your ", { text: "run.", className: "text-gradient" }]}
            sub="Every piece ships free with the 30-day wear trial. Wear it in the rain, the office, the ridge — return it if it doesn't earn its place."
          />
        </div>

        {/* Pack toggle */}
        <div className="mb-12 flex justify-center">
          <div
            role="group"
            aria-label="Purchase type"
            className="relative inline-flex rounded-full border border-line bg-panel p-1.5"
          >
            {(["Single piece", "2-Pack"] as const).map((label, i) => {
              const active = duo === (i === 1);
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => setDuo(i === 1)}
                  aria-pressed={active}
                  className={cn(
                    "relative rounded-full px-6 py-2.5 text-[13px] font-semibold transition-colors duration-300",
                    active ? "text-ink" : "text-smoke hover:text-bone"
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="pack-pill"
                      className="absolute inset-0 rounded-full bg-ember"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 32,
                      }}
                    />
                  )}
                  <span className="relative flex items-center gap-2">
                    {label}
                    {i === 1 && (
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[10px] font-bold",
                          active
                            ? "bg-ink/20 text-ink"
                            : "bg-ember/15 text-ember"
                        )}
                      >
                        −15%
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <Stagger
          className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-3"
          gap={0.13}
        >
          {TIERS.map((t) => {
            const duoTotal = Math.round(t.price * 2 * 0.85);
            const savings = t.price * 2 - duoTotal;
            return (
              <Item key={t.id} className="h-full">
                <article
                  className={cn(
                    "relative flex h-full flex-col rounded-[1.75rem] transition-transform duration-500 hover:-translate-y-2",
                    t.featured
                      ? "bg-gradient-to-b from-ember/70 via-ember/15 to-transparent p-[1.5px] shadow-[0_30px_90px_-35px_rgba(61, 123, 255,0.45)]"
                      : "border border-line bg-panel"
                  )}
                >
                  {t.featured && (
                    <span className="absolute -top-3.5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-ember px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-ink">
                      <Flame size={12} aria-hidden /> Most popular
                    </span>
                  )}

                  <div
                    className={cn(
                      "flex h-full flex-col rounded-[calc(1.75rem-1px)] p-8",
                      t.featured && "bg-coal"
                    )}
                  >
                    <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-ember">
                      {t.line}
                    </p>
                    <h3 className="mt-2 font-display text-2xl font-bold tracking-tight text-bone">
                      {t.name}
                    </h3>
                    <p className="mt-1.5 text-sm text-smoke">{t.blurb}</p>

                    <div className="mt-7 flex items-end gap-2.5">
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={duo ? "duo" : "single"}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3, ease: EASE }}
                          className="font-display text-5xl font-bold tracking-tight text-bone"
                        >
                          ${duo ? duoTotal : t.price}
                        </motion.span>
                      </AnimatePresence>
                      <div className="pb-1.5">
                        <p className="text-xs font-medium text-smoke">
                          {duo ? "/ 2 pieces" : "/ piece"}
                        </p>
                        <AnimatePresence>
                          {duo && (
                            <motion.p
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="text-xs font-semibold text-ember"
                            >
                              Save ${savings}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    <ul className="mt-7 flex flex-1 flex-col gap-3.5 border-t border-line pt-7">
                      {t.features.map((f) => (
                        <li
                          key={f}
                          className="flex items-start gap-3 text-sm text-bone/80"
                        >
                          <span
                            className={cn(
                              "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full",
                              t.featured
                                ? "bg-ember/15 text-ember"
                                : "bg-bone/8 text-bone/70"
                            )}
                          >
                            <Check size={11} strokeWidth={3} aria-hidden />
                          </span>
                          {f}
                        </li>
                      ))}
                    </ul>

                    <button
                      type="button"
                      onClick={() => handleSelectTier(t.id)}
                      className={cn(
                        "group mt-9 inline-flex w-full items-center justify-center gap-2 rounded-full py-4 text-sm font-semibold transition-all duration-300",
                        t.featured
                          ? "bg-ember text-ink shadow-[0_0_45px_-12px_rgba(61, 123, 255,0.7)] hover:shadow-[0_0_60px_-10px_rgba(61, 123, 255,0.9)]"
                          : "border border-line bg-bone/[0.04] text-bone hover:border-bone/30 hover:bg-bone/[0.08]"
                      )}
                    >
                      {duo ? `Add 2-Pack` : t.cta}
                      <ArrowRight
                        size={15}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                        aria-hidden
                      />
                    </button>
                  </div>
                </article>
              </Item>
            );
          })}
        </Stagger>

        <p className="mt-10 text-center text-xs text-smoke">
          Free express shipping · 30-day wear trial · 2-year warranty · Secure
          checkout
        </p>
      </div>
    </section>
  );
}
