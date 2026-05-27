import { useEffect, useState } from "react";

function getDiff(target: Date) {
  const ms = Math.max(0, target.getTime() - Date.now());
  const days = Math.floor(ms / 86400000);
  const hours = Math.floor((ms % 86400000) / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return { days, hours, minutes, seconds };
}

export function Countdown({ target }: { target: Date }) {
  const [t, setT] = useState(() => getDiff(target));
  useEffect(() => {
    const i = setInterval(() => setT(getDiff(target)), 1000);
    return () => clearInterval(i);
  }, [target]);

  const items = [
    { label: "Dias", value: t.days },
    { label: "Horas", value: t.hours },
    { label: "Min", value: t.minutes },
    { label: "Seg", value: t.seconds },
  ];

  return (
    <div className="flex items-center justify-center gap-3 sm:gap-6">
      {items.map((it) => (
        <div key={it.label} className="text-center">
          <div className="min-w-[64px] sm:min-w-[88px] rounded-md border border-gold/40 bg-black/30 backdrop-blur px-3 py-4 sm:py-5">
            <div className="font-display text-3xl sm:text-5xl text-gold tabular-nums">
              {String(it.value).padStart(2, "0")}
            </div>
          </div>
          <div className="mt-2 text-[10px] sm:text-xs uppercase tracking-[0.3em] text-white/70">
            {it.label}
          </div>
        </div>
      ))}
    </div>
  );
}
