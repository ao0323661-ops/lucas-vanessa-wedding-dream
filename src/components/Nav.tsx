import { useEffect, useState } from "react";

const links = [
  { href: "#historia", label: "Nossa História" },
  { href: "#galeria", label: "Galeria" },
  { href: "#local", label: "Local" },
  { href: "#presentes", label: "Presentes" },
  { href: "#mural", label: "Mural" },
  { href: "#rsvp", label: "Confirmar" },
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
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-background/85 backdrop-blur border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#top" className={`font-display text-xl tracking-wide ${scrolled ? "text-foreground" : "text-white"}`}>
          L <span className="text-gold">&</span> V
        </a>
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`text-xs uppercase tracking-[0.25em] hover:text-gold transition-colors ${
                scrolled ? "text-foreground/80" : "text-white/90"
              }`}
            >
              {l.label}
            </a>
          ))}
        </nav>
        <button
          onClick={() => setOpen(!open)}
          className={`md:hidden text-xs uppercase tracking-[0.25em] ${scrolled ? "text-foreground" : "text-white"}`}
          aria-label="Menu"
        >
          {open ? "Fechar" : "Menu"}
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-background border-t border-border px-6 py-6 flex flex-col gap-4">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-sm uppercase tracking-[0.25em] text-foreground/80 hover:text-gold"
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
