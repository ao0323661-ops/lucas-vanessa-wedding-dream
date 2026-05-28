import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function getDiff(target: Date) {
  const ms = Math.max(0, target.getTime() - Date.now());
  const days = Math.floor(ms / 86400000);
  const hours = Math.floor((ms % 86400000) / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return { days, hours, minutes, seconds };
}

export function Countdown({ target }: { target: Date }) {
  const [mounted, setMounted] = useState(false);
  const [t, setT] = useState(() => ({ days: 0, hours: 0, minutes: 0, seconds: 0 }));

  useEffect(() => {
    const update = () => setT(getDiff(target));
    setMounted(true);
    update();
    const i = setInterval(update, 1000);
    return () => clearInterval(i);
  }, [target]);

  const items = [
    { label: "Dias", value: t.days },
    { label: "Horas", value: t.hours },
    { label: "Min", value: t.minutes },
    { label: "Seg", value: t.seconds },
  ];

  return (
    <div
      className="mx-auto w-full"
      role="timer"
      aria-label="Contagem regressiva para o casamento"
      aria-busy={!mounted}
    >
      <div className="mb-5 text-center">
        <span className="inline-flex rounded-full border border-gold/30 bg-background/45 px-4 py-2 text-[10px] uppercase tracking-[0.32em] text-olive-deep/80 backdrop-blur">
          Faltam
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {items.map((it) => (
          <motion.div
            key={it.label}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
          >
            <div className="shine-line relative flex min-h-[92px] items-center justify-center rounded-md border border-gold/25 bg-background/35 px-3 py-4 shadow-[0_24px_70px_-48px_rgb(47_42_36_/_0.8)] backdrop-blur sm:min-h-[108px] sm:px-4">
              <div className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent" />
              <div className="font-display text-4xl leading-none text-gold tabular-nums sm:text-5xl">
                {mounted ? String(it.value).padStart(2, "0") : "--"}
              </div>
            </div>
            <div className="mt-3 text-[9px] uppercase tracking-[0.26em] text-olive-deep/65 sm:text-xs sm:tracking-[0.3em]">
              {it.label}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
