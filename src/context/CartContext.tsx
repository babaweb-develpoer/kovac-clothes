import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  PRODUCTS,
  PROMO_CODES,
  type Product,
  type PromoCode,
} from "../data/products";

export type CartItem = {
  key: string; // `${productId}-${size}-${colorwayIndex}`
  productId: string;
  size: string;
  colorwayIndex: number;
  quantity: number;
};

export type ShippingTier = "standard" | "express" | "overnight";

export type ToastMessage = {
  id: string;
  title: string;
  subtitle?: string;
};

export type ActiveView = "landing" | "cart" | "story";

type CartContextType = {
  items: CartItem[];
  wishlist: string[];
  activeView: ActiveView;
  setActiveView: (v: ActiveView) => void;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (v: boolean) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (p: Product | null) => void;
  storyProductId: string | null;
  openProductStory: (productId: string) => void;
  closeProductStory: (sectionId?: string) => void;
  promo: PromoCode | null;
  shippingTier: ShippingTier;
  setShippingTier: (t: ShippingTier) => void;
  addItem: (
    productId: string,
    size?: string,
    colorwayIndex?: number,
    quantity?: number,
    openDrawer?: boolean
  ) => void;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  updateItemSize: (key: string, newSize: string) => void;
  toggleWishlist: (productId: string) => void;
  moveToWishlist: (key: string) => void;
  moveToCartFromWishlist: (productId: string) => void;
  applyPromo: (rawCode: string) => { ok: boolean; message: string };
  removePromo: () => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  discountAmount: number;
  shippingCost: number;
  estimatedTax: number;
  total: number;
  freeShippingThreshold: number;
  freeShippingRemaining: number;
  toasts: ToastMessage[];
  dismissToast: (id: string) => void;
  openCartPage: () => void;
  openLandingPage: (sectionId?: string) => void;
};

const STORAGE_KEY = "kovac_cart_v1";
const WISHLIST_KEY = "kovac_wishlist_v1";

const DEFAULT_CART: CartItem[] = [
  {
    key: "atlas-M-0",
    productId: "atlas",
    size: "M",
    colorwayIndex: 0,
    quantity: 1,
  },
];

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return DEFAULT_CART;
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return ["ridge"];
  });

  const [activeView, setActiveView] = useState<ActiveView>("landing");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(
    null
  );
  const [storyProductId, setStoryProductId] = useState<string | null>(null);
  const [promo, setPromo] = useState<PromoCode | null>(null);
  const [shippingTier, setShippingTier] = useState<ShippingTier>("express");
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    } catch {
      // ignore
    }
  }, [wishlist]);

  const pushToast = (title: string, subtitle?: string) => {
    const id = Math.random().toString(36).slice(2, 9);
    setToasts((prev) => [...prev, { id, title, subtitle }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3400);
  };

  const dismissToast = (id: string) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));

  const addItem = (
    productId: string,
    size = "M",
    colorwayIndex = 0,
    quantity = 1,
    openDrawer = true
  ) => {
    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product) return;

    const key = `${productId}-${size}-${colorwayIndex}`;
    setItems((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) =>
          i.key === key ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { key, productId, size, colorwayIndex, quantity }];
    });

    const colorName =
      product.colorways[colorwayIndex]?.name ?? product.colorways[0].name;
    pushToast(
      `Added ${product.name} to cart`,
      `Size ${size} · ${colorName}`
    );

    if (openDrawer && activeView === "landing") {
      setIsDrawerOpen(true);
    }
  };

  const removeItem = (key: string) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
    pushToast("Item removed from cart");
  };

  const updateQuantity = (key: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(key);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.key === key ? { ...i, quantity } : i))
    );
  };

  const updateItemSize = (key: string, newSize: string) => {
    setItems((prev) => {
      const target = prev.find((i) => i.key === key);
      if (!target) return prev;
      const newKey = `${target.productId}-${newSize}-${target.colorwayIndex}`;
      const existingNew = prev.find((i) => i.key === newKey && i.key !== key);
      if (existingNew) {
        return prev
          .filter((i) => i.key !== key)
          .map((i) =>
            i.key === newKey
              ? { ...i, quantity: i.quantity + target.quantity }
              : i
          );
      }
      return prev.map((i) =>
        i.key === key ? { ...i, size: newSize, key: newKey } : i
      );
    });
    pushToast(`Size updated to ${newSize}`);
  };

  const toggleWishlist = (productId: string) => {
    const product = PRODUCTS.find((p) => p.id === productId);
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        pushToast(`Removed ${product?.name ?? "item"} from wishlist`);
        return prev.filter((id) => id !== productId);
      } else {
        pushToast(`Saved ${product?.name ?? "item"} to wishlist`);
        return [...prev, productId];
      }
    });
  };

  const moveToWishlist = (key: string) => {
    const item = items.find((i) => i.key === key);
    if (!item) return;
    if (!wishlist.includes(item.productId)) {
      setWishlist((prev) => [...prev, item.productId]);
    }
    setItems((prev) => prev.filter((i) => i.key !== key));
    const product = PRODUCTS.find((p) => p.id === item.productId);
    pushToast(
      `Moved ${product?.name ?? "item"} to Saved for Later`,
      `Size ${item.size}`
    );
  };

  const moveToCartFromWishlist = (productId: string) => {
    addItem(productId, "M", 0, 1, false);
    setWishlist((prev) => prev.filter((id) => id !== productId));
  };

  const applyPromo = (rawCode: string) => {
    const normalized = rawCode.trim().toUpperCase();
    if (!normalized) {
      return { ok: false, message: "Enter a promo code" };
    }
    const found = PROMO_CODES[normalized];
    if (!found) {
      return {
        ok: false,
        message: "Invalid code. Try KOVAC20 or FIRST15",
      };
    }
    setPromo(found);
    pushToast(`Promo ${found.code} applied!`, found.label);
    return { ok: true, message: `${found.label} applied` };
  };

  const removePromo = () => {
    setPromo(null);
    pushToast("Promo code removed");
  };

  const clearCart = () => {
    setItems([]);
    setPromo(null);
  };

  const itemCount = useMemo(
    () => items.reduce((acc, item) => acc + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => {
      const product = PRODUCTS.find((p) => p.id === item.productId);
      return acc + (product?.price ?? 0) * item.quantity;
    }, 0);
  }, [items]);

  const discountAmount = useMemo(() => {
    if (!promo) return 0;
    return Math.round((subtotal * promo.discountPercent) / 100);
  }, [subtotal, promo]);

  const freeShippingThreshold = 150;
  const freeShippingRemaining = Math.max(
    0,
    freeShippingThreshold - (subtotal - discountAmount)
  );

  const shippingCost = useMemo(() => {
    if (items.length === 0) return 0;
    const eligibleForFree = subtotal - discountAmount >= freeShippingThreshold;
    if (shippingTier === "standard") return eligibleForFree ? 0 : 12;
    if (shippingTier === "express") return eligibleForFree ? 0 : 18;
    if (shippingTier === "overnight") return 29;
    return 0;
  }, [items.length, subtotal, discountAmount, shippingTier]);

  const estimatedTax = useMemo(() => {
    const taxable = Math.max(0, subtotal - discountAmount);
    return Math.round(taxable * 0.0825);
  }, [subtotal, discountAmount]);

  const total = useMemo(() => {
    if (items.length === 0) return 0;
    return Math.max(0, subtotal - discountAmount) + shippingCost + estimatedTax;
  }, [items.length, subtotal, discountAmount, shippingCost, estimatedTax]);

  const openCartPage = () => {
    setIsDrawerOpen(false);
    setQuickViewProduct(null);
    setActiveView("cart");
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  };

  const openLandingPage = (sectionId?: string) => {
    setIsDrawerOpen(false);
    setQuickViewProduct(null);
    setActiveView("landing");
    if (sectionId) {
      window.setTimeout(() => {
        const el = document.getElementById(sectionId);
        el?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    }
  };

  const openProductStory = (productId: string) => {
    if (!PRODUCTS.some((p) => p.id === productId)) return;
    setIsDrawerOpen(false);
    setQuickViewProduct(null);
    setStoryProductId(productId);
    setActiveView("story");
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  };

  const closeProductStory = (sectionId = "lineup") => {
    openLandingPage(sectionId);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        wishlist,
        activeView,
        setActiveView,
        isDrawerOpen,
        setIsDrawerOpen,
        quickViewProduct,
        setQuickViewProduct,
        storyProductId,
        openProductStory,
        closeProductStory,
        promo,
        shippingTier,
        setShippingTier,
        addItem,
        removeItem,
        updateQuantity,
        updateItemSize,
        toggleWishlist,
        moveToWishlist,
        moveToCartFromWishlist,
        applyPromo,
        removePromo,
        clearCart,
        itemCount,
        subtotal,
        discountAmount,
        shippingCost,
        estimatedTax,
        total,
        freeShippingThreshold,
        freeShippingRemaining,
        toasts,
        dismissToast,
        openCartPage,
        openLandingPage,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside a CartProvider");
  return ctx;
}
