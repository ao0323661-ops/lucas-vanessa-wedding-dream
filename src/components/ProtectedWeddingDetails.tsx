import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, Clock, Loader2, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { InvitedGuestMatch } from "@/lib/invited-guests";

type WeddingLocation = {
  id: string;
  label: string;
  name: string;
  address: string;
  time_label: string;
  maps_url: string;
};

type ProtectedWeddingDetailsProps = {
  guest: InvitedGuestMatch;
};

export default function ProtectedWeddingDetails({ guest }: ProtectedWeddingDetailsProps) {
  const [locations, setLocations] = useState<WeddingLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadDetails() {
      setLoading(true);
      setError(null);

      const { data, error: detailsError } = await supabase.rpc("get_wedding_private_details", {
        guest_id: guest.id,
        guest_name: guest.display_name,
      });

      if (!active) return;

      if (detailsError) {
        setError("Não conseguimos carregar os detalhes do local agora.");
        setLocations([]);
      } else {
        setLocations(data ?? []);
      }

      setLoading(false);
    }

    void loadDetails();

    return () => {
      active = false;
    };
  }, [guest.display_name, guest.id]);

  if (loading) {
    return (
      <div className="editorial-panel mx-auto flex max-w-3xl items-center justify-center gap-3 rounded-md px-6 py-12 text-muted-foreground">
        <Loader2 size={18} className="animate-spin text-olive" />
        <span className="text-xs uppercase tracking-[0.28em]">Carregando detalhes...</span>
      </div>
    );
  }

  if (error || locations.length === 0) {
    return (
      <div className="editorial-panel mx-auto max-w-3xl rounded-md px-6 py-10 text-center">
        <p className="editorial-kicker mb-4 justify-center">Convite confirmado</p>
        <p className="text-muted-foreground">
          {error || "Os detalhes do local ainda não estão disponíveis para este convite."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="editorial-panel mx-auto max-w-3xl rounded-md px-6 py-5 text-center sm:px-8"
      >
        <p className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
          Convite liberado para
        </p>
        <p className="mt-2 font-display text-3xl leading-tight text-foreground">
          {guest.display_name}
        </p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        {locations.map((place, index) => (
          <motion.article
            key={place.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.76, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="editorial-panel group relative overflow-hidden rounded-md p-7 transition-transform duration-500 hover:-translate-y-1 sm:p-10"
          >
            <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-sage/65 to-transparent" />
            <div className="mb-8 flex items-center justify-between gap-4">
              <div className="editorial-kicker">{place.label}</div>
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-olive/25 bg-olive/[0.08] text-olive">
                {place.id === "ceremony" ? <CalendarDays size={18} /> : <Clock size={18} />}
              </span>
            </div>
            <h3 className="font-display text-3xl leading-tight text-balance sm:text-4xl">
              {place.name}
            </h3>
            <p className="mt-5 flex gap-3 text-muted-foreground text-pretty">
              <MapPin className="mt-1 h-4 w-4 shrink-0 text-olive" />
              <span>{place.address}</span>
            </p>
            <p className="mt-5 font-display text-3xl text-foreground">{place.time_label}</p>
            <a
              href={place.maps_url}
              target="_blank"
              rel="noreferrer"
              className="shine-line mt-8 inline-flex min-h-[48px] items-center justify-center gap-3 rounded-md bg-olive px-6 py-3 text-[10px] uppercase tracking-[0.28em] text-background transition-all duration-500 hover:bg-olive-deep"
            >
              Abrir no Google Maps
              <ArrowRight size={15} />
            </a>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
