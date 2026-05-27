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
      className="mx-auto w-full max-w-2xl"
      role="timer"
      aria-label="Contagem regressiva para o casamento"
      aria-busy={!mounted}
    >
      <div className="mb-3 text-center">
        <span className="glass-luxe inline-flex rounded-full px-4 py-2 text-[10px] uppercase tracking-[0.32em] text-olive-deep/80">
          Faltam
        </span>
      </div>
      <div className="grid grid-cols-4 gap-2.5 sm:gap-4">
        {items.map((it) => (
          <motion.div
            key={it.label}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
          >
            <div className="shine-line glass-luxe relative flex min-h-[68px] items-center justify-center rounded-md px-2 py-3 sm:min-h-[82px] sm:px-4">
              <div className="absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-olive/55 to-transparent" />
              <div className="font-display text-2xl leading-none text-gold tabular-nums sm:text-3xl">
                {mounted ? String(it.value).padStart(2, "0") : "--"}
              </div>
            </div>
            <div className="mt-2 text-[9px] uppercase tracking-[0.26em] text-olive-deep/65 sm:text-xs sm:tracking-[0.3em]">
              {it.label}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
