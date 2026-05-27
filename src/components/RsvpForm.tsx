import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

const schema = z.object({
  full_name: z.string().trim().min(2).max(120),
  attending: z.enum(["yes", "no"]),
  companions: z.number().min(0).max(10),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  dietary_restrictions: z.string().trim().max(300).optional().or(z.literal("")),
  message: z.string().trim().max(600).optional().or(z.literal("")),
});

export function RsvpForm() {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attending, setAttending] = useState<"yes" | "no">("yes");
  const [companions, setCompanions] = useState(0);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
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
      setError("Verifique os campos do formulário.");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("rsvps").insert({
      full_name: parsed.data.full_name,
      attending: parsed.data.attending === "yes",
      companions: parsed.data.attending === "yes" ? parsed.data.companions : 0,
      phone: parsed.data.phone || null,
      dietary_restrictions: parsed.data.dietary_restrictions || null,
      message: parsed.data.message || null,
    });
    setSubmitting(false);
    if (error) {
      setError("Não conseguimos registrar agora. Tente novamente.");
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12 px-6 border border-gold/40 rounded-md bg-secondary/40"
      >
        <div className="gold-divider text-xs uppercase tracking-[0.4em]">Obrigado</div>
        <h3 className="mt-5 font-display text-3xl">Sua presença está confirmada</h3>
        <p className="mt-3 text-muted-foreground">Mal podemos esperar para celebrar com você.</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Field label="Nome completo">
        <input name="full_name" required maxLength={120} className={inputCls} />
      </Field>

      <Field label="Você vai comparecer?">
        <div className="flex gap-3">
          {[
            { v: "yes", l: "Sim, eu vou" },
            { v: "no", l: "Não poderei ir" },
          ].map((o) => (
            <button
              type="button"
              key={o.v}
              onClick={() => setAttending(o.v as "yes" | "no")}
              className={`flex-1 px-4 py-3 rounded-md text-sm uppercase tracking-[0.2em] border transition-all ${
                attending === o.v
                  ? "bg-foreground text-background border-foreground"
                  : "bg-transparent border-border hover:border-gold"
              }`}
            >
              {o.l}
            </button>
          ))}
        </div>
      </Field>

      {attending === "yes" && (
        <Field label="Acompanhantes">
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => setCompanions(Math.max(0, companions - 1))} className="w-10 h-10 rounded-full border border-border hover:border-gold">−</button>
            <span className="font-display text-3xl w-12 text-center">{companions}</span>
            <button type="button" onClick={() => setCompanions(Math.min(10, companions + 1))} className="w-10 h-10 rounded-full border border-border hover:border-gold">+</button>
          </div>
        </Field>
      )}

      <Field label="Telefone / WhatsApp">
        <input name="phone" maxLength={40} placeholder="(11) 99999-9999" className={inputCls} />
      </Field>

      <Field label="Restrição alimentar">
        <input name="dietary_restrictions" maxLength={300} placeholder="Vegetariano, sem glúten, etc." className={inputCls} />
      </Field>

      <Field label="Mensagem para os noivos">
        <textarea name="message" maxLength={600} rows={4} className={inputCls} />
      </Field>

      {error && <p className="text-destructive text-sm">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-4 bg-foreground text-background uppercase tracking-[0.3em] text-xs hover:bg-gold hover:text-foreground transition-colors disabled:opacity-60"
      >
        {submitting ? "Enviando…" : "Confirmar presença"}
      </button>
    </form>
  );
}

const inputCls = "w-full bg-transparent border-b border-border focus:border-gold outline-none px-1 py-3 text-foreground placeholder:text-muted-foreground/60 transition-colors";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">{label}</span>
      {children}
    </label>
  );
}
