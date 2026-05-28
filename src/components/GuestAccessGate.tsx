import { useEffect, useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, Search, UserRoundCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  type InvitedGuestMatch,
  normalizeGuestName,
  readStoredInvitedGuest,
  storeInvitedGuest,
} from "@/lib/invited-guests";

type GuestAccessGateProps = {
  onValidated: (guest: InvitedGuestMatch) => void;
};

export function GuestAccessGate({ onValidated }: GuestAccessGateProps) {
  const [nameInput, setNameInput] = useState("");
  const [matches, setMatches] = useState<InvitedGuestMatch[]>([]);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedGuest = readStoredInvitedGuest();
    if (storedGuest) onValidated(storedGuest);
  }, [onValidated]);

  function validateGuest(guest: InvitedGuestMatch) {
    storeInvitedGuest(guest);
    onValidated(guest);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedName = normalizeGuestName(nameInput);
    setError(null);
    setSearched(false);
    setMatches([]);

    if (normalizedName.length < 3) {
      setError("Digite pelo menos 3 letras do nome que está no convite.");
      return;
    }

    setSearching(true);
    const { data, error: searchError } = await supabase.rpc("search_invited_guest", {
      name_input: nameInput,
    });
    setSearching(false);

    if (searchError) {
      setError("Não conseguimos verificar agora. Tente novamente em instantes.");
      return;
    }

    const results = data ?? [];
    setSearched(true);

    if (results.length === 1) {
      validateGuest(results[0]);
      return;
    }

    setMatches(results);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
      className="paper-luxe relative mx-auto max-w-3xl overflow-hidden rounded-md p-6 sm:p-10"
    >
      <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-olive/45 to-transparent" />
      <div className="mx-auto mb-7 flex h-14 w-14 items-center justify-center rounded-full border border-olive/25 bg-olive/[0.08] text-gold shadow-gold">
        <UserRoundCheck size={22} />
      </div>

      <div className="mx-auto max-w-xl text-center">
        <p className="gold-kicker mb-4 justify-center">Convite reservado</p>
        <h3 className="font-display text-4xl leading-tight text-balance sm:text-5xl">
          Digite seu nome como está no convite
        </h3>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground text-pretty sm:text-base">
          Vamos liberar os detalhes do endereço e a confirmação assim que encontrarmos seu convite.
        </p>
      </div>

      <form onSubmit={onSubmit} className="mx-auto mt-8 max-w-xl">
        <label className="block">
          <span className="mb-3 block text-[10px] uppercase tracking-[0.28em] text-muted-foreground/80">
            Nome ou apelido
          </span>
          <div className="relative">
            <Search
              size={18}
              className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground/55"
            />
            <input
              value={nameInput}
              onChange={(event) => setNameInput(event.target.value)}
              autoComplete="name"
              maxLength={120}
              placeholder="Ex: Maria, Tio João, Duda..."
              className="w-full rounded-none border-0 border-b border-border bg-transparent py-4 pl-8 pr-2 font-light text-foreground outline-none transition-all duration-300 placeholder:text-muted-foreground/45 focus:border-olive focus:bg-olive/[0.04]"
            />
          </div>
        </label>

        <button
          type="submit"
          disabled={searching}
          className="shine-line mt-6 flex min-h-[56px] w-full items-center justify-center gap-3 rounded-md bg-gold px-6 py-4 text-[10px] uppercase tracking-[0.3em] text-background shadow-gold transition-all duration-500 hover:bg-olive-deep disabled:cursor-wait disabled:opacity-70 sm:text-xs"
        >
          {searching ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
          {searching ? "Verificando..." : "Verificar convite"}
        </button>
      </form>

      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            key="guest-error"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="mx-auto mt-5 max-w-xl rounded-md border border-destructive/20 bg-destructive/5 px-4 py-3 text-center text-xs uppercase tracking-widest text-destructive"
          >
            {error}
          </motion.p>
        )}

        {searched && !error && matches.length === 0 && (
          <motion.p
            key="guest-empty"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="mx-auto mt-6 max-w-xl rounded-md border border-olive/15 bg-olive/[0.05] px-5 py-4 text-center text-sm leading-relaxed text-muted-foreground"
          >
            Não encontramos seu nome na lista. Fale com Lucas ou Vanessa para confirmar seu convite.
          </motion.p>
        )}

        {matches.length > 1 && (
          <motion.div
            key="guest-matches"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="mx-auto mt-7 max-w-xl space-y-3"
          >
            <p className="text-center text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
              Encontramos mais de um convite
            </p>
            {matches.map((guest) => (
              <button
                key={guest.id}
                type="button"
                onClick={() => validateGuest(guest)}
                className="group flex w-full items-center justify-between gap-4 rounded-md border border-border bg-background/50 px-5 py-4 text-left transition-all duration-300 hover:border-olive hover:bg-olive/[0.06]"
              >
                <span>
                  <span className="block font-display text-2xl leading-tight text-foreground">
                    {guest.display_name}
                  </span>
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {guest.group_name || "Convite sem grupo informado"}
                  </span>
                </span>
                <span className="text-[10px] uppercase tracking-[0.26em] text-gold transition-colors group-hover:text-olive-deep">
                  Escolher
                </span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
