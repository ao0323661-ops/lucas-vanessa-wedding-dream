import { motion } from "framer-motion";
import type { ReactNode } from "react";

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export function Section({
  id,
  eyebrow,
  title,
  children,
  className = "",
  dark = false,
}: {
  id?: string;
  eyebrow?: string;
  title?: string;
  children: ReactNode;
  className?: string;
  dark?: boolean;
}) {
  return (
    <section
      id={id}
      className={`relative overflow-hidden px-5 py-28 sm:px-6 sm:py-40 ${
        dark
          ? "bg-gradient-dark text-background shadow-[inset_0_1px_0_rgb(255_250_240_/_0.12)]"
          : "bg-background text-foreground"
      } ${className}`}
    >
      <div className="warm-light pointer-events-none absolute inset-0 opacity-60" />
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-24 ${
          dark
            ? "bg-gradient-to-b from-foreground/20 to-transparent"
            : "bg-gradient-to-b from-olive-deep/[0.045] to-transparent"
        }`}
      />
      <div
        className={`pointer-events-none absolute inset-x-0 bottom-0 h-24 ${
          dark
            ? "bg-gradient-to-t from-foreground/16 to-transparent"
            : "bg-gradient-to-t from-olive-deep/[0.04] to-transparent"
        }`}
      />
      <div className="mx-auto max-w-7xl">
        {(eyebrow || title) && (
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-90px" }}
            transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 mx-auto mb-16 max-w-4xl text-center sm:mb-24"
          >
            {eyebrow && (
              <span
                className="editorial-divider editorial-kicker"
                style={dark ? { color: "var(--sage)" } : undefined}
              >
                {eyebrow}
              </span>
            )}
            {title && (
              <h2
                className={`mt-6 font-display text-5xl leading-[0.9] text-balance sm:text-7xl ${
                  dark ? "text-background" : "text-foreground"
                }`}
              >
                {title}
              </h2>
            )}
          </motion.div>
        )}
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-70px" }}
          transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1], delay: 0.04 }}
          className="relative z-10"
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
}
