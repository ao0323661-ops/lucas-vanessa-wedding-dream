import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Send } from "lucide-react";

type Msg = { id: string; name: string; message: string; created_at: string };

export function MessageWall() {
  const [items, setItems] = useState<Msg[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("messages")
      .select("id, name, message, created_at")
      .eq("approved", true)
      .order("created_at", { ascending: false })
      .limit(30);
    if (data) setItems(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

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
    void load();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:gap-12">
      <form
        onSubmit={submit}
        className="editorial-panel relative overflow-hidden rounded-md p-7 sm:p-8"
      >
        <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-sage/65 to-transparent" />
        <p className="editorial-kicker mb-4">Mural reservado</p>
        <h3 className="font-display text-4xl leading-tight">Escreva uma nota</h3>
        <div className="mt-7 space-y-5">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome"
            maxLength={80}
            required
            className="w-full border-0 border-b border-border bg-transparent py-3 text-foreground outline-none transition-colors placeholder:text-muted-foreground/45 focus:border-olive"
          />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Sua nota para Lucas e Vanessa..."
            maxLength={500}
            rows={4}
            required
            className="w-full resize-none border-0 border-b border-border bg-transparent py-3 text-foreground outline-none transition-colors placeholder:text-muted-foreground/45 focus:border-olive"
          />
          <button
            disabled={sending}
            className="shine-line flex min-h-[50px] items-center justify-center gap-3 rounded-md bg-olive px-7 text-xs uppercase tracking-[0.28em] text-background shadow-natural transition-colors hover:bg-olive-deep disabled:cursor-wait disabled:opacity-70"
          >
            {sending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
            {sending ? "Enviando..." : "Enviar"}
          </button>
        </div>
        {sent && (
          <p className="mt-5 rounded-md border border-olive/20 bg-olive/[0.06] px-4 py-3 text-xs text-muted-foreground">
            Mensagem enviada para aprovação.
          </p>
        )}
        {error && (
          <p className="mt-5 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-xs text-destructive">
            {error}
          </p>
        )}
      </form>

      <div className="luxe-scrollbar max-h-[560px] space-y-4 overflow-y-auto pr-2">
        <AnimatePresence initial={false}>
          {loading &&
            [0, 1, 2].map((item) => (
              <div
                key={item}
                className="h-28 animate-pulse rounded-md border border-olive/10 bg-linen/60"
              />
            ))}
          {!loading && items.length === 0 && (
            <p className="editorial-panel rounded-md p-6 font-display text-2xl italic text-muted-foreground">
              Seja o primeiro a deixar uma nota.
            </p>
          )}
          {!loading &&
            items.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="editorial-panel rounded-md border-l-2 border-l-sage p-6"
              >
                <p className="font-display text-2xl italic leading-relaxed text-foreground/90 text-pretty">
                  "{m.message}"
                </p>
                <p className="mt-5 text-[10px] uppercase tracking-[0.25em] text-sage">- {m.name}</p>
              </motion.div>
            ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
