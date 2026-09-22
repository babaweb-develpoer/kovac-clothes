import { Wordmark } from "./Navbar";
import type { SVGProps } from "react";

const COLS = [
  {
    title: "Shop",
    links: ["Atlas Storm Shell", "Midnight Hoodie", "Ridge Parka", "Mercer Overshirt", "Gift cards"],
  },
  {
    title: "Company",
    links: ["Our story", "Technology", "Sustainability", "Careers", "Press kit"],
  },
  {
    title: "Support",
    links: ["Size guide", "Shipping", "Returns & trial", "Warranty", "Contact"],
  },
];

function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function YoutubeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  );
}

const SOCIALS = [
  { icon: InstagramIcon, label: "Kovac on Instagram" },
  { icon: XIcon, label: "Kovac on X" },
  { icon: YoutubeIcon, label: "Kovac on YouTube" },
];

const PAYMENTS = ["VISA", "MASTERCARD", "AMEX", "PAYPAL", "APPLE PAY", "G PAY"];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line" aria-label="Footer">
      {/* Giant outlined wordmark */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center overflow-hidden" aria-hidden>
        <span className="text-stroke translate-y-[28%] select-none whitespace-nowrap font-display text-[30vw] font-bold leading-none tracking-[-0.05em]">
          KOVAC
        </span>
      </div>
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid grid-cols-1 gap-12 py-16 md:grid-cols-12 md:py-20">
          <div className="md:col-span-5">
            <Wordmark />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-smoke">
              Technical apparel built in Portland, worn everywhere.
              Designed for men who measure life in miles.
            </p>
            <div className="mt-7 flex items-center gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href="#top"
                  aria-label={s.label}
                  className="grid h-11 w-11 place-items-center rounded-full border border-line bg-bone/[0.03] text-smoke transition-all duration-300 hover:-translate-y-1 hover:border-ember/50 hover:text-ember"
                >
                  <s.icon aria-hidden />
                </a>
              ))}
            </div>
          </div>

          {COLS.map((col) => (
            <nav key={col.title} className="md:col-span-2" aria-label={col.title}>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.24em] text-bone/60">{col.title}</h3>
              <ul className="mt-5 space-y-3.5">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#top" className="text-sm text-smoke transition-colors duration-300 hover:text-ember">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="md:col-span-1" aria-hidden />
        </div>

        <div
          className="flex flex-wrap items-center gap-2.5 border-t border-line py-7"
          aria-label="Accepted payment methods"
        >
          {PAYMENTS.map((p) => (
            <span
              key={p}
              className="rounded-md border border-line bg-panel px-2.5 py-1.5 text-[9px] font-bold tracking-[0.14em] text-smoke"
            >
              {p}
            </span>
          ))}
          <span className="ml-2 text-xs text-smoke">256-bit encrypted checkout</span>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-line py-8 text-xs text-smoke md:flex-row">
          <p>© 2026 Kovac Athletics, Inc. All rights reserved. Made in Portland, OR.</p>
          <div className="flex items-center gap-6">
            {["Privacy", "Terms", "Accessibility"].map((l) => (
              <a key={l} href="#top" className="transition-colors duration-300 hover:text-bone">
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
