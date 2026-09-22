import { AnimatePresence, motion } from "framer-motion";
import { Check, Eye, Heart, Plus } from "lucide-react";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { PRODUCTS, type Product } from "../data/products";
import { cn } from "../utils/cn";
import { EASE, FadeIn, RevealText } from "./ui";

type Category = "All" | "Everyday" | "Performance";
const FILTERS: Category[] = ["All", "Everyday", "Performance"];
const CARD_QUICK_SIZES = ["S", "M", "L", "XL", "XXL"] as const;

function ProductCard({ p, index }: { p: Product; index: number }) {
  const {
    addItem,
    wishlist,
    toggleWishlist,
    setQuickViewProduct,
    openProductStory,
  } = useCart();

  const [swatch, setSwatch] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>("M");
  const [added, setAdded] = useState(false);

  const liked = wishlist.includes(p.id);

  const handleAdd = () => {
    if (added) return;
    setAdded(true);
    addItem(p.id, selectedSize, swatch, 1, true);
    window.setTimeout(() => setAdded(false), 1400);
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 34 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.7, ease: EASE, delay: index * 0.05 }}
      whileHover={{ y: -8 }}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-line bg-panel transition-colors duration-500 hover:border-bone/25"
    >
      {/* Image stage */}
      <div className="relative aspect-[4/3.3] overflow-hidden">
        <div
          className="absolute left-1/2 top-1/2 h-2/3 w-2/3 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-[60px] transition-opacity duration-700 group-hover:opacity-100"
          style={{ background: p.glow }}
          aria-hidden
        />
        <img
          src={p.img}
          alt={`${p.name} — men's technical wear, editorial shot`}
          loading="lazy"
          onClick={() => openProductStory(p.id)}
          className="absolute inset-0 h-full w-full cursor-pointer object-cover transition-transform duration-700 ease-out group-hover:-translate-y-2 group-hover:rotate-[-3deg] group-hover:scale-[1.06]"
        />

        {/* Explore story hint */}
        <button
          type="button"
          onClick={() => openProductStory(p.id)}
          className="absolute bottom-4 left-4 hidden items-center gap-2 rounded-full border border-bone/20 bg-ink/60 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-bone backdrop-blur transition-all duration-500 hover:border-ember hover:text-ember md:inline-flex md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100"
        >
          Scroll the anatomy →
        </button>

        {p.tag && (
          <span
            className={cn(
              "absolute left-4 top-4 rounded-full px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em]",
              p.tagTone === "ember"
                ? "bg-ember text-ink"
                : "border border-bone/20 bg-bone/15 text-bone backdrop-blur"
            )}
          >
            {p.tag}
          </span>
        )}

        <div className="absolute right-4 top-4 flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setQuickViewProduct(p)}
            title="Quick View & Size Guide"
            className="grid h-10 w-10 place-items-center rounded-full border border-bone/15 bg-ink/50 text-bone/80 backdrop-blur transition-all hover:border-ember hover:text-ember"
          >
            <Eye size={15} />
          </button>
          <button
            type="button"
            aria-label={
              liked ? `Remove ${p.name} from wishlist` : `Save ${p.name}`
            }
            aria-pressed={liked}
            onClick={() => toggleWishlist(p.id)}
            className={cn(
              "grid h-10 w-10 place-items-center rounded-full border backdrop-blur transition-all duration-300",
              liked
                ? "border-ember bg-ember text-ink"
                : "border-bone/15 bg-ink/50 text-bone/75 hover:border-bone/40 hover:text-bone"
            )}
          >
            <Heart size={15} className={liked ? "fill-ink" : ""} />
          </button>
        </div>
      </div>

      {/* Meta & Size Picker */}
      <div className="flex flex-1 flex-col justify-between gap-4 border-t border-line p-5 md:p-6">
        <div>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-ember">
                {p.subtitle}
              </p>
              <button
                type="button"
                onClick={() => openProductStory(p.id)}
                className="mt-0.5 text-left font-display text-xl font-bold tracking-tight text-bone transition-colors hover:text-ember"
              >
                {p.name} <span className="text-sm text-smoke">→</span>
              </button>
            </div>
            <div className="text-right">
              <p className="font-display text-lg font-bold text-bone">
                ${p.price}
              </p>
              {p.compare && (
                <p className="text-xs text-smoke line-through">${p.compare}</p>
              )}
            </div>
          </div>
          <p className="mt-1.5 text-[13px] leading-snug text-smoke">
            {p.blurb}
          </p>
        </div>

        {/* Quick US Size Selector on card */}
        <div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-semibold uppercase tracking-wider text-smoke">
              Size: <strong className="text-bone">{selectedSize}</strong>
            </span>
            <button
              type="button"
              onClick={() => setQuickViewProduct(p)}
              className="font-medium text-ember hover:underline"
            >
              All sizes (XS–XXL)
            </button>
          </div>
          <div className="mt-2 grid grid-cols-6 gap-1.5">
            {CARD_QUICK_SIZES.map((sz) => (
              <button
                key={sz}
                type="button"
                onClick={() => setSelectedSize(sz)}
                className={cn(
                  "rounded-lg border py-1.5 font-display text-[11px] font-bold transition-all",
                  selectedSize === sz
                    ? "border-ember bg-ember text-ink"
                    : "border-line bg-ink/60 text-smoke hover:border-bone/30 hover:text-bone"
                )}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>

        {/* Colorway Swatches + Add Button */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-smoke">
              Colorway
            </span>
            <div className="flex items-center gap-1.5">
              {p.colorways.map((cw, i) => (
                <button
                  key={cw.name}
                  type="button"
                  title={cw.name}
                  onClick={() => setSwatch(i)}
                  className={cn(
                    "h-5 w-5 rounded-full ring-1 ring-inset ring-bone/20 transition-all duration-300",
                    swatch === i
                      ? "scale-110 ring-2 ring-ember ring-offset-2 ring-offset-panel"
                      : "hover:scale-110"
                  )}
                  style={{ backgroundColor: cw.hex }}
                />
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-xs font-bold transition-all duration-300",
              added
                ? "bg-emerald-400 text-ink"
                : "bg-ember text-ink shadow-[0_0_35px_-10px_rgba(61, 123, 255,0.6)] hover:bg-ember-2"
            )}
          >
            {added ? (
              <>
                <Check size={15} strokeWidth={3} /> Added Size {selectedSize} to
                Bag
              </>
            ) : (
              <>
                <Plus size={15} strokeWidth={2.6} /> Add to Bag · Size{" "}
                {selectedSize} (${p.price})
              </>
            )}
          </button>
        </div>
      </div>
    </motion.article>
  );
}

export default function Showcase() {
  const [filter, setFilter] = useState<Category>("All");
  const visible = PRODUCTS.filter(
    (p) => filter === "All" || p.cats.includes(filter as Product["cats"][number])
  );

  return (
    <section
      id="lineup"
      aria-labelledby="lineup-heading"
      className="relative py-24 md:py-36"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <FadeIn>
              <p className="inline-flex items-center gap-2.5 rounded-full border border-line bg-bone/[0.04] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-smoke">
                <span
                  className="h-1.5 w-1.5 animate-pulse-ring rounded-full bg-ember"
                  aria-hidden
                />
                The Lineup
              </p>
            </FadeIn>
            <h2
              id="lineup-heading"
              className="mt-6 font-display text-4xl font-bold leading-[1.02] tracking-[-0.03em] text-bone sm:text-5xl md:text-6xl"
            >
              <RevealText parts={["Pick your ", { text: "layer.", className: "text-gradient" }]} delay={0.1} />
            </h2>
            <FadeIn delay={0.16}>
              <p className="mt-5 text-base leading-relaxed text-smoke md:text-lg">
                Four pieces. Click any garment to open its scroll-driven
                anatomy story — or pick your size right here and add it to the
                bag.
              </p>
            </FadeIn>
          </div>

          <FadeIn delay={0.2} className="shrink-0">
            <div
              role="tablist"
              aria-label="Filter products"
              className="inline-flex rounded-full border border-line bg-panel p-1.5"
            >
              {FILTERS.map((f) => (
                <button
                  key={f}
                  role="tab"
                  aria-selected={filter === f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "relative rounded-full px-5 py-2 text-[13px] font-semibold transition-colors duration-300",
                    filter === f ? "text-ink" : "text-smoke hover:text-bone"
                  )}
                >
                  {filter === f && (
                    <motion.span
                      layoutId="filter-pill"
                      className="absolute inset-0 rounded-full bg-ember"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 32,
                      }}
                    />
                  )}
                  <span className="relative">{f}</span>
                </button>
              ))}
            </div>
          </FadeIn>
        </div>

        <motion.div
          layout
          className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {visible.map((p, i) => (
              <ProductCard key={p.id} p={p} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
