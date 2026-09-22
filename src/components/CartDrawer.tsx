import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Bookmark,
  CheckCircle2,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  Truck,
  X,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { PRODUCTS, APPAREL_SIZES } from "../data/products";
import { EASE } from "./ui";

export function ToastContainer() {
  const { toasts, dismissToast } = useCart();

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed bottom-5 right-5 z-[120] flex max-w-sm flex-col gap-2.5"
    >
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.94 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="pointer-events-auto flex items-start gap-3 rounded-2xl border border-ember/40 bg-coal/95 px-4 py-3.5 shadow-[0_12px_40px_-10px_rgba(0,0,0,0.85)] backdrop-blur-xl"
          >
            <CheckCircle2
              size={18}
              className="mt-0.5 shrink-0 text-ember"
              aria-hidden
            />
            <div className="min-w-0 flex-1">
              <p className="font-display text-xs font-bold text-bone">
                {t.title}
              </p>
              {t.subtitle && (
                <p className="mt-0.5 text-[11px] text-smoke">{t.subtitle}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => dismissToast(t.id)}
              className="text-smoke transition-colors hover:text-bone"
              aria-label="Dismiss notification"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default function CartDrawer() {
  const {
    items,
    isDrawerOpen,
    setIsDrawerOpen,
    updateQuantity,
    updateItemSize,
    removeItem,
    moveToWishlist,
    subtotal,
    discountAmount,
    freeShippingThreshold,
    freeShippingRemaining,
    openCartPage,
  } = useCart();

  const progressPercent = Math.min(
    100,
    Math.round(((subtotal - discountAmount) / freeShippingThreshold) * 100)
  );

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <div
          className="fixed inset-0 z-[110]"
          role="dialog"
          aria-modal="true"
          aria-label="Shopping cart drawer"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsDrawerOpen(false)}
            className="fixed inset-0 bg-ink/80 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: EASE }}
            className="fixed bottom-0 right-0 top-0 flex w-full max-w-md flex-col border-l border-line bg-coal shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-line px-6 py-5">
              <div className="flex items-center gap-2.5">
                <ShoppingBag size={18} className="text-ember" />
                <h2 className="font-display text-lg font-bold tracking-tight text-bone">
                  Your Bag
                </h2>
                <span className="rounded-full bg-ember/15 px-2.5 py-0.5 font-display text-xs font-bold text-ember">
                  {items.reduce((a, b) => a + b.quantity, 0)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                aria-label="Close bag"
                className="grid h-9 w-9 place-items-center rounded-full border border-line bg-panel text-smoke transition-colors hover:border-bone/30 hover:text-bone"
              >
                <X size={16} />
              </button>
            </div>

            {/* Free Shipping Progress Bar */}
            <div className="border-b border-line bg-panel/70 px-6 py-3.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-medium text-bone">
                  <Truck size={14} className="text-ember" />
                  {freeShippingRemaining === 0 ? (
                    <span className="text-emerald-400">
                      You unlocked FREE Express Shipping!
                    </span>
                  ) : (
                    <span>
                      Add{" "}
                      <strong className="text-ember">
                        ${freeShippingRemaining}
                      </strong>{" "}
                      more for free express shipping
                    </span>
                  )}
                </span>
                <span className="font-mono text-[11px] text-smoke">
                  {progressPercent}%
                </span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-ink">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full rounded-full bg-gradient-to-r from-ember to-emerald-400"
                />
              </div>
            </div>

            {/* Item list */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="grid h-16 w-16 place-items-center rounded-full border border-line bg-panel text-smoke">
                    <ShoppingBag size={26} />
                  </div>
                  <p className="mt-4 font-display text-lg font-bold text-bone">
                    Your bag is empty
                  </p>
                  <p className="mt-1 max-w-xs text-xs leading-relaxed text-smoke">
                    Engineered for men who measure life in miles. Pick a piece
                    to start your 30-day wear trial.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => {
                    const product = PRODUCTS.find(
                      (p) => p.id === item.productId
                    );
                    if (!product) return null;
                    const colorway =
                      product.colorways[item.colorwayIndex] ??
                      product.colorways[0];

                    return (
                      <div
                        key={item.key}
                        className="flex gap-4 rounded-2xl border border-line bg-panel p-3.5"
                      >
                        <div className="relative h-22 w-22 shrink-0 overflow-hidden rounded-xl bg-ink/70">
                          <img
                            src={product.img}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        <div className="flex flex-1 flex-col justify-between">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-display text-sm font-bold text-bone">
                                {product.name}
                              </h3>
                              <p className="text-[11px] text-smoke">
                                {colorway.name}
                              </p>
                            </div>
                            <p className="font-display text-sm font-bold text-bone">
                              ${product.price * item.quantity}
                            </p>
                          </div>

                          {/* Size & Quantity Row */}
                          <div className="mt-3 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5">
                              <label
                                htmlFor={`drawer-size-${item.key}`}
                                className="text-[10px] font-semibold uppercase text-smoke"
                              >
                                US
                              </label>
                              <select
                                id={`drawer-size-${item.key}`}
                                value={item.size}
                                onChange={(e) =>
                                  updateItemSize(
                                    item.key,
                                    e.target.value
                                  )
                                }
                                className="rounded-lg border border-line bg-ink px-2 py-1 text-xs font-bold text-bone focus:border-ember focus:outline-none"
                              >
                                {APPAREL_SIZES.map((s) => (
                                  <option key={s} value={s}>
                                    {s}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Quantity Stepper */}
                            <div className="flex items-center rounded-lg border border-line bg-ink">
                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(item.key, item.quantity - 1)
                                }
                                aria-label="Decrease quantity"
                                className="px-2 py-1 text-smoke hover:text-bone"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="px-2 font-display text-xs font-bold text-bone">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(item.key, item.quantity + 1)
                                }
                                aria-label="Increase quantity"
                                className="px-2 py-1 text-smoke hover:text-bone"
                              >
                                <Plus size={12} />
                              </button>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => moveToWishlist(item.key)}
                                title="Save for later"
                                className="rounded-lg p-1.5 text-smoke transition-colors hover:bg-bone/10 hover:text-ember"
                              >
                                <Bookmark size={13} />
                              </button>
                              <button
                                type="button"
                                onClick={() => removeItem(item.key)}
                                title="Remove item"
                                className="rounded-lg p-1.5 text-smoke transition-colors hover:bg-red-500/10 hover:text-red-400"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-line bg-panel p-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-smoke">Subtotal</span>
                <span className="font-display text-xl font-bold text-bone">
                  ${subtotal}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-smoke">
                Taxes, promo codes & express shipping calculated on the full
                Cart & Checkout page.
              </p>

              <div className="mt-5 flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={openCartPage}
                  className="group flex w-full items-center justify-center gap-2.5 rounded-full bg-ember py-4 text-sm font-bold text-ink shadow-[0_0_45px_-10px_rgba(61, 123, 255,0.75)] transition-all hover:bg-ember-2"
                >
                  Open Full Cart & Checkout
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </button>
              </div>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
