import { motion } from "framer-motion";
import type { ReactNode } from "react";

const sectionVariants = {
  hidden: { opacity: 0, y: 34 },
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
      className={`relative overflow-hidden px-5 py-24 sm:px-6 sm:py-32 ${
        dark
          ? "bg-gradient-dark text-foreground shadow-[inset_0_1px_0_rgb(255_255_255_/_0.35)]"
          : "bg-background text-foreground"
      } ${className}`}
    >
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-24 ${
          dark
            ? "bg-gradient-to-b from-olive-deep/[0.08] to-transparent"
            : "bg-gradient-to-b from-olive-deep/[0.035] to-transparent"
        }`}
      />
      <div
        className={`pointer-events-none absolute inset-x-0 bottom-0 h-24 ${
          dark
            ? "bg-gradient-to-t from-olive-deep/[0.08] to-transparent"
            : "bg-gradient-to-t from-olive-deep/[0.03] to-transparent"
        }`}
      />
      <div className="max-w-6xl mx-auto">
        {(eyebrow || title) && (
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-90px" }}
            transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 text-center mb-14 sm:mb-20"
          >
            {eyebrow && <span className="gold-divider gold-kicker">{eyebrow}</span>}
            {title && (
              <h2 className="mt-5 font-display text-4xl leading-[0.98] text-balance sm:text-6xl">
                {title}
              </h2>
            )}
          </motion.div>
        )}
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-70px" }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.06 }}
          className="relative z-10"
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
}
