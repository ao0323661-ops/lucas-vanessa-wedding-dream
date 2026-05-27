import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { ArrowRight, Check, Copy, Loader2, X } from "lucide-react";
import { WEDDING } from "@/lib/wedding";

export function GiftList() {
  const [selected, setSelected] = useState<(typeof WEDDING.gifts)[number] | null>(null);
  const [guestName, setGuestName] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function open(g: (typeof WEDDING.gifts)[number]) {
    setSelected(g);
    setAmount(g.amount);
    setDone(false);
    setCopied(false);
    setConfirming(false);
    setError(null);
  }

  async function confirm() {
    if (!selected || !guestName.trim() || amount <= 0) return;
    setError(null);
    setConfirming(true);
    const { error } = await supabase.from("gift_contributions").insert({
      guest_name: guestName.trim().slice(0, 120),
      gift_id: selected.id,
      gift_name: selected.name,
      amount,
    });
    setConfirming(false);
    if (error) {
      setError("Não conseguimos registrar essa informação agora. Tente novamente.");
      return;
    }
    setDone(true);
  }

  function copyPix() {
    navigator.clipboard.writeText(WEDDING.pix.key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {WEDDING.gifts.map((g, i) => (
          <motion.button
            key={g.name}
            onClick={() => open(g)}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -6 }}
            whileTap={{ scale: 0.99 }}
            className="paper-luxe group relative overflow-hidden rounded-md p-7 text-left transition-all duration-500 hover:border-gold/45"
          >
            <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-gold/65 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="gold-kicker mb-5">Cota</div>
            <h3 className="font-display text-2xl leading-tight text-balance">{g.name}</h3>
            <p className="mt-3 min-h-[52px] text-sm text-muted-foreground text-pretty">
              {g.description}
            </p>
            <div className="mt-7 flex items-center justify-between gap-4">
              <span className="font-display text-3xl leading-none text-foreground">
                {g.amount > 0 ? `R$ ${g.amount}` : "Livre"}
              </span>
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/25 text-gold transition-all duration-500 group-hover:border-gold group-hover:bg-gold group-hover:text-foreground">
                <ArrowRight size={16} />
              </span>
            </div>
          </motion.button>
        ))}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md"
          onClick={() => setSelected(null)}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="paper-luxe relative w-full max-w-lg overflow-hidden rounded-md p-7 sm:p-8"
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/70 text-muted-foreground transition-colors hover:border-gold hover:text-gold"
              aria-label="Fechar presente"
            >
              <X size={17} />
            </button>
            <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-gold/75 to-transparent" />
            <div className="gold-divider gold-kicker">Presente</div>
            <h3 className="mt-5 pr-12 font-display text-3xl leading-tight text-balance">
              {selected.name}
            </h3>

            {!done ? (
              <div className="mt-7 space-y-5">
                <label className="block">
                  <span className="mb-2 block text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                    Seu nome
                  </span>
                  <input
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full border-0 border-b border-border bg-transparent py-3 outline-none transition-colors focus:border-gold"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                    Valor (R$)
                  </span>
                  <input
                    type="number"
                    min={1}
                    value={amount || ""}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full border-0 border-b border-border bg-transparent py-3 outline-none transition-colors focus:border-gold"
                  />
                </label>

                <div className="rounded-md border border-gold/20 bg-gold/[0.07] p-4 text-sm">
                  <p className="mb-3 text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                    Chave Pix
                  </p>
                  <div className="flex items-center justify-between gap-3">
                    <code className="break-all text-foreground">{WEDDING.pix.key}</code>
                    <button
                      onClick={copyPix}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground text-background transition hover:bg-gold hover:text-foreground"
                      aria-label={copied ? "Chave Pix copiada" : "Copiar chave Pix"}
                    >
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">
                    O botão abaixo apenas informa aos noivos que você enviou um Pix. A conferência
                    do pagamento é manual.
                  </p>
                </div>

                {error && (
                  <p className="rounded-md border border-destructive/20 bg-destructive/5 px-4 py-3 text-xs text-destructive">
                    {error}
                  </p>
                )}

                <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                  <button
                    onClick={() => setSelected(null)}
                    className="min-h-[48px] flex-1 rounded-md border border-border text-xs uppercase tracking-[0.28em] transition-colors hover:border-gold hover:text-gold"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={confirm}
                    disabled={!guestName.trim() || amount <= 0 || confirming}
                    className="shine-line flex min-h-[48px] flex-1 items-center justify-center gap-3 rounded-md bg-foreground px-4 text-xs uppercase tracking-[0.28em] text-background transition hover:bg-gold hover:text-foreground disabled:cursor-wait disabled:opacity-55"
                  >
                    {confirming && <Loader2 size={15} className="animate-spin" />}
                    {confirming ? "Registrando..." : "Informar envio"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-7 py-8 text-center">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-gold/35 bg-gold/10 text-gold">
                  <Check size={22} />
                </div>
                <p className="font-display text-3xl">Obrigado, {guestName}!</p>
                <p className="mx-auto mt-3 max-w-sm text-muted-foreground text-pretty">
                  Registramos sua informação de envio. Os noivos farão a conferência manual do Pix.
                </p>
                <button
                  onClick={() => setSelected(null)}
                  className="shine-line mt-7 inline-flex min-h-[48px] items-center justify-center rounded-md bg-foreground px-8 text-xs uppercase tracking-[0.28em] text-background transition hover:bg-gold hover:text-foreground"
                >
                  Fechar
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </>
  );
}
