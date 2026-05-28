import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Heart, Loader2, Minus, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const schema = z.object({
  full_name: z.string().trim().min(1, "Nome do convite inválido").max(120),
  attending: z.enum(["yes", "no"]),
  companions: z.number().min(0).max(10),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  dietary_restrictions: z.string().trim().max(300).optional().or(z.literal("")),
  message: z.string().trim().max(600).optional().or(z.literal("")),
});

type RsvpInvitedGuest = {
  id: string;
  displayName: string;
  allowedCompanions: number;
};

type RsvpFormProps = {
  invitedGuest?: RsvpInvitedGuest;
};

function isDuplicateRsvpError(error: { code?: string; message?: string } | null) {
  return (
    error?.code === "23505" ||
    error?.message?.includes("rsvps_unique_invited_guest_id_idx") ||
    error?.message?.includes("rsvps_unique_normalized_phone_idx") ||
    error?.message?.includes("rsvps_unique_no_phone_normalized_name_idx")
  );
}

export function RsvpForm({ invitedGuest }: RsvpFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attending, setAttending] = useState<"yes" | "no">("yes");
  const [companions, setCompanions] = useState(0);
  const [alreadySent, setAlreadySent] = useState(false);
  const [storedAttending, setStoredAttending] = useState<"yes" | "no" | null>(null);
  const maxCompanions = invitedGuest
    ? Math.max(0, Math.min(10, Math.trunc(invitedGuest.allowedCompanions)))
    : 0;
  const storageKey = invitedGuest ? `rsvp_status_${invitedGuest.id}` : null;

  useEffect(() => {
    setAlreadySent(false);
    setStoredAttending(null);
    setDone(false);

    if (!storageKey) return;

    const status = localStorage.getItem(storageKey);
    if (status === "yes" || status === "no") {
      setAlreadySent(true);
      setStoredAttending(status);
    }
  }, [storageKey]);

  useEffect(() => {
    setCompanions((current) => Math.min(current, maxCompanions));
  }, [maxCompanions]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!invitedGuest || !storageKey) {
      setError("Valide seu convite antes de confirmar presença.");
      return;
    }

    if (alreadySent) {
      setError("Você já enviou sua confirmação.");
      return;
    }

    if (attending === "yes" && companions > maxCompanions) {
      setError(`Este convite permite no máximo ${maxCompanions} acompanhante(s).`);
      return;
    }

    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      full_name: invitedGuest.displayName,
      attending,
      companions,
      phone: String(fd.get("phone") || ""),
      dietary_restrictions: String(fd.get("dietary_restrictions") || ""),
      message: String(fd.get("message") || ""),
    });

    if (!parsed.success) {
      setError(parsed.error.errors[0].message || "Verifique os campos do formulário.");
      return;
    }

    setSubmitting(true);

    const { error: insertError } = await supabase.from("rsvps").insert({
      full_name: parsed.data.full_name,
      attending: parsed.data.attending === "yes",
      companions:
        parsed.data.attending === "yes" ? Math.min(parsed.data.companions, maxCompanions) : 0,
      invited_guest_id: invitedGuest.id,
      phone: parsed.data.phone || null,
      dietary_restrictions: parsed.data.dietary_restrictions || null,
      message: parsed.data.message || null,
    });

    setSubmitting(false);

    if (insertError) {
      setError(
        isDuplicateRsvpError(insertError)
          ? "Já existe uma confirmação para este convite."
          : "Não conseguimos registrar agora. Verifique os campos e tente novamente.",
      );
      return;
    }

    localStorage.setItem(storageKey, parsed.data.attending);
    setStoredAttending(parsed.data.attending);
    setDone(true);
  }

  if (!invitedGuest) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-2 py-8 text-center sm:px-6 sm:py-10"
      >
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-olive/30 bg-olive/[0.08] text-olive shadow-natural">
          <Check size={22} />
        </div>
        <h3 className="mb-4 font-display text-4xl leading-tight text-balance sm:text-5xl">
          Valide seu convite primeiro
        </h3>
        <p className="mx-auto max-w-md font-light tracking-wide text-muted-foreground text-pretty">
          O RSVP aparece assim que o nome do convite é confirmado.
        </p>
      </motion.div>
    );
  }

  if (done || alreadySent) {
    const displayAttending = done ? attending : storedAttending || "yes";
    return (
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden px-2 py-8 text-center sm:px-6 sm:py-10"
      >
        <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-olive/45 to-transparent" />
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-olive/30 bg-olive/[0.08] text-olive shadow-natural">
          {displayAttending === "yes" ? <Heart size={22} /> : <Check size={22} />}
        </div>
        <div className="editorial-divider editorial-kicker mb-6 justify-center">RSVP</div>
        <h3 className="mb-4 font-display text-4xl leading-tight text-balance sm:text-5xl">
          {displayAttending === "yes" ? "Sua presença está confirmada" : "Obrigado por avisar"}
        </h3>
        <p className="mx-auto max-w-md font-light tracking-wide text-muted-foreground text-pretty">
          {displayAttending === "yes"
            ? "Mal podemos esperar para celebrar com você este dia tão especial."
            : "Sentiremos sua falta, mas agradecemos o carinho."}
        </p>
        <p className="mx-auto mt-8 max-w-md text-xs uppercase tracking-[0.22em] text-muted-foreground/75">
          Para alterar a resposta, fale com Lucas ou Vanessa.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <Field label="Convidado principal">
        <div className="rounded-md border border-olive/20 bg-olive/[0.06] px-5 py-4">
          <p className="font-display text-3xl leading-tight text-foreground">
            {invitedGuest.displayName}
          </p>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Nome confirmado na lista de convidados
          </p>
        </div>
      </Field>

      <Field label="Você vai comparecer?">
        <div className="flex flex-col gap-3 sm:flex-row">
          {[
            { v: "yes", l: "Sim, eu vou" },
            { v: "no", l: "Não poderei ir" },
          ].map((o) => (
            <button
              type="button"
              key={o.v}
              onClick={() => setAttending(o.v as "yes" | "no")}
              className={`group relative min-h-[56px] flex-1 overflow-hidden rounded-md border px-4 py-4 text-xs uppercase tracking-[0.18em] transition-all duration-500 ${
                attending === o.v
                  ? "border-olive bg-olive text-background shadow-natural"
                  : "border-border bg-background/40 text-foreground hover:border-olive/55 hover:bg-olive/[0.05]"
              }`}
            >
              {attending === o.v && (
                <span className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-linen/75 to-transparent" />
              )}
              {o.l}
            </button>
          ))}
        </div>
      </Field>

      <AnimatePresence>
        {attending === "yes" && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <Field label="Acompanhantes (além de você)">
              <div className="mt-2 flex items-center gap-5">
                <button
                  type="button"
                  onClick={() => setCompanions(Math.max(0, companions - 1))}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background/50 text-foreground transition-all hover:border-olive hover:text-olive disabled:opacity-40"
                  aria-label="Diminuir acompanhantes"
                  disabled={companions === 0}
                >
                  <Minus size={18} />
                </button>
                <span className="flex h-14 min-w-14 items-center justify-center rounded-md border border-olive/25 bg-olive/[0.08] px-4 font-display text-4xl text-foreground">
                  {companions}
                </span>
                <button
                  type="button"
                  onClick={() => setCompanions(Math.min(maxCompanions, companions + 1))}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background/50 text-foreground transition-all hover:border-olive hover:text-olive disabled:opacity-40"
                  aria-label="Aumentar acompanhantes"
                  disabled={companions === maxCompanions}
                >
                  <Plus size={18} />
                </button>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Este convite permite até {maxCompanions} acompanhante(s).
              </p>
            </Field>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Telefone / WhatsApp">
          <input name="phone" maxLength={40} placeholder="(00) 00000-0000" className={inputCls} />
        </Field>

        <Field label="Restrição alimentar">
          <input
            name="dietary_restrictions"
            maxLength={300}
            placeholder="Ex: Alérgico a camarão"
            className={inputCls}
          />
        </Field>
      </div>

      <Field label="Mensagem para os noivos">
        <textarea
          name="message"
          maxLength={600}
          rows={3}
          className={inputCls}
          placeholder="Deixe um carinho para nós..."
        />
      </Field>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-md border border-destructive/20 bg-destructive/5 px-4 py-3 text-center text-xs uppercase tracking-widest text-destructive"
        >
          {error}
        </motion.p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="shine-line flex min-h-[58px] w-full items-center justify-center gap-3 rounded-md bg-olive px-6 py-5 text-[10px] uppercase tracking-[0.34em] text-background shadow-natural transition-all duration-500 hover:bg-olive-deep disabled:cursor-wait disabled:opacity-70 sm:text-xs"
      >
        {submitting && <Loader2 size={16} className="animate-spin" />}
        {submitting ? "Processando..." : "Confirmar presença"}
      </button>
    </form>
  );
}

const inputCls =
  "w-full rounded-none border-0 border-b border-border bg-transparent px-1 py-4 font-light text-foreground outline-none transition-all duration-300 placeholder:text-muted-foreground/45 focus:border-olive focus:bg-olive/[0.04]";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="block">
      <span className="mb-3 block text-[10px] uppercase tracking-[0.28em] text-muted-foreground/80">
        {label}
      </span>
      {children}
    </div>
  );
}
