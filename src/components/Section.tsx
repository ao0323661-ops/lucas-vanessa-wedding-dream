import { motion } from "framer-motion";
import type { ReactNode } from "react";

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
      className={`py-20 sm:py-28 px-6 ${dark ? "bg-foreground text-background" : "bg-background text-foreground"} ${className}`}
    >
      <div className="max-w-6xl mx-auto">
        {(eyebrow || title) && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-14"
          >
            {eyebrow && <span className="gold-divider text-xs uppercase tracking-[0.4em]">{eyebrow}</span>}
            {title && (
              <h2 className="mt-5 font-display text-4xl sm:text-6xl">
                {title}
              </h2>
            )}
          </motion.div>
        )}
        {children}
      </div>
    </section>
  );
}
