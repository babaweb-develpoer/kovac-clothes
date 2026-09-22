import { Asterisk } from "lucide-react";
import { Fragment } from "react";

const ITEMS = [
  "Free express shipping over $150",
  "30-day wear trial",
  "2-year warranty",
  "Ships in 24h",
  "Carbon-neutral delivery",
  "Worn in 34 countries",
];

function Row() {
  return (
    <div className="flex shrink-0 items-center gap-10 pr-10">
      {ITEMS.map((item) => (
        <Fragment key={item}>
          <span className="whitespace-nowrap font-display text-sm font-bold uppercase tracking-[0.18em]">
            {item}
          </span>
          <Asterisk size={18} strokeWidth={2.5} className="shrink-0" aria-hidden />
        </Fragment>
      ))}
    </div>
  );
}

export default function Ticker() {
  return (
    <div className="relative z-20 -my-5 overflow-hidden py-5" aria-hidden>
      <div className="-ml-[1%] w-[102%] -rotate-[1.1deg] border-y-2 border-ink/60 bg-ember py-3.5 text-ink shadow-[0_20px_60px_-20px_rgba(61, 123, 255,0.5)]">
        <div className="flex w-max animate-marquee-fast hover:[animation-play-state:paused]">
          <Row />
          <Row />
        </div>
      </div>
    </div>
  );
}
