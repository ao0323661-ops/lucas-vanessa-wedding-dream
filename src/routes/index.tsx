import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Nav } from "@/components/Nav";
import { Countdown } from "@/components/Countdown";
import { Section } from "@/components/Section";
import { RsvpForm } from "@/components/RsvpForm";
import { MessageWall } from "@/components/MessageWall";
import { GiftList } from "@/components/GiftList";
import { WEDDING } from "@/lib/wedding";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lucas & Vanessa — Nosso Casamento" },
      {
        name: "description",
        content:
          "Celebre conosco o início de uma nova história. Confirme sua presença, deixe uma mensagem e descubra todos os detalhes do nosso casamento.",
      },
      { property: "og:title", content: "Lucas & Vanessa — Nosso Casamento" },
      { property: "og:description", content: "Celebre conosco o início de uma nova história." },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Inter:wght@300;400;500;600&family=Great+Vibes&display=swap",
      },
    ],
  }),
  component: Home,
});

const gallery = WEDDING.photos.gallery;

function Home() {
  return (
    <div id="top" className="min-h-screen bg-background text-foreground">
      <Nav />

      {/* HERO */}
      <section className="relative h-screen min-h-[640px] flex items-center justify-center overflow-hidden">
        <img
          src={WEDDING.photos.hero}
          alt={WEDDING.names.full}
          width={1920}
          height={1080}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          className="relative z-10 text-center px-6"
        >
          <span className="gold-divider text-[10px] sm:text-xs uppercase tracking-[0.5em] text-gold">
            {WEDDING.dateLabel}
          </span>
          <h1 className="mt-8 font-display text-6xl sm:text-8xl md:text-9xl text-white leading-none">
            {WEDDING.names.groom}
            <span className="block font-script text-gold text-5xl sm:text-7xl md:text-8xl my-2 sm:my-4">
              &
            </span>
            {WEDDING.names.bride}
          </h1>
          <p className="mt-6 max-w-md mx-auto text-white/80 italic font-display text-lg sm:text-xl">
            "{WEDDING.heroPhrase}"
          </p>

          <div className="mt-12">
            <Countdown target={WEDDING.date} />
          </div>

          <a
            href="#rsvp"
            className="inline-block mt-14 px-10 py-4 bg-gold text-foreground text-xs uppercase tracking-[0.4em] hover:bg-white transition-colors shadow-gold"
          >
            Confirmar presença
          </a>
        </motion.div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 text-xs uppercase tracking-[0.4em] animate-pulse">
          ↓ Role
        </div>
      </section>

      {/* HISTÓRIA */}
      <Section id="historia" eyebrow="Nossa história" title="A linha do tempo do nosso amor">
        <div className="relative max-w-3xl mx-auto">
          <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold/60 to-transparent" />
          {WEDDING.timeline.map((t, i) => (
            <motion.div
              key={t.year}
              initial={{ opacity: 0, x: i % 2 ? 30 : -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7 }}
              className={`relative mb-12 sm:mb-16 pl-12 sm:pl-0 sm:flex ${i % 2 ? "sm:flex-row-reverse" : ""}`}
            >
              <div className="absolute left-4 sm:left-1/2 top-2 -translate-x-1/2 w-3 h-3 rounded-full bg-gold ring-4 ring-background" />
              <div
                className={`sm:w-1/2 ${i % 2 ? "sm:pl-12 sm:text-left" : "sm:pr-12 sm:text-right"}`}
              >
                <div className="text-gold font-display text-4xl">{t.year}</div>
                <h3 className="mt-2 font-display text-2xl">{t.title}</h3>
                <p className="mt-2 text-muted-foreground">{t.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* GALERIA */}
      <Section id="galeria" eyebrow="Galeria" title="Momentos do nosso caminho" dark>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
          {gallery.map((src, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
              className={`overflow-hidden rounded-md ${i === 0 ? "col-span-2 row-span-2" : ""}`}
            >
              <img
                src={src}
                alt={`Foto ${i + 1}`}
                loading="lazy"
                className="w-full h-full object-cover aspect-[4/5] hover:scale-105 transition-transform duration-700"
              />
            </motion.div>
          ))}
        </div>
      </Section>

      {/* LOCAL */}
      <Section id="local" eyebrow="O grande dia" title="Cerimônia e celebração">
        <div className="grid md:grid-cols-2 gap-8">
          {[WEDDING.ceremony, WEDDING.reception].map((place, i) => (
            <motion.div
              key={place.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className="p-8 sm:p-10 border border-border hover:border-gold transition-colors rounded-md bg-card"
            >
              <div className="text-[10px] uppercase tracking-[0.4em] text-gold">
                {i === 0 ? "Cerimônia" : "Festa"}
              </div>
              <h3 className="mt-3 font-display text-3xl">{place.name}</h3>
              <p className="mt-4 text-muted-foreground">{place.address}</p>
              <p className="mt-2 font-display text-2xl text-foreground">{place.time}</p>
              <a
                href={place.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-6 px-6 py-3 bg-foreground text-background text-xs uppercase tracking-[0.3em] hover:bg-gold hover:text-foreground transition-colors"
              >
                Abrir no Google Maps
              </a>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* PRESENTES */}
      <Section id="presentes" eyebrow="Lista de presentes" title="Cotas de lua de mel">
        <p className="text-center max-w-xl mx-auto text-muted-foreground mb-12">
          Sua presença é o nosso maior presente. Mas se quiser nos ajudar a tornar a lua de mel
          inesquecível, escolha uma cota simbólica abaixo — pagamento via Pix.
        </p>
        <GiftList />
      </Section>

      {/* MURAL */}
      <Section id="mural" eyebrow="Mural" title="Mensagens de quem amamos" dark>
        <MessageWall />
      </Section>

      {/* RSVP */}
      <Section id="rsvp" eyebrow="Confirme sua presença" title="RSVP">
        <div className="max-w-2xl mx-auto p-8 sm:p-12 border border-border rounded-md bg-card shadow-luxe">
          <RsvpForm />
        </div>
      </Section>

      <footer className="bg-foreground text-background py-12 px-6 text-center">
        <p className="font-script text-gold text-4xl">{WEDDING.names.full}</p>
        <p className="mt-2 text-sm text-background/60 tracking-[0.3em] uppercase">
          {WEDDING.dateLabel}
        </p>
        <Link
          to="/admin"
          className="mt-6 inline-block text-xs text-background/40 hover:text-gold uppercase tracking-[0.3em]"
        >
          Área dos noivos
        </Link>
      </footer>
    </div>
  );
}
