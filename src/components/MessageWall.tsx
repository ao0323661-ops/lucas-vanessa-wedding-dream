import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

type Msg = { id: string; name: string; message: string; created_at: string };

export function MessageWall() {
  const [items, setItems] = useState<Msg[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const { data } = await supabase
      .from("messages")
      .select("id, name, message, created_at")
      .eq("approved", true)
      .order("created_at", { ascending: false })
      .limit(30);
    if (data) setItems(data);
  }
  useEffect(() => {
    load();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setSending(true);
    setSent(false);
    setError(null);
    const { error } = await supabase.from("messages").insert({
      name: name.trim().slice(0, 80),
      message: message.trim().slice(0, 500),
      approved: false,
    });
    setSending(false);
    if (error) {
      setError("Não conseguimos enviar sua mensagem agora. Tente novamente.");
      return;
    }
    setName("");
    setMessage("");
    setSent(true);
    load();
  }

  return (
    <div className="grid lg:grid-cols-2 gap-12">
      <form
        onSubmit={submit}
        className="space-y-5 p-8 border border-border rounded-md bg-secondary/30"
      >
        <h3 className="font-display text-2xl">Deixe sua mensagem</h3>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Seu nome"
          maxLength={80}
          required
          className="w-full bg-transparent border-b border-border focus:border-gold outline-none py-3"
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Sua mensagem para os noivos…"
          maxLength={500}
          rows={4}
          required
          className="w-full bg-transparent border-b border-border focus:border-gold outline-none py-3 resize-none"
        />
        <button
          disabled={sending}
          className="px-8 py-3 bg-foreground text-background uppercase tracking-[0.3em] text-xs hover:bg-gold hover:text-foreground transition-colors"
        >
          {sending ? "Enviando…" : "Enviar"}
        </button>
        {sent && <p className="text-xs text-muted-foreground">Mensagem enviada para aprovação.</p>}
        {error && <p className="text-xs text-destructive">{error}</p>}
      </form>

      <div className="space-y-4 max-h-[520px] overflow-y-auto pr-2">
        <AnimatePresence initial={false}>
          {items.length === 0 && (
            <p className="text-muted-foreground italic">Seja o primeiro a deixar uma mensagem.</p>
          )}
          {items.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-5 border-l-2 border-gold bg-card rounded-r-md"
            >
              <p className="text-foreground/90 leading-relaxed">"{m.message}"</p>
              <p className="mt-3 text-xs uppercase tracking-[0.25em] text-gold">— {m.name}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
