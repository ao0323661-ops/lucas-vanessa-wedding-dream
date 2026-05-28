import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const links = [
  { href: "#contagem", label: "Data" },
  { href: "#galeria", label: "Galeria" },
  { href: "#local", label: "Convite" },
  { href: "#presentes", label: "Presentes" },
  { href: "#mural", label: "Mural" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ${
        scrolled
          ? "border-b border-border/70 bg-background/80 shadow-[0_18px_55px_-42px_rgb(0_0_0_/_0.7)] backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6">
        <a
          href="#top"
          className={`group flex items-center gap-3 font-display text-xl tracking-wide transition-colors ${
            scrolled ? "text-foreground" : "text-background"
          }`}
          aria-label="Voltar ao início"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-sage/45 bg-linen/45 text-sm text-olive-deep backdrop-blur">
            LV
          </span>
          <span className="hidden sm:inline">
            Lucas <span className="text-sage">&</span> Vanessa
          </span>
        </a>
        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`relative text-xs uppercase tracking-[0.24em] transition-colors after:absolute after:-bottom-2 after:left-0 after:h-px after:w-0 after:bg-sage after:transition-all after:duration-300 hover:text-sage hover:after:w-full ${
                scrolled ? "text-foreground/75" : "text-background/88"
              }`}
            >
              {l.label}
            </a>
          ))}
        </nav>
        <button
          onClick={() => setOpen(!open)}
          className={`flex h-11 w-11 items-center justify-center rounded-full border transition-all md:hidden ${
            scrolled
              ? "border-border bg-background/60 text-foreground"
              : "border-background/25 bg-linen/[0.14] text-background backdrop-blur"
          }`}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden"
          >
            <div className="mx-4 mb-4 rounded-md border border-olive/20 bg-background/95 px-6 py-7 shadow-luxe backdrop-blur-xl">
              <nav className="flex flex-col gap-5">
                {links.map((l, index) => (
                  <motion.a
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.28, delay: index * 0.035 }}
                    className="border-b border-border/60 pb-4 text-sm uppercase tracking-[0.28em] text-foreground/80 transition-colors last:border-0 last:pb-0 hover:text-olive"
                  >
                    {l.label}
                  </motion.a>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
