import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { WEDDING } from "@/lib/wedding";

export function GiftList() {
  const [selected, setSelected] = useState<typeof WEDDING.gifts[number] | null>(null);
  const [guestName, setGuestName] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState(false);

  function open(g: typeof WEDDING.gifts[number]) {
    setSelected(g);
    setAmount(g.amount);
    setDone(false);
  }

  async function confirm() {
    if (!selected || !guestName.trim() || amount <= 0) return;
    await supabase.from("gift_contributions").insert({
      guest_name: guestName.trim().slice(0, 120),
      gift_name: selected.name,
      amount,
    });
    setDone(true);
  }

  function copyPix() {
    navigator.clipboard.writeText(WEDDING.pix.key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {WEDDING.gifts.map((g, i) => (
          <motion.button
            key={g.name}
            onClick={() => open(g)}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05, duration: 0.6 }}
            whileHover={{ y: -4 }}
            className="text-left p-7 bg-card border border-border hover:border-gold transition-colors rounded-md group"
          >
            <div className="text-[10px] uppercase tracking-[0.3em] text-gold mb-3">Cota</div>
            <h3 className="font-display text-2xl mb-2">{g.name}</h3>
            <p className="text-sm text-muted-foreground mb-5">{g.description}</p>
            <div className="flex items-baseline justify-between">
              <span className="font-display text-3xl text-foreground">
                {g.amount > 0 ? `R$ ${g.amount}` : "Livre"}
              </span>
              <span className="text-xs uppercase tracking-[0.2em] text-gold group-hover:translate-x-1 transition-transform">
                Presentear →
              </span>
            </div>
          </motion.button>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-background w-full max-w-lg p-8 rounded-md border border-gold/40 shadow-luxe"
          >
            <div className="gold-divider text-xs uppercase tracking-[0.4em]">Presente</div>
            <h3 className="mt-4 font-display text-3xl">{selected.name}</h3>

            {!done ? (
              <div className="mt-6 space-y-5">
                <label className="block">
                  <span className="block text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">Seu nome</span>
                  <input value={guestName} onChange={(e) => setGuestName(e.target.value)} className="w-full bg-transparent border-b border-border focus:border-gold outline-none py-2" />
                </label>
                <label className="block">
                  <span className="block text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">Valor (R$)</span>
                  <input type="number" min={1} value={amount || ""} onChange={(e) => setAmount(Number(e.target.value))} className="w-full bg-transparent border-b border-border focus:border-gold outline-none py-2" />
                </label>

                <div className="p-4 bg-secondary/50 rounded-md text-sm">
                  <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-2">Chave Pix</p>
                  <div className="flex items-center justify-between gap-2">
                    <code className="text-foreground break-all">{WEDDING.pix.key}</code>
                    <button onClick={copyPix} className="px-3 py-1.5 text-xs uppercase tracking-[0.2em] bg-foreground text-background hover:bg-gold hover:text-foreground transition">
                      {copied ? "Copiado" : "Copiar"}
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button onClick={() => setSelected(null)} className="flex-1 py-3 border border-border text-xs uppercase tracking-[0.3em]">Cancelar</button>
                  <button onClick={confirm} disabled={!guestName.trim() || amount <= 0} className="flex-1 py-3 bg-foreground text-background text-xs uppercase tracking-[0.3em] hover:bg-gold hover:text-foreground transition disabled:opacity-50">
                    Já enviei
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-6 text-center py-6">
                <p className="font-display text-2xl">Obrigado, {guestName}!</p>
                <p className="text-muted-foreground mt-2">Seu carinho ficará para sempre conosco.</p>
                <button onClick={() => setSelected(null)} className="mt-6 px-8 py-3 bg-foreground text-background text-xs uppercase tracking-[0.3em] hover:bg-gold hover:text-foreground transition">Fechar</button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </>
  );
}
