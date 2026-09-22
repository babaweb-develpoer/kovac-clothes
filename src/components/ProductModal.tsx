import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  Heart,
  Ruler,
  ShieldCheck,
  ShoppingBag,
  Truck,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { APPAREL_SIZES } from "../data/products";
import { cn } from "../utils/cn";
import { EASE } from "./ui";

export default function ProductModal() {
  const {
    quickViewProduct,
    setQuickViewProduct,
    addItem,
    wishlist,
    toggleWishlist,
  } = useCart();

  const [selectedSize, setSelectedSize] = useState<string>("M");
  const [selectedColor, setSelectedColor] = useState<number>(0);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  useEffect(() => {
    if (quickViewProduct) {
      setSelectedSize("M");
      setSelectedColor(0);
      setShowSizeGuide(false);
    }
  }, [quickViewProduct]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setQuickViewProduct(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [setQuickViewProduct]);

  const isWishlisted = quickViewProduct
    ? wishlist.includes(quickViewProduct.id)
    : false;
  const activeColorway = quickViewProduct
    ? quickViewProduct.colorways[selectedColor] ?? quickViewProduct.colorways[0]
    : null;

  const handleAddToCart = () => {
    if (!quickViewProduct) return;
    addItem(quickViewProduct.id, selectedSize, selectedColor, 1, true);
    setQuickViewProduct(null);
  };

  return (
    <AnimatePresence>
      {quickViewProduct && (
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="quickview-title"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setQuickViewProduct(null)}
          className="fixed inset-0 bg-ink/85 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.35, ease: EASE }}
          className="relative z-10 grid max-h-[90vh] w-full max-w-4xl grid-cols-1 overflow-y-auto rounded-3xl border border-line bg-coal shadow-2xl lg:grid-cols-12"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={() => setQuickViewProduct(null)}
            aria-label="Close modal"
            className="absolute right-4 top-4 z-20 grid h-10 w-10 place-items-center rounded-full border border-line bg-ink/70 text-bone transition-colors hover:border-ember hover:text-ember"
          >
            <X size={18} />
          </button>

          {/* Left: Product Visual & Specs */}
          <div className="relative flex flex-col justify-between overflow-hidden bg-panel p-6 sm:p-8 lg:col-span-6">
            <div
              className="pointer-events-none absolute inset-0 opacity-70 blur-[70px]"
              style={{
                background: `radial-gradient(circle at 50% 45%, ${quickViewProduct.glow}, transparent 70%)`,
              }}
              aria-hidden
            />

            <div className="relative z-10 flex items-center justify-between">
              {quickViewProduct.tag ? (
                <span className="rounded-full bg-ember px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-ink">
                  {quickViewProduct.tag}
                </span>
              ) : (
                <span className="text-xs font-semibold uppercase tracking-widest text-smoke">
                  KOVAC PERFORMANCE
                </span>
              )}

              <button
                type="button"
                onClick={() => toggleWishlist(quickViewProduct.id)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
                  isWishlisted
                    ? "border-ember bg-ember/15 text-ember"
                    : "border-line bg-ink/40 text-smoke hover:text-bone"
                )}
              >
                <Heart
                  size={13}
                  className={isWishlisted ? "fill-ember text-ember" : ""}
                />
                {isWishlisted ? "Saved" : "Save"}
              </button>
            </div>

            {/* Product Image */}
            <div className="relative my-6 aspect-[4/3] w-full">
              <img
                src={quickViewProduct.img}
                alt={quickViewProduct.name}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Technical Specs mini grid */}
            <div className="relative z-10 grid grid-cols-3 gap-2 rounded-2xl border border-line bg-ink/50 p-3.5 text-center">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-smoke">
                  Weight
                </p>
                <p className="mt-0.5 font-display text-xs font-bold text-bone">
                  {quickViewProduct.specs.weight}
                </p>
              </div>
              <div className="border-x border-line px-2">
                <p className="text-[10px] uppercase tracking-wider text-smoke">
                  Fit
                </p>
                <p className="mt-0.5 font-display text-xs font-bold text-bone">
                  {quickViewProduct.specs.drop}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-smoke">
                  System
                </p>
                <p className="mt-0.5 font-display text-xs font-bold text-ember">
                  {quickViewProduct.specs.plate}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Selection & Controls */}
          <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ember">
                {quickViewProduct.subtitle}
              </p>
              <div className="mt-1.5 flex items-baseline justify-between gap-4">
                <h2
                  id="quickview-title"
                  className="font-display text-3xl font-bold tracking-tight text-bone"
                >
                  {quickViewProduct.name}
                </h2>
                <div className="text-right">
                  <span className="font-display text-2xl font-bold text-bone">
                    ${quickViewProduct.price}
                  </span>
                  {quickViewProduct.compare && (
                    <span className="ml-2 text-sm text-smoke line-through">
                      ${quickViewProduct.compare}
                    </span>
                  )}
                </div>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-smoke">
                {quickViewProduct.description}
              </p>

              {/* Colorway Selector */}
              <div className="mt-6">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold uppercase tracking-wider text-smoke">
                    Colorway
                  </span>
                  <span className="font-medium text-bone">
                    {activeColorway?.name}
                  </span>
                </div>
                <div className="mt-2.5 flex items-center gap-2.5">
                  {quickViewProduct.colorways.map((cw, idx) => (
                    <button
                      key={cw.name}
                      type="button"
                      onClick={() => setSelectedColor(idx)}
                      className={cn(
                        "flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all",
                        selectedColor === idx
                          ? "border-ember bg-ember/15 text-bone ring-1 ring-ember"
                          : "border-line bg-panel text-smoke hover:border-bone/30 hover:text-bone"
                      )}
                    >
                      <span
                        className="h-3.5 w-3.5 rounded-full border border-white/20"
                        style={{ backgroundColor: cw.hex }}
                      />
                      {cw.name.split("/")[0].trim()}
                    </button>
                  ))}
                </div>
              </div>

              {/* US Men's Size Selector */}
              <div className="mt-6">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold uppercase tracking-wider text-smoke">
                    Select Size
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowSizeGuide((v) => !v)}
                    className="inline-flex items-center gap-1 font-medium text-ember hover:underline"
                  >
                    <Ruler size={13} />
                    {showSizeGuide ? "Hide size chart" : "Size guide"}
                  </button>
                </div>

                {showSizeGuide ? (
                  <div className="mt-3 rounded-2xl border border-line bg-panel p-4 text-xs">
                    <p className="font-semibold text-bone">
                      True to size. Room for a base layer.
                    </p>
                    <p className="mt-1 text-smoke">
                      Between sizes? Size down for a tailored fit, or up if
                      you plan to layer over a knit or hoodie.
                    </p>
                    <div className="mt-3 grid grid-cols-3 gap-1.5 text-center font-mono text-[11px]">
                      <div className="rounded bg-ink/60 p-1.5 text-smoke">
                        M = Chest 38–40"
                      </div>
                      <div className="rounded bg-ink/60 p-1.5 text-smoke">
                        L = Chest 41–43"
                      </div>
                      <div className="rounded bg-ink/60 p-1.5 text-smoke">
                        XL = Chest 44–46"
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6">
                    {APPAREL_SIZES.map((size) => {
                      const active = selectedSize === size;
                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setSelectedSize(size)}
                          className={cn(
                            "rounded-xl border py-2.5 font-display text-xs font-bold transition-all",
                            active
                              ? "border-ember bg-ember text-ink shadow-[0_0_20px_-4px_rgba(61, 123, 255,0.7)]"
                              : "border-line bg-panel text-bone hover:border-bone/35"
                          )}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-8 border-t border-line pt-6">
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex w-full items-center justify-center gap-3 rounded-full bg-ember py-4 text-sm font-bold text-ink shadow-[0_0_45px_-10px_rgba(61, 123, 255,0.75)] transition-all hover:bg-ember-2"
              >
                <ShoppingBag size={17} />
                Add to Cart — {selectedSize} · ${quickViewProduct.price}
              </button>

              <div className="mt-4 flex items-center justify-between text-[11px] text-smoke">
                <span className="inline-flex items-center gap-1.5">
                  <Truck size={13} className="text-ember" /> Free express
                  shipping
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck size={13} className="text-ember" /> 30-day field
                  trial
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Check size={13} className="text-ember" /> Ships in 24h
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
}
