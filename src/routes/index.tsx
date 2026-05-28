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
          "Convite reservado para o casamento de Lucas & Vanessa na Fazenda do Limoeiro, com galeria, detalhes e confirmação de presença.",
      },
      { property: "og:title", content: "Lucas & Vanessa - Convite" },
      {
        property: "og:description",
        content: "Luz natural e verde em uma experiência visual reservada.",
      },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:site_name", content: "Lucas & Vanessa - Convite" },
      { property: "og:image", content: WEDDING.photos.hero },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Lucas & Vanessa - Convite" },
      {
        name: "twitter:description",
        content: "Luz natural e verde em uma experiência visual reservada.",
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
    label: "Local",
    text: "A paisagem real da fazenda guia o tom visual do convite.",
  },
  {
    label: "Manhã",
    text: "O encontro começa às 9h, com luz natural, verde ao redor e tempo para estar presente.",
  },
  {
    label: "Atmosfera",
    text: "Oliva, off-white, natureza e poucos elementos. A elegância fica no respiro.",
  },
];

const visualGallery = {
  hero: {
    src: WEDDING.photos.gallery[0],
    alt: "Lucas e Vanessa sentados em uma escadaria histórica",
    label: "Retrato principal",
    imageClassName: "object-[50%_48%] sm:object-[50%_46%] lg:object-[50%_50%]",
  },
  secondary: {
    src: WEDDING.photos.gallery[1],
    alt: "Lucas e Vanessa entre colunas de pedra",
    label: "Arquitetura",
    imageClassName: "object-[50%_42%] sm:object-[50%_45%] lg:object-[50%_44%]",
  },
  detail: {
    src: WEDDING.photos.gallery[2],
    alt: "Detalhe da aliança em luz natural",
    label: "Detalhe",
    imageClassName: "object-[50%_30%] sm:object-[50%_32%] lg:object-[50%_30%]",
  },
};

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

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.58, ease: [0.16, 1, 0.3, 1] }}
              className="mt-9 flex flex-col items-center gap-3 sm:flex-row md:justify-end"
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
              A manhã pede leveza.
            </h2>
            <p className="mt-7 max-w-xl text-sm leading-8 text-muted-foreground text-pretty sm:text-base">
              O convite acompanha a paisagem da fazenda: luz natural, verde ao redor, silêncio bom e
              uma composição sem excesso.
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
            <figure className="relative min-h-[360px] overflow-hidden rounded-md border border-olive/15 bg-olive/[0.06] shadow-[0_42px_120px_-72px_rgb(47_42_36_/_0.75)] sm:min-h-[520px]">
              <img
                src={WEDDING.photos.venue}
                alt="Fazenda do Limoeiro em luz natural"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover object-[50%_54%] sm:object-[50%_52%] lg:object-[50%_55%]"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(246,241,231,0.02)_0%,rgba(246,241,231,0.08)_44%,rgba(57,68,47,0.58)_100%)]" />
              <figcaption className="absolute bottom-6 left-6 right-6 grid gap-5 text-background sm:grid-cols-[1fr_auto] sm:items-end">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.32em] text-background/72">
                    {WEDDING.venue.name}
                  </span>
                  <span className="mt-3 block max-w-[16rem] font-display text-3xl leading-none sm:text-4xl">
                    Paisagem aberta para uma celebração diurna
                  </span>
                </div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-background/70 sm:text-right">
                  {WEDDING.timeLabel} · luz natural
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
        className="relative overflow-hidden bg-[linear-gradient(180deg,#f6f1e7_0%,#e9eddf_100%)] px-5 py-24 text-foreground sm:px-6 sm:py-36"
      >
        <div className="warm-light pointer-events-none absolute inset-0 opacity-40" />
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
              <p className="gold-kicker">Galeria</p>
              <h2 className="mt-5 font-display text-5xl leading-[0.9] text-foreground text-balance sm:text-7xl">
                Registros dos noivos.
              </h2>
            </div>
            <div className="max-w-xl space-y-5 md:justify-self-end">
              <p className="text-sm leading-8 text-muted-foreground text-pretty">
                Uma prévia visual do convite, com retratos dos noivos e atmosfera clara, natural e
                íntima.
              </p>
              <div className="relative overflow-hidden rounded-md border border-olive/20 bg-background/45 px-5 py-4 backdrop-blur-[1px] sm:px-6 sm:py-5">
                <div className="pointer-events-none absolute inset-y-4 left-0 w-px bg-olive/55" />
                <p className="text-[10px] font-medium uppercase tracking-[0.26em] text-olive/75">
                  Fotos oficiais
                </p>
                <p className="mt-3 text-[0.95rem] leading-7 text-foreground/85 text-pretty sm:text-base sm:leading-8">
                  Após a celebração, as fotos oficiais ficarão disponíveis aqui para os convidados.
                </p>
              </div>
            </div>
          </motion.div>

          <div className="grid gap-4 sm:gap-5 lg:grid-cols-[1.12fr_0.88fr] lg:gap-6">
            <motion.figure
              initial={{ opacity: 0, y: 30, scale: 0.985 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{ y: -5 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.82, ease: [0.16, 1, 0.3, 1] }}
              className="group relative min-h-[540px] overflow-hidden rounded-md border border-olive/15 bg-linen shadow-[0_46px_130px_-76px_rgb(47_42_36_/_0.86)] sm:min-h-[680px] lg:min-h-[760px]"
            >
              <img
                src={visualGallery.hero.src}
                alt={visualGallery.hero.alt}
                loading="lazy"
                className={`absolute inset-0 h-full w-full object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-[1.035] ${visualGallery.hero.imageClassName}`}
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(246,241,231,0.04)_0%,transparent_34%,rgba(57,68,47,0.66)_100%)]" />
              <div className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100 bg-[radial-gradient(circle_at_50%_34%,transparent_0%,rgba(246,241,231,0.12)_46%,rgba(47,42,36,0.24)_100%)]" />
              <figcaption className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-5 text-background sm:inset-x-7 sm:bottom-7">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.32em] text-background/74">
                    {visualGallery.hero.label}
                  </span>
                  <span className="mt-3 block max-w-sm font-display text-3xl leading-none sm:text-5xl">
                    {WEDDING.names.full}
                  </span>
                </div>
                <span className="hidden h-px w-16 bg-gold/70 sm:block" />
              </figcaption>
            </motion.figure>

            <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-1 lg:grid-rows-[1.08fr_0.92fr] lg:gap-6">
              <motion.figure
                initial={{ opacity: 0, y: 26, scale: 0.985 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{ y: -5 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.78, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
                className="group relative min-h-[390px] overflow-hidden rounded-md border border-olive/15 bg-linen shadow-[0_34px_100px_-70px_rgb(47_42_36_/_0.74)] sm:min-h-[500px] lg:min-h-0"
              >
                <img
                  src={visualGallery.secondary.src}
                  alt={visualGallery.secondary.alt}
                  loading="lazy"
                  className={`absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04] ${visualGallery.secondary.imageClassName}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#39442F]/70 via-transparent to-[#f6f1e7]/10 opacity-78 transition-opacity duration-500 group-hover:opacity-90" />
                <figcaption className="absolute inset-x-5 bottom-5 flex items-center justify-between gap-4">
                  <span className="text-[10px] uppercase tracking-[0.28em] text-background/84">
                    {visualGallery.secondary.label}
                  </span>
                  <span className="h-px w-10 bg-gold/70 transition-all duration-500 group-hover:w-16" />
                </figcaption>
              </motion.figure>

              <motion.figure
                initial={{ opacity: 0, y: 26, scale: 0.985 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{ y: -5 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.78, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="group relative min-h-[320px] overflow-hidden rounded-md border border-olive/15 bg-olive-deep shadow-[0_34px_100px_-70px_rgb(47_42_36_/_0.78)] sm:min-h-[500px] lg:min-h-0"
              >
                <img
                  src={visualGallery.detail.src}
                  alt={visualGallery.detail.alt}
                  loading="lazy"
                  className={`absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.045] ${visualGallery.detail.imageClassName}`}
                />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(47,42,36,0.68),rgba(57,68,47,0.2)_54%,rgba(47,42,36,0.34))]" />
                <figcaption className="absolute inset-x-5 bottom-5 flex items-center justify-between gap-4">
                  <span className="text-[10px] uppercase tracking-[0.28em] text-background/84">
                    {visualGallery.detail.label}
                  </span>
                  <span className="h-px w-10 bg-gold/70 transition-all duration-500 group-hover:w-16" />
                </figcaption>
              </motion.figure>
            </div>
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

      <Section id="presentes" eyebrow="Presentes" title="Cotas para Aracaju">
        <p className="mx-auto mb-14 max-w-2xl text-center text-muted-foreground text-pretty">
          Para quem quiser participar também por esse gesto, as cotas acompanham a viagem real dos
          noivos e o começo da vida a dois.
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
