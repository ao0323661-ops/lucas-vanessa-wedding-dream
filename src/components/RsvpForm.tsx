import { useState, useEffect } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

const schema = z.object({
  full_name: z.string().trim().min(2, "Nome muito curto").max(120),
  attending: z.enum(["yes", "no"]),
  companions: z.number().min(0).max(10),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  dietary_restrictions: z.string().trim().max(300).optional().or(z.literal("")),
  message: z.string().trim().max(600).optional().or(z.literal("")),
});

function isDuplicateRsvpError(error: { code?: string; message?: string } | null) {
  return (
    error?.code === "23505" ||
    error?.message?.includes("rsvps_unique_normalized_phone_idx") ||
    error?.message?.includes("rsvps_unique_no_phone_normalized_name_idx")
  );
}

export function RsvpForm() {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attending, setAttending] = useState<"yes" | "no">("yes");
  const [companions, setCompanions] = useState(0);
  const [alreadySent, setAlreadySent] = useState(false);
  const [storedAttending, setStoredAttending] = useState<"yes" | "no" | null>(null);

  useEffect(() => {
    const status = localStorage.getItem("rsvp_status");
    if (status) {
      setAlreadySent(true);
      setStoredAttending(status as "yes" | "no");
    }
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (alreadySent) {
      setError("Você já enviou sua confirmação.");
      return;
    }

    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      full_name: String(fd.get("full_name") || ""),
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
      companions: parsed.data.attending === "yes" ? parsed.data.companions : 0,
      phone: parsed.data.phone || null,
      dietary_restrictions: parsed.data.dietary_restrictions || null,
      message: parsed.data.message || null,
    });

    setSubmitting(false);

    if (insertError) {
      setError(
        isDuplicateRsvpError(insertError)
          ? "Já existe uma confirmação com este telefone ou nome."
          : "Não conseguimos registrar agora. Verifique os campos e tente novamente.",
      );
      return;
    }

    localStorage.setItem("rsvp_status", parsed.data.attending);
    setStoredAttending(parsed.data.attending);
    setDone(true);
  }

  if (done || alreadySent) {
    const displayAttending = done ? attending : storedAttending || "yes";
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12 px-6 border border-gold/40 rounded-md bg-secondary/40"
      >
        <div className="gold-divider text-xs uppercase tracking-[0.4em] mb-6">RSVP</div>
        <h3 className="font-display text-4xl mb-4">
          {displayAttending === "yes" ? "Sua presença está confirmada" : "Obrigado por avisar"}
        </h3>
        <p className="text-muted-foreground font-light tracking-wide">
          {displayAttending === "yes"
            ? "Mal podemos esperar para celebrar com você este dia tão especial."
            : "Sentiremos sua falta, mas agradecemos o carinho."}
        </p>
        <button
          onClick={() => {
            localStorage.removeItem("rsvp_status");
            setAlreadySent(false);
            setDone(false);
          }}
          className="mt-8 text-[10px] uppercase tracking-[0.3em] text-muted-foreground hover:text-gold transition-colors"
        >
          Enviar outra resposta
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <Field label="Nome completo">
        <input
          name="full_name"
          required
          maxLength={120}
          className={inputCls}
          placeholder="Como está no convite"
        />
      </Field>

      <Field label="Você vai comparecer?">
        <div className="flex flex-col sm:flex-row gap-3">
          {[
            { v: "yes", l: "Sim, eu vou" },
            { v: "no", l: "Não poderei ir" },
          ].map((o) => (
            <button
              type="button"
              key={o.v}
              onClick={() => setAttending(o.v as "yes" | "no")}
              className={`flex-1 px-4 py-4 rounded-md text-xs uppercase tracking-[0.2em] border transition-all duration-300 ${
                attending === o.v
                  ? "bg-foreground text-background border-foreground shadow-lg"
                  : "bg-transparent border-border hover:border-gold/50"
              }`}
            >
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
            className="overflow-hidden"
          >
            <Field label="Acompanhantes (além de você)">
              <div className="flex items-center gap-6 mt-2">
                <button
                  type="button"
                  onClick={() => setCompanions(Math.max(0, companions - 1))}
                  className="w-12 h-12 rounded-full border border-border hover:border-gold hover:text-gold transition-all flex items-center justify-center text-xl"
                >
                  −
                </button>
                <span className="font-display text-4xl w-8 text-center">{companions}</span>
                <button
                  type="button"
                  onClick={() => setCompanions(Math.min(10, companions + 1))}
                  className="w-12 h-12 rounded-full border border-border hover:border-gold hover:text-gold transition-all flex items-center justify-center text-xl"
                >
                  +
                </button>
              </div>
            </Field>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid sm:grid-cols-2 gap-6">
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-destructive text-xs uppercase tracking-widest text-center"
        >
          {error}
        </motion.p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-5 bg-foreground text-background uppercase tracking-[0.4em] text-[10px] sm:text-xs hover:bg-gold hover:text-foreground transition-all duration-500 disabled:opacity-50 shadow-luxe"
      >
        {submitting ? "Processando…" : "Confirmar presença"}
      </button>
    </form>
  );
}

const inputCls =
  "w-full bg-transparent border-b border-border focus:border-gold outline-none px-1 py-4 text-foreground placeholder:text-muted-foreground/40 transition-all duration-300 font-light";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="block">
      <span className="block text-[10px] uppercase tracking-[0.3em] text-muted-foreground/80 mb-3">
        {label}
      </span>
      {children}
    </div>
  );
}
