import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  CheckCircle2,
  CreditCard,
  Lock,
  Minus,
  PackageCheck,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Tag,
  Trash2,
  Truck,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import { useCart, type ShippingTier } from "../context/CartContext";
import { PRODUCTS, APPAREL_SIZES } from "../data/products";
import { cn } from "../utils/cn";
import { EASE, Eyebrow } from "./ui";

type CheckoutStep = "cart" | "checkout" | "confirmed";

type OrderReceipt = {
  orderId: string;
  date: string;
  email: string;
  fullName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  items: {
    name: string;
    size: string;
    colorway: string;
    quantity: number;
    price: number;
    img: string;
  }[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
};

export default function CartPage() {
  const {
    items,
    wishlist,
    updateQuantity,
    updateItemSize,
    removeItem,
    moveToWishlist,
    moveToCartFromWishlist,
    promo,
    applyPromo,
    removePromo,
    shippingTier,
    setShippingTier,
    subtotal,
    discountAmount,
    shippingCost,
    estimatedTax,
    total,
    freeShippingThreshold,
    freeShippingRemaining,
    openLandingPage,
    clearCart,
    addItem,
  } = useCart();

  const [step, setStep] = useState<CheckoutStep>("cart");
  const [promoInput, setPromoInput] = useState("");
  const [promoFeedback, setPromoFeedback] = useState<{
    ok: boolean;
    message: string;
  } | null>(null);

  // Checkout form fields
  const [email, setEmail] = useState("alex.mercer@kovac-athletics.com");
  const [fullName, setFullName] = useState("Alex Mercer");
  const [address, setAddress] = useState("742 Evergreen Terrace, Suite 4B");
  const [city, setCity] = useState("Portland");
  const [stateCode, setStateCode] = useState("OR");
  const [zip, setZip] = useState("97204");
  const [paymentMethod, setPaymentMethod] = useState<
    "card" | "applepay" | "afterpay"
  >("card");
  const [cardNumber, setCardNumber] = useState("4532 •••• •••• 8891");
  const [expiry, setExpiry] = useState("08/28");
  const [cvc, setCvc] = useState("842");

  const [receipt, setReceipt] = useState<OrderReceipt | null>(null);

  const handleApplyPromo = (e: FormEvent) => {
    e.preventDefault();
    const res = applyPromo(promoInput);
    setPromoFeedback(res);
    if (res.ok) setPromoInput("");
  };

  const handleQuickPromo = (code: string) => {
    const res = applyPromo(code);
    setPromoFeedback(res);
  };

  const handlePlaceOrder = (e: FormEvent) => {
    e.preventDefault();
    const orderItems = items.map((item) => {
      const product = PRODUCTS.find((p) => p.id === item.productId)!;
      const cw =
        product.colorways[item.colorwayIndex] ?? product.colorways[0];
      return {
        name: product.name,
        size: item.size,
        colorway: cw.name,
        quantity: item.quantity,
        price: product.price,
        img: product.img,
      };
    });

    const newReceipt: OrderReceipt = {
      orderId: `KVC-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      email,
      fullName,
      address,
      city,
      state: stateCode,
      zip,
      items: orderItems,
      subtotal,
      discount: discountAmount,
      shipping: shippingCost,
      tax: estimatedTax,
      total,
    };

    setReceipt(newReceipt);
    clearCart();
    setStep("confirmed");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const progressPercent = Math.min(
    100,
    Math.round(
      ((subtotal - discountAmount) / freeShippingThreshold) * 100
    )
  );

  // Suggest an upsell product not currently in the bag
  const upsellProduct =
    PRODUCTS.find((p) => !items.some((i) => i.productId === p.id)) ??
    PRODUCTS[1];

  return (
    <div className="min-h-screen bg-ink pb-28 pt-28 text-bone">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        {/* Top Breadcrumb & Progress Bar */}
        <div className="flex flex-col justify-between gap-6 border-b border-line pb-8 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => openLandingPage()}
              className="group inline-flex items-center gap-2 rounded-full border border-line bg-panel px-4 py-2 text-xs font-semibold text-smoke transition-colors hover:border-bone/30 hover:text-bone"
            >
              <ArrowLeft
                size={15}
                className="transition-transform group-hover:-translate-x-0.5"
              />
              Back to Storefront
            </button>
            <Eyebrow>30-Day Wear Trial Guaranteed</Eyebrow>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center gap-2 text-xs font-semibold">
            <button
              type="button"
              onClick={() => step !== "confirmed" && setStep("cart")}
              className={cn(
                "flex items-center gap-2 rounded-full px-4 py-1.5 transition-colors",
                step === "cart"
                  ? "bg-ember text-ink"
                  : "bg-panel text-smoke hover:text-bone"
              )}
            >
              <span>01. Bag & Sizing</span>
            </button>
            <span className="text-smoke">→</span>
            <button
              type="button"
              disabled={items.length === 0 || step === "confirmed"}
              onClick={() => items.length > 0 && setStep("checkout")}
              className={cn(
                "flex items-center gap-2 rounded-full px-4 py-1.5 transition-colors",
                step === "checkout"
                  ? "bg-ember text-ink"
                  : "bg-panel text-smoke hover:text-bone disabled:opacity-40"
              )}
            >
              <span>02. Express Checkout</span>
            </button>
            <span className="text-smoke">→</span>
            <span
              className={cn(
                "flex items-center gap-2 rounded-full px-4 py-1.5",
                step === "confirmed"
                  ? "bg-emerald-400 text-ink"
                  : "bg-panel text-smoke"
              )}
            >
              <span>03. Confirmation</span>
            </span>
          </div>
        </div>

        {/* STEP 3: ORDER CONFIRMATION SCREEN */}
        {step === "confirmed" && receipt ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="mx-auto mt-12 max-w-3xl rounded-3xl border border-emerald-400/30 bg-coal p-8 shadow-2xl md:p-12"
          >
            <div className="flex flex-col items-center text-center">
              <div className="grid h-16 w-16 place-items-center rounded-full bg-emerald-400/15 text-emerald-400 ring-1 ring-emerald-400/30">
                <PackageCheck size={32} />
              </div>
              <span className="mt-4 rounded-full bg-emerald-400/15 px-3.5 py-1 font-mono text-xs font-bold text-emerald-400">
                ORDER CONFIRMED · #{receipt.orderId}
              </span>
              <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-bone sm:text-4xl">
                Gear up, {receipt.fullName.split(" ")[0]}. Your order is
                dispatched.
              </h1>
              <p className="mt-2 max-w-lg text-sm text-smoke">
                A confirmation receipt and live tracking link have been sent to{" "}
                <strong className="text-bone">{receipt.email}</strong>. Your
                30-day wear trial starts the day your box lands.
              </p>
            </div>

            {/* Shipping Details & Summary */}
            <div className="mt-8 grid grid-cols-1 gap-6 rounded-2xl border border-line bg-panel p-6 sm:grid-cols-2">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-smoke">
                  Shipping Destination
                </p>
                <p className="mt-2 font-display text-sm font-bold text-bone">
                  {receipt.fullName}
                </p>
                <p className="text-xs text-smoke">{receipt.address}</p>
                <p className="text-xs text-smoke">
                  {receipt.city}, {receipt.state} {receipt.zip}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-smoke">
                  Estimated Delivery
                </p>
                <p className="mt-2 font-display text-sm font-bold text-ember">
                  2–3 Business Days (Express Air)
                </p>
                <p className="text-xs text-smoke">
                  Dispatched from Portland, OR Fulfillment Hub
                </p>
              </div>
            </div>

            {/* Items */}
            <div className="mt-6 space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-smoke">
                Items in Dispatch
              </p>
              {receipt.items.map((it, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-2xl border border-line bg-panel/60 p-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={it.img}
                      alt={it.name}
                      className="h-14 w-14 rounded-xl bg-ink object-cover"
                    />
                    <div>
                      <p className="font-display text-sm font-bold text-bone">
                        {it.name}
                      </p>
                      <p className="text-xs text-smoke">
                        {it.size} · {it.colorway} · Qty {it.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="font-display text-sm font-bold text-bone">
                    ${it.price * it.quantity}
                  </p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mt-6 space-y-2 border-t border-line pt-5 text-sm">
              <div className="flex justify-between text-smoke">
                <span>Subtotal</span>
                <span>${receipt.subtotal}</span>
              </div>
              {receipt.discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Promo Savings</span>
                  <span>-${receipt.discount}</span>
                </div>
              )}
              <div className="flex justify-between text-smoke">
                <span>Shipping</span>
                <span>
                  {receipt.shipping === 0 ? "FREE" : `$${receipt.shipping}`}
                </span>
              </div>
              <div className="flex justify-between text-smoke">
                <span>Estimated Tax</span>
                <span>${receipt.tax}</span>
              </div>
              <div className="flex justify-between border-t border-line pt-3 font-display text-xl font-bold text-bone">
                <span>Total Paid</span>
                <span className="text-ember">${receipt.total}</span>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => openLandingPage()}
                className="inline-flex items-center gap-2 rounded-full bg-ember px-8 py-4 text-sm font-bold text-ink shadow-lg transition-all hover:bg-ember-2"
              >
                Continue Shopping
                <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        ) : (
          /* STEP 1 & 2: CART & CHECKOUT */
          <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
            {/* LEFT COLUMN: CART ITEMS OR CHECKOUT FORM */}
            <div className="lg:col-span-7">
              {step === "cart" ? (
                <div>
                  <div className="flex items-baseline justify-between">
                    <h1 className="font-display text-3xl font-bold tracking-tight text-bone sm:text-4xl">
                      Your Bag{" "}
                      <span className="text-ember">
                        ({items.reduce((a, b) => a + b.quantity, 0)})
                      </span>
                    </h1>
                    {items.length > 0 && (
                      <button
                        type="button"
                        onClick={clearCart}
                        className="text-xs font-medium text-smoke transition-colors hover:text-red-400"
                      >
                        Clear bag
                      </button>
                    )}
                  </div>

                  {/* Free Shipping Progress Bar */}
                  <div className="mt-6 rounded-2xl border border-line bg-panel p-5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-2 font-medium text-bone">
                        <Truck size={16} className="text-ember" />
                        {freeShippingRemaining === 0 ? (
                          <span className="font-semibold text-emerald-400">
                            You've unlocked FREE Express Air Shipping ($18
                            value)!
                          </span>
                        ) : (
                          <span>
                            Add{" "}
                            <strong className="text-ember">
                              ${freeShippingRemaining}
                            </strong>{" "}
                            more to unlock FREE Express Air Shipping
                          </span>
                        )}
                      </span>
                      <span className="font-mono font-bold text-ember">
                        {progressPercent}%
                      </span>
                    </div>
                    <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-ink">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        className="h-full rounded-full bg-gradient-to-r from-ember to-emerald-400"
                      />
                    </div>
                  </div>

                  {/* Line Items */}
                  {items.length === 0 ? (
                    <div className="mt-8 rounded-3xl border border-line bg-panel p-12 text-center">
                      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-ink text-smoke">
                        <ShoppingBag size={28} />
                      </div>
                      <h2 className="mt-4 font-display text-2xl font-bold text-bone">
                        Your bag is currently empty
                      </h2>
                      <p className="mx-auto mt-2 max-w-md text-sm text-smoke">
                        Explore the flagship Atlas Storm Shell or the stealth
                        Midnight Hoodie. Every piece ships with a 30-day wear
                        trial.
                      </p>
                      <button
                        type="button"
                        onClick={() => openLandingPage("lineup")}
                        className="mt-6 inline-flex items-center gap-2 rounded-full bg-ember px-7 py-3.5 text-sm font-bold text-ink"
                      >
                        Explore the Lineup
                        <ArrowRight size={15} />
                      </button>
                    </div>
                  ) : (
                    <div className="mt-6 space-y-4">
                      <AnimatePresence mode="popLayout">
                        {items.map((item) => {
                          const product = PRODUCTS.find(
                            (p) => p.id === item.productId
                          );
                          if (!product) return null;
                          const colorway =
                            product.colorways[item.colorwayIndex] ??
                            product.colorways[0];

                          return (
                            <motion.div
                              key={item.key}
                              layout
                              initial={{ opacity: 0, y: 12 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className="group flex flex-col gap-5 rounded-3xl border border-line bg-panel p-5 transition-colors hover:border-bone/20 sm:flex-row sm:items-center"
                            >
                              {/* Product Image */}
                              <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-2xl bg-ink sm:w-32">
                                <img
                                  src={product.img}
                                  alt={product.name}
                                  className="h-full w-full object-cover"
                                />
                                {product.tag && (
                                  <span className="absolute left-2 top-2 rounded-full bg-ember px-2 py-0.5 text-[9px] font-bold uppercase text-ink">
                                    {product.tag}
                                  </span>
                                )}
                              </div>

                              {/* Details */}
                              <div className="flex flex-1 flex-col justify-between">
                                <div className="flex items-start justify-between gap-3">
                                  <div>
                                    <p className="text-[11px] font-semibold uppercase tracking-wider text-ember">
                                      {product.subtitle}
                                    </p>
                                    <h3 className="font-display text-xl font-bold text-bone">
                                      {product.name}
                                    </h3>
                                    <p className="mt-0.5 text-xs text-smoke">
                                      Colorway: {colorway.name}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-display text-xl font-bold text-bone">
                                      ${product.price * item.quantity}
                                    </p>
                                    <p className="text-xs text-smoke">
                                      ${product.price} each
                                    </p>
                                  </div>
                                </div>

                                {/* Controls Row */}
                                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
                                  {/* Size Picker */}
                                  <div className="flex items-center gap-2">
                                    <label
                                      htmlFor={`cart-size-${item.key}`}
                                      className="text-xs font-medium text-smoke"
                                    >
                                      Size:
                                    </label>
                                    <select
                                      id={`cart-size-${item.key}`}
                                      value={item.size}
                                      onChange={(e) =>
                                        updateItemSize(
                                          item.key,
                                          e.target.value
                                        )
                                      }
                                      className="rounded-xl border border-line bg-ink px-3 py-1.5 font-display text-xs font-bold text-bone transition-colors hover:border-ember focus:border-ember focus:outline-none"
                                    >
                                      {APPAREL_SIZES.map((s) => (
                                        <option key={s} value={s}>
                                          {s}
                                        </option>
                                      ))}
                                    </select>
                                  </div>

                                  {/* Quantity Stepper */}
                                  <div className="flex items-center gap-3">
                                    <div className="flex items-center rounded-xl border border-line bg-ink">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          updateQuantity(
                                            item.key,
                                            item.quantity - 1
                                          )
                                        }
                                        className="px-3 py-1.5 text-smoke transition-colors hover:text-bone"
                                        aria-label="Decrease quantity"
                                      >
                                        <Minus size={13} />
                                      </button>
                                      <span className="px-3 font-display text-xs font-bold text-bone">
                                        {item.quantity}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          updateQuantity(
                                            item.key,
                                            item.quantity + 1
                                          )
                                        }
                                        className="px-3 py-1.5 text-smoke transition-colors hover:text-bone"
                                        aria-label="Increase quantity"
                                      >
                                        <Plus size={13} />
                                      </button>
                                    </div>

                                    {/* Save for later & Remove */}
                                    <button
                                      type="button"
                                      onClick={() => moveToWishlist(item.key)}
                                      className="inline-flex items-center gap-1 rounded-xl border border-line bg-ink/60 px-3 py-1.5 text-xs font-medium text-smoke transition-colors hover:border-ember/40 hover:text-ember"
                                    >
                                      <Bookmark size={12} /> Save
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => removeItem(item.key)}
                                      className="inline-flex items-center gap-1 rounded-xl border border-line bg-ink/60 px-2.5 py-1.5 text-xs text-smoke transition-colors hover:border-red-500/40 hover:text-red-400"
                                      aria-label="Remove item"
                                    >
                                      <Trash2 size={13} />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* Saved for Later / Wishlist Section */}
                  {wishlist.length > 0 && (
                    <div className="mt-12">
                      <h3 className="font-display text-lg font-bold text-bone">
                        Saved for Later ({wishlist.length})
                      </h3>
                      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {wishlist.map((pid) => {
                          const prod = PRODUCTS.find((p) => p.id === pid);
                          if (!prod) return null;
                          return (
                            <div
                              key={pid}
                              className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-panel p-4"
                            >
                              <div className="flex items-center gap-3">
                                <img
                                  src={prod.img}
                                  alt={prod.name}
                                  className="h-14 w-14 rounded-xl bg-ink object-cover"
                                />
                                <div>
                                  <p className="font-display text-sm font-bold text-bone">
                                    {prod.name}
                                  </p>
                                  <p className="text-xs font-semibold text-ember">
                                    ${prod.price}
                                  </p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => moveToCartFromWishlist(pid)}
                                className="rounded-full bg-bone/10 px-3.5 py-2 text-xs font-bold text-bone transition-colors hover:bg-ember hover:text-ink"
                              >
                                Move to Bag
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Recommended Upsell Piece */}
                  <div className="mt-10 rounded-3xl border border-ember/30 bg-gradient-to-r from-panel via-coal to-panel p-6">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                      <div className="flex items-center gap-4">
                        <img
                          src={upsellProduct.img}
                          alt={upsellProduct.name}
                          className="h-16 w-16 rounded-2xl bg-ink object-cover"
                        />
                        <div>
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-ember">
                            <Sparkles size={11} /> Frequently paired with
                          </span>
                          <h4 className="font-display text-base font-bold text-bone">
                            {upsellProduct.name} — ${upsellProduct.price}
                          </h4>
                          <p className="text-xs text-smoke">
                            {upsellProduct.blurb}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          addItem(upsellProduct.id, "M", 0, 1, false)
                        }
                        className="shrink-0 rounded-full border border-ember bg-ember/15 px-5 py-2.5 text-xs font-bold text-ember transition-colors hover:bg-ember hover:text-ink"
                      >
                        + Add M to Bag
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* STEP 2: EXPRESS CHECKOUT FORM */
                <motion.form
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  onSubmit={handlePlaceOrder}
                  className="space-y-8 rounded-3xl border border-line bg-panel p-6 sm:p-8"
                >
                  <div className="flex items-center justify-between border-b border-line pb-4">
                    <h2 className="font-display text-2xl font-bold text-bone">
                      Shipping & Payment
                    </h2>
                    <button
                      type="button"
                      onClick={() => setStep("cart")}
                      className="text-xs font-semibold text-ember hover:underline"
                    >
                      Edit Bag ({items.reduce((a, b) => a + b.quantity, 0)})
                    </button>
                  </div>

                  {/* Contact & Shipping */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-smoke">
                      1. Contact & Delivery Address
                    </h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label className="block text-xs text-smoke">
                          Email for Order Tracking
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="mt-1.5 w-full rounded-xl border border-line bg-ink px-4 py-3 text-sm text-bone focus:border-ember focus:outline-none"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs text-smoke">
                          Full Name
                        </label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="mt-1.5 w-full rounded-xl border border-line bg-ink px-4 py-3 text-sm text-bone focus:border-ember focus:outline-none"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs text-smoke">
                          Street Address
                        </label>
                        <input
                          type="text"
                          required
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="mt-1.5 w-full rounded-xl border border-line bg-ink px-4 py-3 text-sm text-bone focus:border-ember focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-smoke">City</label>
                        <input
                          type="text"
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="mt-1.5 w-full rounded-xl border border-line bg-ink px-4 py-3 text-sm text-bone focus:border-ember focus:outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-smoke">
                            State
                          </label>
                          <input
                            type="text"
                            required
                            value={stateCode}
                            onChange={(e) => setStateCode(e.target.value)}
                            className="mt-1.5 w-full rounded-xl border border-line bg-ink px-4 py-3 text-sm text-bone focus:border-ember focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-smoke">
                            ZIP Code
                          </label>
                          <input
                            type="text"
                            required
                            value={zip}
                            onChange={(e) => setZip(e.target.value)}
                            className="mt-1.5 w-full rounded-xl border border-line bg-ink px-4 py-3 text-sm text-bone focus:border-ember focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Speed */}
                  <div className="space-y-3 border-t border-line pt-6">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-smoke">
                      2. Shipping Speed
                    </h3>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      {(
                        [
                          {
                            id: "standard",
                            title: "Standard Ground",
                            desc: "4–6 business days",
                            price:
                              subtotal - discountAmount >= freeShippingThreshold
                                ? "FREE"
                                : "$12",
                          },
                          {
                            id: "express",
                            title: "Express Air",
                            desc: "2–3 business days",
                            price:
                              subtotal - discountAmount >= freeShippingThreshold
                                ? "FREE"
                                : "$18",
                          },
                          {
                            id: "overnight",
                            title: "Overnight Courier",
                            desc: "Next business day",
                            price: "$29",
                          },
                        ] as const
                      ).map((tier) => {
                        const active = shippingTier === tier.id;
                        return (
                          <button
                            key={tier.id}
                            type="button"
                            onClick={() =>
                              setShippingTier(tier.id as ShippingTier)
                            }
                            className={cn(
                              "flex flex-col justify-between rounded-2xl border p-4 text-left transition-all",
                              active
                                ? "border-ember bg-ember/15 ring-1 ring-ember"
                                : "border-line bg-ink/50 hover:border-bone/30"
                            )}
                          >
                            <div>
                              <p className="font-display text-sm font-bold text-bone">
                                {tier.title}
                              </p>
                              <p className="text-[11px] text-smoke">
                                {tier.desc}
                              </p>
                            </div>
                            <p className="mt-3 font-display text-xs font-bold text-ember">
                              {tier.price}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="space-y-4 border-t border-line pt-6">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-smoke">
                      3. Payment Method (256-Bit Encrypted)
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                      {(
                        [
                          { id: "card", label: "Credit Card" },
                          { id: "applepay", label: "Apple Pay" },
                          { id: "afterpay", label: "4x Interest-Free" },
                        ] as const
                      ).map((pm) => (
                        <button
                          key={pm.id}
                          type="button"
                          onClick={() => setPaymentMethod(pm.id)}
                          className={cn(
                            "rounded-xl border py-3 text-xs font-bold transition-all",
                            paymentMethod === pm.id
                              ? "border-ember bg-ember text-ink"
                              : "border-line bg-ink text-smoke hover:text-bone"
                          )}
                        >
                          {pm.label}
                        </button>
                      ))}
                    </div>

                    {paymentMethod === "card" && (
                      <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-3">
                        <div className="sm:col-span-3">
                          <label className="block text-xs text-smoke">
                            Card Number
                          </label>
                          <div className="relative mt-1.5">
                            <input
                              type="text"
                              required
                              value={cardNumber}
                              onChange={(e) => setCardNumber(e.target.value)}
                              className="w-full rounded-xl border border-line bg-ink px-4 py-3 text-sm text-bone focus:border-ember focus:outline-none"
                            />
                            <CreditCard
                              size={16}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-smoke"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-smoke">
                            Expiry
                          </label>
                          <input
                            type="text"
                            required
                            value={expiry}
                            onChange={(e) => setExpiry(e.target.value)}
                            className="mt-1.5 w-full rounded-xl border border-line bg-ink px-4 py-3 text-sm text-bone focus:border-ember focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-smoke">
                            CVC
                          </label>
                          <input
                            type="text"
                            required
                            value={cvc}
                            onChange={(e) => setCvc(e.target.value)}
                            className="mt-1.5 w-full rounded-xl border border-line bg-ink px-4 py-3 text-sm text-bone focus:border-ember focus:outline-none"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-ember py-4 font-display text-base font-bold text-ink shadow-[0_0_45px_-10px_rgba(61, 123, 255,0.8)] transition-all hover:bg-ember-2"
                  >
                    <Lock size={16} />
                    Complete Order — ${total}
                  </button>
                </motion.form>
              )}
            </div>

            {/* RIGHT COLUMN: ORDER SUMMARY & PROMO CODES */}
            <div className="lg:col-span-5">
              <div className="sticky top-28 rounded-3xl border border-line bg-coal p-6 sm:p-8">
                <h2 className="font-display text-2xl font-bold text-bone">
                  Order Summary
                </h2>

                {/* Promo Code Box */}
                <div className="mt-6 rounded-2xl border border-line bg-panel p-4">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-bone">
                      <Tag size={13} className="text-ember" /> Promo / VIP Code
                    </span>
                    {promo && (
                      <button
                        type="button"
                        onClick={removePromo}
                        className="text-[11px] font-semibold text-red-400 hover:underline"
                      >
                        Remove ({promo.code})
                      </button>
                    )}
                  </div>

                  <form
                    onSubmit={handleApplyPromo}
                    className="mt-3 flex gap-2"
                  >
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="Enter code (e.g. KOVAC20)"
                      className="flex-1 rounded-xl border border-line bg-ink px-3.5 py-2 text-xs font-semibold uppercase text-bone placeholder:normal-case placeholder:text-smoke focus:border-ember focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="rounded-xl bg-bone px-4 py-2 text-xs font-bold text-ink transition-colors hover:bg-ember"
                    >
                      Apply
                    </button>
                  </form>

                  {promoFeedback && (
                    <p
                      className={cn(
                        "mt-2 text-xs font-medium",
                        promoFeedback.ok ? "text-emerald-400" : "text-amber-400"
                      )}
                    >
                      {promoFeedback.message}
                    </p>
                  )}

                  {/* One-click test promo pills */}
                  <div className="mt-3 flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] text-smoke">Try code:</span>
                    {["KOVAC20", "FIRST15", "APEX10"].map((code) => (
                      <button
                        key={code}
                        type="button"
                        onClick={() => handleQuickPromo(code)}
                        className="rounded-md border border-line bg-ink/80 px-2 py-0.5 font-mono text-[10px] font-bold text-ember transition-colors hover:border-ember"
                      >
                        {code}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Line Breakdown */}
                <div className="mt-6 space-y-3 border-t border-line pt-6 text-sm">
                  <div className="flex justify-between text-smoke">
                    <span>Subtotal</span>
                    <span className="font-semibold text-bone">${subtotal}</span>
                  </div>

                  {promo && (
                    <div className="flex justify-between text-emerald-400">
                      <span>
                        Discount ({promo.code} · {promo.discountPercent}% off)
                      </span>
                      <span className="font-semibold">-${discountAmount}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-smoke">
                    <span>
                      Shipping (
                      {shippingTier === "express"
                        ? "Express Air"
                        : shippingTier === "overnight"
                        ? "Overnight"
                        : "Standard"}
                      )
                    </span>
                    <span className="font-semibold text-bone">
                      {shippingCost === 0 ? (
                        <span className="text-emerald-400">FREE</span>
                      ) : (
                        `$${shippingCost}`
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-smoke">
                    <span>Estimated Tax</span>
                    <span className="font-semibold text-bone">
                      ${estimatedTax}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between border-t border-line pt-4">
                    <span className="font-display text-lg font-bold text-bone">
                      Estimated Total
                    </span>
                    <div className="text-right">
                      <span className="font-display text-3xl font-bold text-ember">
                        ${total}
                      </span>
                      <p className="text-[11px] text-smoke">
                        Or 4 interest-free payments of $
                        {Math.round((total / 4) * 100) / 100}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Primary CTA */}
                <div className="mt-7">
                  {step === "cart" ? (
                    <button
                      type="button"
                      disabled={items.length === 0}
                      onClick={() => setStep("checkout")}
                      className="group flex w-full items-center justify-center gap-2.5 rounded-full bg-ember py-4 font-display text-sm font-bold text-ink shadow-[0_0_45px_-10px_rgba(61, 123, 255,0.75)] transition-all hover:bg-ember-2 disabled:opacity-40"
                    >
                      Proceed to Express Checkout
                      <ArrowRight
                        size={16}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setStep("cart")}
                      className="flex w-full items-center justify-center gap-2 rounded-full border border-line bg-panel py-3.5 text-xs font-semibold text-smoke hover:text-bone"
                    >
                      <ArrowLeft size={14} /> Return to Bag Overview
                    </button>
                  )}
                </div>

                {/* Trust Guarantees */}
                <div className="mt-7 space-y-3 border-t border-line pt-6 text-xs text-smoke">
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck size={16} className="shrink-0 text-ember" />
                    <span>
                      <strong className="text-bone">
                        30-Day Wear Trial:
                      </strong>{" "}
                      Run in it outside. Full refund if it doesn't earn its
                      place.
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <RotateCcw size={16} className="shrink-0 text-ember" />
                    <span>
                      <strong className="text-bone">
                        Free Prepaid Returns & Exchanges:
                      </strong>{" "}
                      Instant size swaps with zero restocking fee.
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="shrink-0 text-ember" />
                    <span>
                      <strong className="text-bone">
                        2-Year Structural Warranty:
                      </strong>{" "}
                      Covers seam failure, zippers & membrane delamination.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
