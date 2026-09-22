import { AnimatePresence, motion, useScroll } from "framer-motion";
import { ArrowRight, Menu, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { cn } from "../utils/cn";
import { EASE, Magnetic } from "./ui";

const LINKS = [
  { label: "Lineup", href: "lineup" },
  { label: "Technology", href: "technology" },
  { label: "Reviews", href: "reviews" },
  { label: "Pricing", href: "pricing" },
  { label: "FAQ", href: "faq" },
];

export function Wordmark({ className }: { className?: string }) {
  const { openLandingPage } = useCart();

  return (
    <button
      type="button"
      onClick={() => openLandingPage()}
      aria-label="KOVAC — back to home"
      className={cn(
        "group inline-flex items-center gap-2 font-display text-lg font-bold tracking-[0.22em] text-bone",
        className
      )}
    >
      <span className="relative grid h-7 w-7 place-items-center overflow-hidden rounded-lg bg-ember text-ink transition-transform duration-500 group-hover:rotate-[135deg]">
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          aria-hidden
        >
          <path
            d="M1 12 12 1M2 1h10M12 2v10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="square"
          />
        </svg>
      </span>
      KOVAC<span className="text-ember">®</span>
    </button>
  );
}

export default function Navbar() {
  const {
    itemCount,
    activeView,
    setIsDrawerOpen,
    openCartPage,
    openLandingPage,
  } = useCart();

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  useEffect(
    () => scrollY.on("change", (v) => setScrolled(v > 28)),
    [scrollY]
  );

  const handleNavClick = (sectionId: string) => {
    setOpen(false);
    openLandingPage(sectionId);
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div
        className={cn(
          "mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 transition-all duration-500 md:px-8",
          scrolled || activeView !== "landing"
            ? "border-b border-line bg-ink/85 backdrop-blur-xl [box-shadow:0_10px_40px_-20px_rgba(0,0,0,0.8)]"
            : "border-b border-transparent bg-transparent"
        )}
      >
        <Wordmark />

        <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
          {LINKS.map((l) => (
            <button
              key={l.href}
              type="button"
              onClick={() => handleNavClick(l.href)}
              className="group relative text-[13px] font-medium tracking-wide text-smoke transition-colors duration-300 hover:text-bone"
            >
              {l.label}
              <span className="absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-ember transition-transform duration-400 ease-out group-hover:scale-x-100" />
            </button>
          ))}
          <button
            type="button"
            onClick={openCartPage}
            className={cn(
              "group relative text-[13px] font-semibold tracking-wide transition-colors duration-300",
              activeView === "cart"
                ? "text-ember"
                : "text-smoke hover:text-bone"
            )}
          >
            Cart & Checkout
            <span
              className={cn(
                "absolute -bottom-1.5 left-0 h-px w-full origin-left bg-ember transition-transform duration-400 ease-out",
                activeView === "cart"
                  ? "scale-x-100"
                  : "scale-x-0 group-hover:scale-x-100"
              )}
            />
          </button>
        </nav>

        <div className="flex items-center gap-2.5">
          {/* Quick Cart Drawer Trigger */}
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            aria-label={`Open bag drawer, ${itemCount} item${
              itemCount === 1 ? "" : "s"
            }`}
            className="relative flex h-11 items-center gap-2 rounded-full border border-line bg-bone/[0.04] px-3.5 text-bone transition-colors hover:border-ember/60"
          >
            <ShoppingBag size={17} strokeWidth={1.8} />
            <span className="hidden text-xs font-semibold sm:inline">Bag</span>
            <AnimatePresence mode="popLayout">
              <motion.span
                key={itemCount}
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.4, opacity: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 22 }}
                className="grid h-5 min-w-5 place-items-center rounded-full bg-ember px-1.5 text-[10px] font-bold text-ink"
              >
                {itemCount}
              </motion.span>
            </AnimatePresence>
          </button>

          {/* Direct Cart Page Button */}
          <Magnetic strength={0.22} className="hidden sm:inline-block">
            <button
              type="button"
              onClick={openCartPage}
              className="group inline-flex items-center gap-2 rounded-full bg-bone px-5 py-2.5 text-[13px] font-semibold text-ink transition-colors duration-300 hover:bg-ember"
            >
              {activeView === "cart" ? "Checkout Now" : "View Cart"}
              <ArrowRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-0.5"
              />
            </button>
          </Magnetic>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid h-11 w-11 place-items-center rounded-full border border-line bg-bone/[0.04] text-bone lg:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            key="mobile-menu"
            aria-label="Mobile"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="overflow-hidden border-b border-line bg-ink/95 backdrop-blur-xl lg:hidden"
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-6">
              {LINKS.map((l, i) => (
                <motion.button
                  key={l.href}
                  type="button"
                  onClick={() => handleNavClick(l.href)}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 * i, duration: 0.4, ease: EASE }}
                  className="flex items-center justify-between rounded-xl px-3 py-3.5 text-left font-display text-2xl font-semibold text-bone/90 transition-colors hover:bg-bone/5 hover:text-ember"
                >
                  {l.label}
                  <ArrowRight size={18} className="text-smoke" />
                </motion.button>
              ))}
              <motion.button
                type="button"
                onClick={() => {
                  setOpen(false);
                  openCartPage();
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.34, duration: 0.4, ease: EASE }}
                className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-ember px-6 py-4 text-sm font-semibold text-ink"
              >
                Go to Cart & Checkout ({itemCount}) <ArrowRight size={16} />
              </motion.button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
