export type Colorway = {
  name: string;
  hex: string;
  accent?: string;
};

export type ProductSpec = {
  weight: string;
  drop: string;
  plate: string;
  upper: string;
  terrain: string;
};

export type Product = {
  id: string;
  name: string;
  subtitle: string;
  tag?: string;
  tagTone?: "ember" | "bone";
  cats: ("Everyday" | "Performance")[];
  price: number;
  compare?: number;
  blurb: string;
  description: string;
  img: string;
  glow: string;
  colorways: Colorway[];
  sizes: string[];
  specs: ProductSpec;
};

export const APPAREL_SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;
export type GarmentSize = (typeof APPAREL_SIZES)[number];

export const PRODUCTS: Product[] = [
  {
    id: "atlas",
    name: "Atlas Storm Shell",
    subtitle: "3-Layer Weather Shell",
    tag: "Best seller",
    tagTone: "ember",
    cats: ["Everyday", "Performance"],
    price: 289,
    compare: 340,
    blurb: "The flagship. Storm-ready, city-quiet.",
    description:
      "A 3-layer KovaShell™ membrane rated to 20,000 mm waterproofing, bonded with StormLock™ seams. Engineered for men who commute through weather, not around it.",
    img: "https://images.pexels.com/photos/13980607/pexels-photo-13980607.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    glow: "rgba(61, 123, 255, 0.34)",
    colorways: [
      { name: "Cobalt Night", hex: "#16233f", accent: "#3d7bff" },
      { name: "Storm Blue", hex: "#3d7bff", accent: "#0b1220" },
      { name: "Graphite", hex: "#23262b", accent: "#8ab4ff" },
    ],
    sizes: [...APPAREL_SIZES],
    specs: {
      weight: "860 g (L)",
      drop: "Relaxed",
      plate: "KovaShell™ 3-layer",
      upper: "StormLock™ taped seams",
      terrain: "City / Trail / Rain",
    },
  },
  {
    id: "midnight",
    name: "Midnight Hoodie",
    subtitle: "Heavyweight Terry Hoodie",
    cats: ["Everyday"],
    price: 149,
    compare: 185,
    blurb: "Triple-black heavyweight fleece for after hours.",
    description:
      "480 gsm loopback French terry with a matte, anti-pill face and zero visible branding. Cut for the man whose day ends after everyone else's.",
    img: "https://images.pexels.com/photos/21939625/pexels-photo-21939625.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    glow: "rgba(90, 120, 190, 0.3)",
    colorways: [
      { name: "Pitch Black", hex: "#0a0a0c", accent: "#26262c" },
      { name: "Ink Wash", hex: "#181a1f", accent: "#3a3f4a" },
      { name: "Slate", hex: "#3a3f4a", accent: "#0a0a0c" },
    ],
    sizes: [...APPAREL_SIZES],
    specs: {
      weight: "610 g (L)",
      drop: "Regular",
      plate: "ThermoCore™ fleece",
      upper: "480 gsm French terry",
      terrain: "Night / Studio / Streets",
    },
  },
  {
    id: "ridge",
    name: "Ridge Parka",
    subtitle: "All-Terrain Storm Parka",
    tag: "New",
    tagTone: "ember",
    cats: ["Performance"],
    price: 329,
    compare: 380,
    blurb: "Articulated storm protection for ridge and road.",
    description:
      "A 40D ripstop shell with a Kevlar-reinforced yoke and fully sealed storm flaps. Built for alpine weather, quiet enough for the airport lounge.",
    img: "https://images.pexels.com/photos/12918275/pexels-photo-12918275.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    glow: "rgba(70, 100, 190, 0.3)",
    colorways: [
      { name: "Ridge Blue", hex: "#1f3a68", accent: "#8ab4ff" },
      { name: "Storm Navy", hex: "#101a33", accent: "#3d7bff" },
      { name: "Basalt", hex: "#24262b", accent: "#8f97a6" },
    ],
    sizes: [...APPAREL_SIZES],
    specs: {
      weight: "720 g (L)",
      drop: "Articulated",
      plate: "RipTrak™ 3L Pro",
      upper: "40D ripstop, DWR",
      terrain: "Alpine / Storm / Ridge",
    },
  },
  {
    id: "mercer",
    name: "Mercer Overshirt",
    subtitle: "Bone Canvas Overshirt",
    tag: "Low stock",
    tagTone: "bone",
    cats: ["Everyday"],
    price: 189,
    compare: 235,
    blurb: "Bone canvas minimalism. Zero logos, all signal.",
    description:
      "12 oz cotton canvas, garment-washed for a lived-in drape, with corozo buttons and a single blue index stitch at the hem. The quiet anchor of a rotation.",
    img: "https://images.pexels.com/photos/16964407/pexels-photo-16964407.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    glow: "rgba(190, 195, 210, 0.22)",
    colorways: [
      { name: "Bone Canvas", hex: "#e8e2d4", accent: "#b9b2a2" },
      { name: "Slate Herringbone", hex: "#8f97a6", accent: "#101a33" },
      { name: "Espresso Twill", hex: "#2a2a2e", accent: "#e8e2d4" },
    ],
    sizes: [...APPAREL_SIZES],
    specs: {
      weight: "540 g (L)",
      drop: "Tailored",
      plate: "Twill core",
      upper: "12 oz bone canvas",
      terrain: "Office / Travel / Evening",
    },
  },
];

export type PromoCode = {
  code: string;
  discountPercent: number;
  label: string;
};

export const PROMO_CODES: Record<string, PromoCode> = {
  KOVAC20: { code: "KOVAC20", discountPercent: 20, label: "20% VIP Founder Discount" },
  FIRST15: { code: "FIRST15", discountPercent: 15, label: "15% First Drop Welcome" },
  APEX10: { code: "APEX10", discountPercent: 10, label: "10% Member Savings" },
};
