import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, MessageCircle, Plus } from "lucide-react";
import { useState } from "react";
import { cn } from "../utils/cn";
import { EASE, Eyebrow, FadeIn, RevealText, Stagger, Item } from "./ui";

const FAQS = [
  {
    q: "How does Kovac sizing run?",
    a: "True to size for most men, in XS–XXL. The Atlas and Ridge run relaxed to layer over a hoodie or knit — if you're between sizes, go down for a tailored fit. The Mercer is cut closer to a shirt, so size up if you want it worn open as a jacket. A chest-size chart ships with every confirmation email.",
  },
  {
    q: "What exactly is the 30-day wear trial?",
    a: "Wear it. In the rain, the office, on the ridge — we mean it. If it doesn't earn its place within 30 days, send it back for a full refund with the prepaid label in your box. No restocking fees, no interrogation.",
  },
  {
    q: "How fast will my order arrive?",
    a: "Orders placed before 2 PM ET ship the same day. US express delivery lands in 2–4 business days and is free over $150. We ship to 34 countries, with duties calculated at checkout so there are no surprises at the door.",
  },
  {
    q: "What does the 2-year warranty cover?",
    a: "Seam failure, zipper and hardware defects, membrane delamination, and pilling beyond normal wear — anything that breaks when it shouldn't. Cosmetic scuffs and honest wear are the price of a life well-lived. One claim, one replacement piece, no receipts gymnastics.",
  },
  {
    q: "How do I care for the fabrics?",
    a: "Machine wash cold on gentle, inside out, then hang dry away from direct heat. Never tumble the shells — heat is the enemy of the membrane. The canvas and terry get softer every wash. A full care card ships in every box.",
  },
  {
    q: "Do limited colorways ever restock?",
    a: "No. Numbered runs are produced once and retired — that's the deal. Core colors (black, cobalt, bone, graphite) stay in permanent rotation. Join the list below for first notice of every drop.",
  },
];

function FaqItem({ q, a, id, open, onToggle }: { q: string; a: string; id: string; open: boolean; onToggle: () => void }) {
  return (
    <div className={cn("border-b border-line transition-colors duration-300", open && "border-ember/30")}>
      <button
        type="button"
        id={`${id}-button`}
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        onClick={onToggle}
        className="group flex w-full items-center justify-between gap-6 py-6 text-left"
      >
        <span
          className={cn(
            "font-display text-base font-bold tracking-tight transition-colors duration-300 md:text-lg",
            open ? "text-ember" : "text-bone group-hover:text-ember-2"
          )}
        >
          {q}
        </span>
        <span
          className={cn(
            "grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-all duration-400",
            open
              ? "rotate-45 border-ember bg-ember text-ink"
              : "border-line text-smoke group-hover:border-bone/30 group-hover:text-bone"
          )}
        >
          <Plus size={15} strokeWidth={2.5} aria-hidden />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`${id}-panel`}
            role="region"
            aria-labelledby={`${id}-button`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="overflow-hidden"
          >
            <p className="max-w-2xl pb-7 text-sm leading-relaxed text-smoke md:text-[15px]">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" aria-labelledby="faq-heading" className="relative py-24 md:py-36">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-14 px-5 md:px-8 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <FadeIn>
              <Eyebrow>FAQ</Eyebrow>
            </FadeIn>
            <h2
              id="faq-heading"
              className="mt-6 font-display text-4xl font-bold leading-[1.04] tracking-[-0.03em] text-bone sm:text-5xl"
            >
              <RevealText parts={["Straight ", { text: "answers.", className: "text-gradient" }]} delay={0.1} />
            </h2>
            <FadeIn delay={0.16}>
              <p className="mt-5 max-w-sm text-base leading-relaxed text-smoke">
                No fine print, no legalese. Everything men usually ask before their first piece.
              </p>
            </FadeIn>
            <FadeIn delay={0.24}>
              <div className="glass mt-9 rounded-3xl p-7">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-ember/12 text-ember ring-1 ring-ember/25">
                  <MessageCircle size={19} aria-hidden />
                </span>
                <h3 className="mt-5 font-display text-lg font-bold text-bone">Still got questions?</h3>
                <p className="mt-2 text-sm leading-relaxed text-smoke">
                  Real humans, right here in Portland. Average reply under 4 hours.
                </p>
                <a
                  href="#cta"
                  className="group mt-5 inline-flex items-center gap-2 text-sm font-semibold text-ember"
                >
                  Talk to the crew
                  <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
                </a>
              </div>
            </FadeIn>
          </div>
        </div>

        <Stagger className="lg:col-span-8" gap={0.07}>
          {FAQS.map((f, i) => (
            <Item key={f.q} className={i === 0 ? "border-t border-line" : undefined}>
              <FaqItem
                id={`faq-${i}`}
                q={f.q}
                a={f.a}
                open={open === i}
                onToggle={() => setOpen(open === i ? -1 : i)}
              />
            </Item>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
