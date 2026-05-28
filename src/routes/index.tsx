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
      { title: "Lucas & Vanessa - Convite" },
      {
        name: "description",
        content:
          "Convite reservado para o casamento de Lucas & Vanessa, com galeria, detalhes e confirmação de presença.",
      },
      { property: "og:title", content: "Lucas & Vanessa - Convite" },
      {
        property: "og:description",
        content: "Uma experiência visual reservada para os convidados de Lucas & Vanessa.",
      },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:site_name", content: "Lucas & Vanessa - Convite" },
      { property: "og:image", content: WEDDING.photos.hero },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Lucas & Vanessa - Convite" },
      {
        name: "twitter:description",
        content: "Uma experiência visual reservada para os convidados de Lucas & Vanessa.",
      },
      { name: "twitter:image", content: WEDDING.photos.hero },
      {
        name: "keywords",
        content: "casamento Lucas e Vanessa, Lucas & Vanessa, convite, RSVP, galeria",
      },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap",
      },
    ],
  }),
  component: Home,
});

const ProtectedWeddingDetails = lazy(() => import("@/components/ProtectedWeddingDetails"));

const reveal = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

const editorialNotes = [
  {
    label: "Presença",
    text: "Uma celebração reservada, desenhada para ser vivida de perto.",
  },
  {
    label: "Ritmo",
    text: "Poucas palavras, pausas generosas e informação apenas quando precisa aparecer.",
  },
  {
    label: "Atmosfera",
    text: "Oliva, off-white, luz quente e fotografia como linguagem principal.",
  },
];

const visualGallery = [
  {
    src: WEDDING.photos.hero,
    alt: "Lucas e Vanessa em um retrato de fim de tarde",
    label: "Retrato",
    className: "col-span-2 row-span-2 md:col-span-2 md:row-span-2",
    imageClassName: "object-[50%_42%]",
  },
  {
    src: WEDDING.photos.gallery[1],
    alt: "Ambiente de celebração iluminado por lustres",
    label: "Ambiente",
    className: "col-span-2 md:col-span-2",
    imageClassName: "object-center",
  },
  {
    src: WEDDING.photos.gallery[0],
    alt: "Alianças em luz baixa",
    label: "Detalhe",
    className: "",
    imageClassName: "object-center",
  },
  {
    src: WEDDING.photos.hero,
    alt: "Arquitetura e luz no retrato de Lucas e Vanessa",
    label: "Luz",
    className: "",
    imageClassName: "object-[42%_20%]",
  },
  {
    src: WEDDING.photos.gallery[1],
    alt: "Recepção com mesas e iluminação cênica",
    label: "Recepção",
    className: "col-span-2 md:col-span-2",
    imageClassName: "object-[50%_58%]",
  },
];

function Home() {
  const [validatedGuest, setValidatedGuest] = useState<InvitedGuestMatch | null>(null);

  return (
    <div id="top" className="min-h-screen bg-background text-foreground">
      <Nav />

      <section className="relative flex h-[92svh] min-h-[540px] items-stretch justify-center overflow-hidden px-5 text-white sm:min-h-[620px] sm:px-6">
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
            background: "linear-gradient(to bottom, rgba(36,42,30,0.28), rgba(28,28,24,0.76))",
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(28,28,24,0.54),transparent_34%,transparent_64%,rgba(28,28,24,0.48))]" />
        <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-gradient-to-l from-[#2F2A24]/52 via-[#2F2A24]/16 to-transparent md:block" />
        <div className="cinematic-grain absolute inset-0" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-background via-background/56 to-transparent" />

        <motion.div
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 mx-auto flex h-full w-full max-w-7xl flex-col items-center justify-end pb-20 pt-24 text-center sm:pb-24 md:items-end md:pb-28 md:text-right"
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
                Convite reservado
              </span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.05, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-6xl leading-[0.84] text-white drop-shadow-[0_22px_54px_rgb(0_0_0_/_0.52)] sm:text-8xl lg:text-9xl 2xl:text-[9.5rem]"
            >
              <span className="block">{WEDDING.names.groom}</span>
              <span className="block">
                <span className="mr-3 font-display italic leading-none text-gold drop-shadow-[0_12px_30px_rgb(0_0_0_/_0.38)] sm:mr-5">
                  &
                </span>
                {WEDDING.names.bride}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.95, delay: 0.34, ease: [0.16, 1, 0.3, 1] }}
              className="mx-auto mt-6 max-w-md text-[10px] font-medium uppercase leading-relaxed tracking-[0.34em] text-white/82 drop-shadow-[0_10px_24px_rgb(0_0_0_/_0.34)] sm:text-xs md:mr-0"
            >
              {WEDDING.dateLabel} · {WEDDING.timeLabel}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.43, ease: [0.16, 1, 0.3, 1] }}
              className="mx-auto mt-5 max-w-lg text-sm font-light leading-7 text-white/78 text-pretty md:mr-0"
            >
              Um encontro íntimo, desenhado em silêncio, luz quente e presença.
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
                Acessar convite
                <ArrowRight size={16} />
              </motion.a>
              <motion.a
                href="#galeria"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex min-h-[54px] items-center justify-center rounded-md border border-white/35 bg-black/18 px-8 py-4 text-[10px] uppercase tracking-[0.28em] text-white/88 shadow-[0_18px_45px_-32px_rgb(0_0_0_/_0.9)] backdrop-blur-md transition-all duration-500 hover:border-gold/70 hover:bg-white/12 hover:text-white sm:text-xs"
              >
                Ver galeria
              </motion.a>
            </motion.div>
          </div>
        </motion.div>

        <motion.a
          href="#editorial"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 8, 0] }}
          transition={{
            opacity: { delay: 1.2, duration: 0.7 },
            y: { repeat: Infinity, duration: 2.2 },
          }}
          className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-white/62 text-[9px] uppercase tracking-[0.32em] [@media(max-height:760px)]:hidden"
          aria-label="Role para ver o convite"
        >
          Role
          <ChevronDown size={18} />
        </motion.a>
      </section>

      <section
        id="editorial"
        className="relative overflow-hidden bg-background px-5 py-20 sm:px-6 sm:py-32"
      >
        <div className="warm-light pointer-events-none absolute inset-0 opacity-45" />
        <div className="editorial-rule absolute inset-x-8 top-0" />
        <div className="relative z-10 mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl self-start"
          >
            <p className="gold-kicker">Edição nupcial</p>
            <h2 className="mt-5 font-display text-5xl leading-[0.92] text-balance sm:text-7xl">
              Um convite para olhar devagar.
            </h2>
            <p className="mt-7 max-w-xl text-sm leading-8 text-muted-foreground text-pretty sm:text-base">
              A emoção fica na imagem, na pausa e no cuidado com cada detalhe. O restante permanece
              simples, reservado e essencial.
            </p>
            <div className="mt-10 grid gap-5 sm:grid-cols-3 lg:grid-cols-1">
              {editorialNotes.map((item, i) => (
                <motion.div
                  key={item.label}
                  variants={reveal}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-70px" }}
                  transition={{ duration: 0.72, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  className="border-t border-olive/20 pt-5"
                >
                  <p className="text-[10px] uppercase tracking-[0.3em] text-gold">{item.label}</p>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground text-pretty">
                    {item.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.95, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="grid gap-5"
          >
            <figure className="relative min-h-[360px] overflow-hidden rounded-md border border-olive/15 shadow-[0_42px_120px_-72px_rgb(47_42_36_/_0.75)] sm:min-h-[520px]">
              <img
                src={WEDDING.photos.gallery[1]}
                alt="Ambiente elegante da celebração"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2f2a24]/70 via-transparent to-transparent" />
              <figcaption className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-6 text-background">
                <span className="max-w-[15rem] font-display text-3xl leading-none sm:text-4xl">
                  {WEDDING.names.full}
                </span>
                <span className="text-right text-[10px] uppercase tracking-[0.3em] text-background/70">
                  {WEDDING.dateLabel}
                </span>
              </figcaption>
            </figure>
            <div className="editorial-panel rounded-md p-5 sm:p-8">
              <Countdown target={WEDDING.date} />
            </div>
          </motion.div>
        </div>
      </section>

      <section
        id="galeria"
        className="relative overflow-hidden bg-gradient-dark px-5 py-24 text-background sm:px-6 sm:py-36"
      >
        <div className="cinematic-grain absolute inset-0 opacity-20" />
        <div className="editorial-rule absolute inset-x-8 top-0" />
        <div className="relative z-10 mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-90px" }}
            transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
            className="mb-12 grid gap-8 md:grid-cols-[0.85fr_1.15fr] md:items-end sm:mb-16"
          >
            <div>
              <p className="gold-kicker text-gold">Galeria</p>
              <h2 className="mt-5 font-display text-5xl leading-[0.9] text-background text-balance sm:text-7xl">
                Imagens antes das palavras.
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-8 text-background/70 text-pretty md:justify-self-end">
              Retratos, textura, luz e escala. A fotografia conduz o tom do encontro.
            </p>
          </motion.div>

          <div className="grid auto-rows-[190px] grid-cols-2 gap-3 sm:auto-rows-[260px] sm:gap-5 md:grid-cols-4 md:auto-rows-[250px] md:gap-6">
            {visualGallery.map((item, i) => (
              <motion.figure
                key={`${item.src}-${item.label}-${i}`}
                initial={{ opacity: 0, y: 28, scale: 0.985 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{ y: -6 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.78, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className={`group relative overflow-hidden rounded-md border border-background/10 bg-linen/10 shadow-[0_34px_100px_-58px_rgb(0_0_0_/_0.8)] ${item.className}`}
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  loading={i === 0 ? "eager" : "lazy"}
                  className={`h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105 ${item.imageClassName}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2F2A24]/82 via-transparent to-[#39442F]/10 opacity-75 transition-opacity duration-500 group-hover:opacity-95" />
                <div className="absolute inset-x-5 bottom-5 flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-[0.26em] text-background/82">
                    {item.label}
                  </span>
                  <span className="h-px w-10 bg-gold/70 transition-all duration-500 group-hover:w-16" />
                </div>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      <Section
        id="local"
        eyebrow={validatedGuest ? "Detalhes" : "Convite"}
        title={validatedGuest ? "Cerimônia e celebração" : "Acesso reservado"}
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
              <p className="gold-kicker">Endereço e RSVP</p>
              <p className="mt-5 font-display text-4xl leading-tight text-balance sm:text-5xl">
                O essencial aparece depois da validação do convite.
              </p>
              <p className="mt-5 text-muted-foreground text-pretty">
                Digite o nome ou apelido como está no convite para acessar endereço, horários e
                confirmação de presença.
              </p>
            </div>
            <GuestAccessGate onValidated={setValidatedGuest} />
          </div>
        )}
      </Section>

      <Section id="presentes" eyebrow="Presentes" title="Cotas para a viagem">
        <p className="mx-auto mb-14 max-w-2xl text-center text-muted-foreground text-pretty">
          Para quem quiser participar também por esse gesto, as cotas ficam aqui de forma simples e
          direta.
        </p>
        <GiftList />
      </Section>

      <Section id="mural" eyebrow="Mural" title="Notas dos convidados" dark>
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
        <p className="font-display text-5xl leading-none text-gold">{WEDDING.names.full}</p>
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
