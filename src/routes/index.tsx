import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, ChevronDown, Clock, MapPin } from "lucide-react";
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
      { title: "Lucas & Vanessa - Nosso Casamento" },
      {
        name: "description",
        content:
          "Celebre o casamento de Lucas & Vanessa. Confirme sua presença, veja os detalhes do grande dia, envie uma mensagem e participe das cotas de lua de mel.",
      },
      { property: "og:title", content: "Lucas & Vanessa - Nosso Casamento" },
      {
        property: "og:description",
        content: "Confirme sua presença e acompanhe os detalhes do casamento de Lucas & Vanessa.",
      },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:site_name", content: "Lucas & Vanessa - Nosso Casamento" },
      { property: "og:image", content: WEDDING.photos.hero },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Lucas & Vanessa - Nosso Casamento" },
      {
        name: "twitter:description",
        content: "Confirme sua presença e acompanhe os detalhes do casamento de Lucas & Vanessa.",
      },
      { name: "twitter:image", content: WEDDING.photos.hero },
      {
        name: "keywords",
        content:
          "casamento Lucas e Vanessa, Lucas & Vanessa, confirmação de presença, RSVP, lista de presentes",
      },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&family=Great+Vibes&display=swap",
      },
    ],
  }),
  component: Home,
});

const gallery = WEDDING.photos.gallery;

const reveal = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

function Home() {
  return (
    <div id="top" className="min-h-screen bg-background text-foreground">
      <Nav />

      <section className="relative flex h-[calc(100svh-34px)] min-h-[620px] items-center justify-center overflow-hidden px-5 pb-12 pt-24 text-background sm:px-6">
        <motion.img
          src={WEDDING.photos.hero}
          alt={WEDDING.names.full}
          width={1920}
          height={1080}
          fetchPriority="high"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1.16 }}
          transition={{ duration: 18, ease: "easeOut" }}
          className="absolute inset-0 h-full w-full object-cover object-[52%_center]"
        />
        <div className="hero-vignette absolute inset-0" />
        <div className="cinematic-grain absolute inset-0" />
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-background via-background/45 to-transparent" />

        <motion.div
          initial={{ opacity: 0, y: 38 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center text-center"
        >
          <motion.span
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="glass-luxe rounded-full px-5 py-2 text-[10px] uppercase tracking-[0.34em] text-olive-deep sm:text-xs"
          >
            {WEDDING.dateLabel}
          </motion.span>

          <h1 className="mt-5 font-display text-5xl leading-[0.84] text-background text-balance drop-shadow-[0_14px_34px_rgb(48_63_40_/_0.26)] sm:text-7xl md:text-8xl 2xl:text-9xl">
            {WEDDING.names.groom}
            <span className="my-1 block font-script text-4xl leading-none text-gold drop-shadow-[0_12px_30px_rgb(48_63_40_/_0.26)] sm:my-2 sm:text-6xl md:text-7xl 2xl:text-8xl">
              &
            </span>
            {WEDDING.names.bride}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35 }}
            className="mx-auto mt-5 max-w-xl font-display text-lg italic leading-relaxed text-background/86 text-pretty sm:text-xl md:text-2xl"
          >
            "{WEDDING.heroPhrase}"
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.52 }}
            className="mt-6 w-full sm:mt-8"
          >
            <Countdown target={WEDDING.date} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.68 }}
            className="mt-5 flex flex-col items-center gap-3 sm:flex-row"
          >
            <a
              href="#rsvp"
              className="shine-line inline-flex min-h-[54px] items-center justify-center gap-3 rounded-md bg-gold px-8 py-4 text-[10px] font-semibold uppercase tracking-[0.28em] text-background shadow-gold transition-all duration-500 hover:bg-olive-deep sm:text-xs"
            >
              Confirmar presença
              <ArrowRight size={16} />
            </a>
            <a
              href="#local"
              className="inline-flex min-h-[54px] items-center justify-center gap-3 rounded-md border border-olive/25 bg-linen/45 px-8 py-4 text-[10px] uppercase tracking-[0.28em] text-olive-deep/78 backdrop-blur transition-all duration-500 hover:border-olive/55 hover:text-olive-deep sm:text-xs"
            >
              Ver detalhes
            </a>
          </motion.div>
        </motion.div>

        <motion.a
          href="#historia"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 8, 0] }}
          transition={{
            opacity: { delay: 1.2, duration: 0.7 },
            y: { repeat: Infinity, duration: 2.2 },
          }}
          className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-olive-deep/55 text-[9px] uppercase tracking-[0.32em] [@media(max-height:760px)]:hidden"
          aria-label="Role para ver a história"
        >
          Role
          <ChevronDown size={18} />
        </motion.a>
      </section>

      <Section
        id="historia"
        eyebrow="Nossa história"
        title="A linha do tempo de Lucas & Vanessa"
        className="overflow-x-hidden"
      >
        <div className="relative mx-auto max-w-4xl">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold/60 to-transparent sm:left-1/2" />
          {WEDDING.timeline.map((t, i) => (
            <motion.div
              key={t.year}
              variants={reveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-70px" }}
              transition={{ duration: 0.78, ease: [0.16, 1, 0.3, 1], delay: i * 0.04 }}
              className={`relative mb-10 pl-12 last:mb-0 sm:mb-14 sm:flex sm:pl-0 ${
                i % 2 ? "sm:flex-row-reverse" : ""
              }`}
            >
              <div className="absolute left-4 top-6 h-3 w-3 -translate-x-1/2 rounded-full bg-gold ring-8 ring-background sm:left-1/2" />
              <div
                className={`sm:w-1/2 ${i % 2 ? "sm:pl-12 sm:text-left" : "sm:pr-12 sm:text-right"}`}
              >
                <div className="paper-luxe rounded-md p-6 sm:p-7">
                  <div className="font-display text-4xl leading-none text-gold">{t.year}</div>
                  <h3 className="mt-3 font-display text-2xl leading-tight">{t.title}</h3>
                  <p className="mt-3 text-sm text-muted-foreground text-pretty sm:text-base">
                    {t.text}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section id="galeria" eyebrow="Galeria" title="Momentos do nosso caminho" dark>
        <div className="grid auto-rows-[180px] grid-cols-2 gap-3 sm:auto-rows-[220px] sm:gap-5 md:grid-cols-4">
          {gallery.map((src, i) => (
            <motion.figure
              key={`${src}-${i}`}
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{ y: -6 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.68, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className={`group relative overflow-hidden rounded-md border border-olive/15 bg-linen/25 shadow-[0_24px_70px_-48px_rgb(77_92_60_/_0.55)] ${
                i === 0 ? "col-span-2 row-span-2" : ""
              } ${i === 3 ? "md:row-span-2" : ""}`}
            >
              <img
                src={src}
                alt={`Momento ${i + 1} de Lucas e Vanessa`}
                loading={i === 0 ? "eager" : "lazy"}
                className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-olive-deep/70 via-transparent to-foreground/10 opacity-70 transition-opacity duration-500 group-hover:opacity-90" />
              <div className="absolute inset-x-4 bottom-4 flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.26em] text-background/82">
                  Capítulo {String(i + 1).padStart(2, "0")}
                </span>
                <span className="h-px w-10 bg-gold/70 transition-all duration-500 group-hover:w-16" />
              </div>
            </motion.figure>
          ))}
        </div>
      </Section>

      <Section id="local" eyebrow="O grande dia" title="Cerimônia e celebração">
        <div className="grid gap-6 md:grid-cols-2">
          {[WEDDING.ceremony, WEDDING.reception].map((place, i) => (
            <motion.article
              key={place.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.76, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="paper-luxe group relative overflow-hidden rounded-md p-7 transition-transform duration-500 hover:-translate-y-1 sm:p-10"
            >
              <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-olive/45 to-transparent" />
              <div className="mb-8 flex items-center justify-between gap-4">
                <div className="gold-kicker">{i === 0 ? "Cerimônia" : "Festa"}</div>
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-olive/25 bg-olive/[0.08] text-gold">
                  {i === 0 ? <CalendarDays size={18} /> : <Clock size={18} />}
                </span>
              </div>
              <h3 className="font-display text-3xl leading-tight text-balance sm:text-4xl">
                {place.name}
              </h3>
              <p className="mt-5 flex gap-3 text-muted-foreground text-pretty">
                <MapPin className="mt-1 h-4 w-4 shrink-0 text-gold" />
                <span>{place.address}</span>
              </p>
              <p className="mt-5 font-display text-3xl text-foreground">{place.time}</p>
              <a
                href={place.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="shine-line mt-8 inline-flex min-h-[48px] items-center justify-center gap-3 rounded-md bg-gold px-6 py-3 text-[10px] uppercase tracking-[0.28em] text-background transition-all duration-500 hover:bg-olive-deep"
              >
                Abrir no Google Maps
                <ArrowRight size={15} />
              </a>
            </motion.article>
          ))}
        </div>
      </Section>

      <Section id="presentes" eyebrow="Lista de presentes" title="Cotas de lua de mel">
        <p className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground text-pretty">
          Sua presença é o nosso maior presente. Mas se quiser nos ajudar a tornar a lua de mel
          inesquecível, escolha uma cota simbólica abaixo - pagamento via Pix.
        </p>
        <GiftList />
      </Section>

      <Section id="mural" eyebrow="Mural" title="Mensagens de quem amamos" dark>
        <MessageWall />
      </Section>

      <Section id="rsvp" eyebrow="Confirme sua presença" title="RSVP">
        <div className="paper-luxe relative mx-auto max-w-3xl overflow-hidden rounded-md p-6 sm:p-10 md:p-12">
          <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-olive/45 to-transparent" />
          <RsvpForm />
        </div>
      </Section>

      <footer className="relative overflow-hidden bg-olive-deep px-6 py-14 text-center text-background">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-champagne to-transparent" />
        <p className="font-script text-5xl leading-none text-gold">{WEDDING.names.full}</p>
        <p className="mt-4 text-xs uppercase tracking-[0.32em] text-background/70">
          {WEDDING.dateLabel}
        </p>
        <Link
          to="/admin"
          className="mt-7 inline-block text-[10px] uppercase tracking-[0.3em] text-background/55 transition-colors hover:text-gold"
        >
          Área dos noivos
        </Link>
      </footer>
    </div>
  );
}
