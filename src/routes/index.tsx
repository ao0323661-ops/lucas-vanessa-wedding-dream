import { createFileRoute, Link } from "@tanstack/react-router";
import { lazy, Suspense, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Loader2 } from "lucide-react";
import { Nav } from "@/components/Nav";
import { Countdown } from "@/components/Countdown";
import { Section } from "@/components/Section";
import { RsvpForm } from "@/components/RsvpForm";
import { GuestAccessGate } from "@/components/GuestAccessGate";
import { MessageWall } from "@/components/MessageWall";
import { GiftList } from "@/components/GiftList";
import { WEDDING } from "@/lib/wedding";
import type { InvitedGuestMatch } from "@/lib/invited-guests";

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
const ProtectedWeddingDetails = lazy(() => import("@/components/ProtectedWeddingDetails"));

const reveal = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

function Home() {
  const [validatedGuest, setValidatedGuest] = useState<InvitedGuestMatch | null>(null);

  return (
    <div id="top" className="min-h-screen bg-background text-foreground">
      <Nav />

      <section className="relative flex h-[100svh] min-h-[640px] items-stretch justify-center overflow-hidden px-5 text-white sm:px-6">
        <motion.img
          src={WEDDING.photos.hero}
          alt={WEDDING.names.full}
          width={720}
          height={1280}
          fetchPriority="high"
          initial={{ scale: 1.025, y: 0 }}
          animate={{ scale: 1.07, y: -10 }}
          transition={{ duration: 24, ease: "easeOut" }}
          className="absolute inset-0 h-full w-full object-cover object-[50%_43%] will-change-transform sm:object-[50%_41%] md:object-[50%_34%]"
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, rgba(57,68,47,0.46), rgba(47,42,36,0.72))",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_34%,transparent_0%,rgba(47,42,36,0.08)_32%,rgba(47,42,36,0.55)_100%)]" />
        <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-gradient-to-l from-[#2F2A24]/50 via-[#2F2A24]/18 to-transparent md:block" />
        <div className="cinematic-grain absolute inset-0" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-background via-background/62 to-transparent" />

        <motion.div
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 mx-auto flex h-full w-full max-w-7xl flex-col items-center justify-end pb-24 pt-28 text-center sm:pb-28 md:items-end md:pb-32 md:text-right"
        >
          <div className="max-w-[min(100%,760px)]">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="mb-6 flex items-center justify-center gap-4 md:justify-end"
            >
              <span className="h-px w-12 bg-gold/70" />
              <span className="text-[10px] uppercase tracking-[0.36em] text-white/78">
                {WEDDING.dateLabel}
              </span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.05, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-6xl leading-[0.82] text-white text-balance drop-shadow-[0_22px_54px_rgb(0_0_0_/_0.52)] sm:text-8xl md:text-9xl 2xl:text-[10rem]"
            >
              {WEDDING.names.groom}
              <span className="mx-2 font-script text-5xl leading-none text-gold drop-shadow-[0_12px_30px_rgb(0_0_0_/_0.38)] sm:mx-4 sm:text-7xl md:text-8xl 2xl:text-9xl">
                &
              </span>
              {WEDDING.names.bride}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.95, delay: 0.34, ease: [0.16, 1, 0.3, 1] }}
              className="mx-auto mt-6 max-w-md font-display text-2xl italic leading-relaxed text-white/88 drop-shadow-[0_10px_24px_rgb(0_0_0_/_0.34)] sm:text-3xl md:mr-0 md:text-4xl"
            >
              Nosso grande dia
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.43, ease: [0.16, 1, 0.3, 1] }}
              className="mx-auto mt-4 max-w-lg text-sm font-light leading-7 text-white/76 text-pretty md:mr-0"
            >
              Uma celebração íntima, natural e elegante para viver com calma o começo de uma nova
              história.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.58, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 flex flex-col items-center gap-3 sm:flex-row md:justify-end"
            >
              <motion.a
                href="#local"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="shine-line inline-flex min-h-[54px] items-center justify-center gap-3 rounded-md bg-gold px-8 py-4 text-[10px] font-semibold uppercase tracking-[0.28em] text-background shadow-[0_22px_55px_-28px_rgb(0_0_0_/_0.9)] transition-all duration-500 hover:bg-champagne sm:text-xs"
              >
                Confirmar presença
                <ArrowRight size={16} />
              </motion.a>
              <motion.a
                href="#local"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex min-h-[54px] items-center justify-center rounded-md border border-white/35 bg-black/18 px-8 py-4 text-[10px] uppercase tracking-[0.28em] text-white/88 shadow-[0_18px_45px_-32px_rgb(0_0_0_/_0.9)] backdrop-blur-md transition-all duration-500 hover:border-gold/70 hover:bg-white/12 hover:text-white sm:text-xs"
              >
                Ver detalhes
              </motion.a>
            </motion.div>
          </div>
        </motion.div>

        <motion.a
          href="#historia"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 8, 0] }}
          transition={{
            opacity: { delay: 1.2, duration: 0.7 },
            y: { repeat: Infinity, duration: 2.2 },
          }}
          className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-white/62 text-[9px] uppercase tracking-[0.32em] [@media(max-height:760px)]:hidden"
          aria-label="Role para ver a história"
        >
          Role
          <ChevronDown size={18} />
        </motion.a>
      </section>

      <section className="relative overflow-hidden bg-background px-5 py-20 sm:px-6 sm:py-28">
        <div className="warm-light pointer-events-none absolute inset-0 opacity-70" />
        <div className="editorial-rule absolute inset-x-8 top-0" />
        <div className="relative z-10 mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl"
          >
            <p className="gold-kicker">Editorial Wedding</p>
            <h2 className="mt-5 font-display text-5xl leading-[0.92] text-balance sm:text-7xl">
              O tempo desacelera quando a história é vivida por inteiro.
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.95, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="editorial-panel rounded-md p-5 sm:p-8"
          >
            <Countdown target={WEDDING.date} />
          </motion.div>
        </div>
      </section>

      <Section
        id="historia"
        eyebrow="Nossa história"
        title="A linha do tempo de Lucas & Vanessa"
        className="overflow-x-hidden"
      >
        <div className="relative mx-auto max-w-5xl">
          <div className="absolute bottom-0 left-4 top-0 w-px bg-gradient-to-b from-transparent via-gold/60 to-transparent sm:left-1/2" />
          {WEDDING.timeline.map((t, i) => (
            <motion.div
              key={t.year}
              variants={reveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-70px" }}
              transition={{ duration: 0.78, ease: [0.16, 1, 0.3, 1], delay: i * 0.04 }}
              className={`relative mb-12 pl-12 last:mb-0 sm:mb-16 sm:flex sm:pl-0 ${
                i % 2 ? "sm:flex-row-reverse" : ""
              }`}
            >
              <div className="absolute left-4 top-7 h-3 w-3 -translate-x-1/2 rounded-full bg-gold ring-8 ring-background sm:left-1/2" />
              <div
                className={`sm:w-1/2 ${i % 2 ? "sm:pl-12 sm:text-left" : "sm:pr-12 sm:text-right"}`}
              >
                <div className="editorial-panel group relative overflow-hidden rounded-md p-7 transition-transform duration-500 hover:-translate-y-1 sm:p-8">
                  <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent opacity-70" />
                  <div className="font-display text-5xl leading-none text-gold">{t.year}</div>
                  <h3 className="mt-4 font-display text-3xl leading-tight">{t.title}</h3>
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
        <div className="grid auto-rows-[210px] grid-cols-2 gap-3 sm:auto-rows-[260px] sm:gap-5 md:grid-cols-4 md:gap-6">
          {gallery.map((src, i) => (
            <motion.figure
              key={`${src}-${i}`}
              initial={{ opacity: 0, y: 28, scale: 0.985 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{ y: -8 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.78, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className={`group relative overflow-hidden rounded-md border border-background/10 bg-linen/10 shadow-[0_34px_100px_-58px_rgb(0_0_0_/_0.8)] ${
                i === 0 ? "col-span-2 row-span-2" : ""
              } ${i === 3 ? "md:row-span-2" : ""}`}
            >
              <img
                src={src}
                alt={`Momento ${i + 1} de Lucas e Vanessa`}
                loading={i === 0 ? "eager" : "lazy"}
                className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2F2A24]/82 via-transparent to-[#39442F]/12 opacity-80 transition-opacity duration-500 group-hover:opacity-95" />
              <div className="absolute inset-x-5 bottom-5 flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.26em] text-background/82">
                  Capítulo {String(i + 1).padStart(2, "0")}
                </span>
                <span className="h-px w-10 bg-gold/70 transition-all duration-500 group-hover:w-16" />
              </div>
            </motion.figure>
          ))}
        </div>
      </Section>

      <Section
        id="local"
        eyebrow={validatedGuest ? "O grande dia" : "Convite"}
        title={validatedGuest ? "Cerimônia e celebração" : "Detalhes reservados com cuidado"}
      >
        {validatedGuest ? (
          <Suspense
            fallback={
              <div className="editorial-panel mx-auto flex max-w-3xl items-center justify-center gap-3 rounded-md px-6 py-12 text-muted-foreground">
                <Loader2 size={18} className="animate-spin text-gold" />
                <span className="text-xs uppercase tracking-[0.28em]">
                  Preparando os detalhes...
                </span>
              </div>
            }
          >
            <ProtectedWeddingDetails guest={validatedGuest} />
          </Suspense>
        ) : (
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className="max-w-xl pt-2">
              <p className="gold-kicker">Acesso ao endereço e RSVP</p>
              <p className="mt-5 font-display text-4xl leading-tight text-balance sm:text-5xl">
                A experiência segue aberta. Os detalhes práticos ficam reservados aos convidados.
              </p>
              <p className="mt-5 text-muted-foreground text-pretty">
                Quando chegar o momento de ver o endereço e confirmar presença, digite o nome ou
                apelido exatamente como está no convite.
              </p>
            </div>
            <GuestAccessGate onValidated={setValidatedGuest} />
          </div>
        )}
      </Section>

      <Section id="presentes" eyebrow="Lista de presentes" title="Cotas de lua de mel">
        <p className="mx-auto mb-14 max-w-2xl text-center text-muted-foreground text-pretty">
          Sua presença é o presente que mais importa. As cotas abaixo são gestos simbólicos para a
          nova etapa, com a leveza de uma lista afetiva.
        </p>
        <GiftList />
      </Section>

      <Section id="mural" eyebrow="Mural" title="Mensagens de quem amamos" dark>
        <MessageWall />
      </Section>

      {validatedGuest && (
        <Section id="rsvp" eyebrow="Confirme sua presença" title="RSVP">
          <div className="editorial-panel relative mx-auto max-w-3xl overflow-hidden rounded-md p-6 sm:p-10 md:p-12">
            <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
            <RsvpForm
              invitedGuest={{
                id: validatedGuest.id,
                displayName: validatedGuest.display_name,
                allowedCompanions: validatedGuest.allowed_companions,
              }}
            />
          </div>
        </Section>
      )}

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
