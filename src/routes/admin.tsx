import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { clampAllowedCompanions, normalizeGuestName } from "@/lib/invited-guests";
import { notifyMessageWallChanged } from "@/lib/message-wall";
import { WEDDING } from "@/lib/wedding";

type Rsvp = {
  id: string;
  full_name: string;
  attending: boolean;
  companions: number;
  phone: string | null;
  dietary_restrictions: string | null;
  message: string | null;
  created_at: string;
  invited_guest_id: string | null;
};
type InvitedGuest = {
  id: string;
  display_name: string;
  normalized_name: string;
  group_name: string | null;
  allowed_companions: number;
  is_active: boolean;
  created_at: string;
};
type Gift = {
  id: string;
  guest_name: string;
  gift_name: string;
  amount: number;
  created_at: string;
};
type GuestMessage = {
  id: string;
  name: string;
  message: string;
  approved: boolean;
  created_at: string;
};
type GuestFormState = {
  id: string | null;
  display_name: string;
  group_name: string;
  allowed_companions: number;
  is_active: boolean;
};

const emptyGuestForm: GuestFormState = {
  id: null,
  display_name: "",
  group_name: "",
  allowed_companions: 0,
  is_active: true,
};

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: `Painel — ${WEDDING.names.full}` }, { name: "robots", content: "noindex" }],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [session, setSession] = useState<unknown>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      void checkRole(s?.user?.id);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      void checkRole(data.session?.user?.id);
    });
    return () => sub.subscription.unsubscribe();

    async function checkRole(uid?: string) {
      if (!uid) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", uid)
        .eq("role", "admin")
        .maybeSingle();
      setIsAdmin(!!data);
      setLoading(false);
    }
  }, []);

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6 text-muted-foreground">
        <div className="paper-luxe rounded-md px-8 py-7 text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-pulse rounded-full border border-olive/25 bg-olive/[0.08]" />
          <p className="text-xs uppercase tracking-[0.28em]">Carregando...</p>
        </div>
      </div>
    );
  if (!session) return <AuthCard />;
  if (!isAdmin) return <NotAdmin />;
  return <Dashboard />;
}

function AuthCard() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const fn =
      mode === "login"
        ? supabase.auth.signInWithPassword({ email, password })
        : supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: window.location.origin + "/admin" },
          });
    const { error } = await fn;
    setLoading(false);
    if (error) setError(error.message);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="paper-luxe w-full max-w-md rounded-md p-8 sm:p-10">
        <Link
          to="/"
          className="text-xs uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:text-gold"
        >
          ← Voltar ao site
        </Link>
        <h1 className="mt-6 font-display text-4xl">Painel dos noivos</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Acesso restrito a {WEDDING.names.full}.
        </p>

        <form onSubmit={submit} className="mt-8 space-y-5">
          <input
            type="email"
            required
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border-0 border-b border-border bg-transparent py-3 outline-none transition-colors focus:border-olive"
          />
          <input
            type="password"
            required
            minLength={6}
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-0 border-b border-border bg-transparent py-3 outline-none transition-colors focus:border-olive"
          />
          {error && <p className="text-destructive text-sm">{error}</p>}
          <button
            disabled={loading}
            className="w-full rounded-md bg-gold py-3 text-xs uppercase tracking-[0.3em] text-background shadow-gold transition hover:bg-olive-deep disabled:cursor-wait disabled:opacity-70"
          >
            {loading ? "..." : mode === "login" ? "Entrar" : "Criar conta"}
          </button>
        </form>
        <button
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
          className="mt-4 text-xs uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:text-gold"
        >
          {mode === "login" ? "Primeiro acesso? Criar conta" : "Já tenho conta"}
        </button>
      </div>
    </div>
  );
}

function NotAdmin() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 py-12 text-center">
      <div className="paper-luxe relative w-full max-w-xl overflow-hidden rounded-md p-8 sm:p-10">
        <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-olive/45 to-transparent" />
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-olive/25 bg-olive/[0.08] font-display text-2xl text-gold">
          LV
        </div>
        <p className="gold-kicker mb-4">Área reservada</p>
        <h1 className="font-display text-4xl leading-tight text-balance">Sem permissão</h1>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground text-pretty">
          Sua conta está autenticada, mas ainda não foi liberada para acessar o painel dos noivos.
          Peça a Lucas & Vanessa para ativarem seu acesso de administrador.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            onClick={() => supabase.auth.signOut()}
            className="rounded-md bg-gold px-6 py-3 text-xs uppercase tracking-[0.3em] text-background shadow-gold transition hover:bg-olive-deep"
          >
            Sair
          </button>
          <Link
            to="/"
            className="rounded-md border border-border px-6 py-3 text-xs uppercase tracking-[0.3em] text-muted-foreground transition hover:border-olive hover:text-gold"
          >
            ← Voltar ao site
          </Link>
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [invitedGuests, setInvitedGuests] = useState<InvitedGuest[]>([]);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [messages, setMessages] = useState<GuestMessage[]>([]);
  const [tab, setTab] = useState<"overview" | "rsvps" | "invited" | "gifts" | "messages">(
    "overview",
  );
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "confirmed" | "declined">("all");
  const [guestSearch, setGuestSearch] = useState("");
  const [guestForm, setGuestForm] = useState<GuestFormState>(emptyGuestForm);
  const [guestSaving, setGuestSaving] = useState(false);
  const [guestError, setGuestError] = useState<string | null>(null);

  useEffect(() => {
    void loadAdminData();
  }, []);

  async function loadAdminData() {
    const [rsvpsResult, invitedGuestsResult, giftsResult, messagesResult] = await Promise.all([
      supabase.from("rsvps").select("*").order("created_at", { ascending: false }),
      supabase.from("invited_guests").select("*").order("display_name", { ascending: true }),
      supabase.from("gift_contributions").select("*").order("created_at", { ascending: false }),
      supabase.from("messages").select("*").order("created_at", { ascending: false }),
    ]);

    if (rsvpsResult.data) setRsvps(rsvpsResult.data);
    if (invitedGuestsResult.data) setInvitedGuests(invitedGuestsResult.data);
    if (giftsResult.data) setGifts(giftsResult.data);
    if (messagesResult.data) setMessages(messagesResult.data);
  }

  async function loadMessages() {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setMessages(data);
  }

  async function setMessageApproval(id: string, approved: boolean) {
    const { data, error } = await supabase
      .from("messages")
      .update({ approved })
      .eq("id", id)
      .select("id, approved")
      .maybeSingle();

    if (error || !data) return;

    setMessages((current) =>
      current.map((message) => (message.id === id ? { ...message, approved } : message)),
    );
    notifyMessageWallChanged();
    void loadMessages();
  }

  function sortGuests(guests: InvitedGuest[]) {
    return [...guests].sort((a, b) => a.display_name.localeCompare(b.display_name, "pt-BR"));
  }

  function resetGuestForm() {
    setGuestForm(emptyGuestForm);
    setGuestError(null);
  }

  function editGuest(guest: InvitedGuest) {
    setGuestForm({
      id: guest.id,
      display_name: guest.display_name,
      group_name: guest.group_name || "",
      allowed_companions: guest.allowed_companions,
      is_active: guest.is_active,
    });
    setGuestError(null);
    setTab("invited");
  }

  async function saveGuest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setGuestError(null);

    const displayName = guestForm.display_name.trim().replace(/\s+/g, " ");
    const normalizedName = normalizeGuestName(displayName);

    if (normalizedName.length < 1) {
      setGuestError("Informe o nome ou apelido do convidado.");
      return;
    }

    const payload = {
      display_name: displayName,
      normalized_name: normalizedName,
      group_name: guestForm.group_name.trim().replace(/\s+/g, " ") || null,
      allowed_companions: clampAllowedCompanions(guestForm.allowed_companions),
      is_active: guestForm.is_active,
    };

    setGuestSaving(true);

    const result = guestForm.id
      ? await supabase
          .from("invited_guests")
          .update(payload)
          .eq("id", guestForm.id)
          .select("*")
          .single()
      : await supabase.from("invited_guests").insert(payload).select("*").single();

    setGuestSaving(false);

    if (result.error) {
      setGuestError("Não conseguimos salvar este convidado agora.");
      return;
    }

    const savedGuest = result.data;
    if (savedGuest) {
      setInvitedGuests((current) =>
        sortGuests(
          guestForm.id
            ? current.map((guest) => (guest.id === savedGuest.id ? savedGuest : guest))
            : [...current, savedGuest],
        ),
      );
      resetGuestForm();
    }
  }

  async function toggleGuestActive(guest: InvitedGuest) {
    const { data, error } = await supabase
      .from("invited_guests")
      .update({ is_active: !guest.is_active })
      .eq("id", guest.id)
      .select("*")
      .single();

    if (error || !data) return;

    setInvitedGuests((current) =>
      sortGuests(current.map((item) => (item.id === guest.id ? data : item))),
    );
  }

  const confirmed = rsvps.filter((r) => r.attending);
  const declined = rsvps.filter((r) => !r.attending);
  const companionsTotal = confirmed.reduce((s, r) => s + (r.companions || 0), 0);
  const totalPeople = confirmed.length + companionsTotal;
  const giftTotal = gifts.reduce((s, g) => s + Number(g.amount), 0);
  const pendingMessages = messages.filter((message) => !message.approved);
  const rsvpByGuestId = useMemo(
    () =>
      new Map(
        rsvps
          .filter((rsvp) => rsvp.invited_guest_id)
          .map((rsvp) => [rsvp.invited_guest_id as string, rsvp]),
      ),
    [rsvps],
  );
  const rsvpByNormalizedName = useMemo(
    () => new Map(rsvps.map((rsvp) => [normalizeGuestName(rsvp.full_name), rsvp])),
    [rsvps],
  );

  const filteredRsvps = rsvps
    .filter((r) => {
      if (filter === "confirmed") return r.attending;
      if (filter === "declined") return !r.attending;
      return true;
    })
    .filter((r) => r.full_name.toLowerCase().includes(search.toLowerCase()));

  const filteredInvitedGuests = invitedGuests.filter((guest) => {
    const query = normalizeGuestName(guestSearch);
    if (!query) return true;

    return (
      guest.normalized_name.includes(query) ||
      normalizeGuestName(guest.group_name || "").includes(query)
    );
  });

  function getGuestRsvp(guest: InvitedGuest) {
    return rsvpByGuestId.get(guest.id) || rsvpByNormalizedName.get(guest.normalized_name) || null;
  }

  function exportCsv(rows: Rsvp[]) {
    const headers = [
      "Nome",
      "Confirmou",
      "Acompanhantes",
      "Telefone",
      "Restricao",
      "Mensagem",
      "Data",
    ];
    const csv = [
      headers.join(","),
      ...rows.map((r) =>
        [
          r.full_name,
          r.attending ? "Sim" : "Nao",
          r.companions,
          r.phone || "",
          r.dietary_restrictions || "",
          (r.message || "").replace(/\n/g, " "),
          new Date(r.created_at).toLocaleString("pt-BR"),
        ]
          .map((c) => `"${String(c).replace(/"/g, '""')}"`)
          .join(","),
      ),
    ].join("\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rsvps-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-olive/20 bg-olive-deep text-background">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <p className="font-script text-gold text-2xl leading-none">{WEDDING.names.full}</p>
            <p className="text-xs uppercase tracking-[0.3em] text-background/70">
              Painel administrativo
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              to="/"
              className="rounded-md border border-background/30 px-4 py-2 text-xs uppercase tracking-[0.25em] transition-colors hover:border-gold hover:text-gold"
            >
              Site
            </Link>
            <button
              onClick={() => supabase.auth.signOut()}
              className="rounded-md bg-background px-4 py-2 text-xs uppercase tracking-[0.25em] text-olive-deep transition-colors hover:bg-gold hover:text-background"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <Stat label="Confirmados" value={confirmed.length} />
          <Stat label="Não vão" value={declined.length} />
          <Stat label="Acompanhantes" value={companionsTotal} />
          <Stat label="Total de pessoas" value={totalPeople} accent />
        </div>

        <div className="flex flex-wrap gap-1 border-b border-border mb-6">
          {(["overview", "rsvps", "invited", "gifts", "messages"] as const).map((k) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`px-5 py-3 text-[10px] sm:text-xs uppercase tracking-[0.3em] border-b-2 transition-all ${tab === k ? "border-olive text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              {k === "overview"
                ? "RSVP"
                : k === "rsvps"
                  ? `Respostas (${rsvps.length})`
                  : k === "invited"
                    ? `Convidados (${invitedGuests.length})`
                    : k === "gifts"
                      ? `Presentes (${gifts.length})`
                      : `Mural (${pendingMessages.length})`}
            </button>
          ))}
        </div>

        {tab === "overview" && (
          <div className="grid gap-4 md:grid-cols-2">
            {rsvps
              .filter((r) => r.message)
              .map((r) => (
                <div
                  key={r.id}
                  className="paper-luxe group relative overflow-hidden rounded-md p-6"
                >
                  <div className="absolute top-0 left-0 h-full w-1 bg-olive opacity-45 transition-opacity group-hover:opacity-100" />
                  <p className="text-foreground/90 italic font-light leading-relaxed">
                    "{r.message}"
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-gold">
                      — {r.full_name}
                    </p>
                    <span className="text-[9px] text-muted-foreground">
                      {new Date(r.created_at).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                </div>
              ))}
            {rsvps.filter((r) => r.message).length === 0 && (
              <p className="text-muted-foreground py-10 text-center col-span-2">
                Nenhuma mensagem ainda.
              </p>
            )}
          </div>
        )}

        {tab === "rsvps" && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-1 max-w-md gap-2">
                <input
                  type="text"
                  placeholder="Buscar por nome..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 border-0 border-b border-border bg-transparent py-2 text-sm outline-none transition-colors focus:border-olive"
                />
                <select
                  value={filter}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "all" || value === "confirmed" || value === "declined") {
                      setFilter(value);
                    }
                  }}
                  className="border-0 border-b border-border bg-transparent py-2 text-xs uppercase tracking-widest outline-none transition-colors focus:border-olive"
                >
                  <option value="all">Todos</option>
                  <option value="confirmed">Confirmados</option>
                  <option value="declined">Não vão</option>
                </select>
              </div>
              <button
                onClick={() => exportCsv(filteredRsvps)}
                className="rounded-md bg-gold px-6 py-3 text-[10px] uppercase tracking-[0.3em] text-background shadow-gold transition-all hover:bg-olive-deep"
              >
                Exportar CSV
              </button>
            </div>

            <div className="overflow-x-auto rounded-md border border-border bg-card shadow-luxe">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-secondary/55 text-[10px] uppercase tracking-[0.2em]">
                  <tr>
                    <Th>Nome</Th>
                    <Th>Status</Th>
                    <Th>Acomp.</Th>
                    <Th>Telefone</Th>
                    <Th>Restrição</Th>
                    <Th className="hidden sm:table-cell">Data</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {filteredRsvps.map((r) => (
                    <tr key={r.id} className="transition-colors hover:bg-secondary/25">
                      <Td className="font-medium">{r.full_name}</Td>
                      <Td>
                        <span
                          className={`rounded-full px-2 py-1 text-[10px] uppercase tracking-widest ${r.attending ? "bg-olive/[0.08] text-gold" : "bg-muted/60 text-muted-foreground"}`}
                        >
                          {r.attending ? "Sim" : "Não"}
                        </span>
                      </Td>
                      <Td className="text-center">{r.companions}</Td>
                      <Td className="text-xs text-muted-foreground">{r.phone || "—"}</Td>
                      <Td
                        className="max-w-[150px] truncate text-xs"
                        title={r.dietary_restrictions || ""}
                      >
                        {r.dietary_restrictions || "—"}
                      </Td>
                      <Td className="text-xs text-muted-foreground hidden sm:table-cell">
                        {new Date(r.created_at).toLocaleDateString("pt-BR")}
                      </Td>
                    </tr>
                  ))}
                  {filteredRsvps.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-12 text-center text-muted-foreground">
                        Nenhum convidado encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "invited" && (
          <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)]">
              <form onSubmit={saveGuest} className="paper-luxe rounded-md p-6">
                <p className="text-[10px] uppercase tracking-[0.32em] text-gold">
                  {guestForm.id ? "Editar convidado" : "Novo convidado"}
                </p>
                <h2 className="mt-2 font-display text-3xl leading-tight">
                  Lista restrita de convites
                </h2>
                <div className="mt-6 space-y-5">
                  <label className="block">
                    <span className="mb-2 block text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                      Nome ou apelido
                    </span>
                    <input
                      value={guestForm.display_name}
                      onChange={(event) =>
                        setGuestForm((current) => ({
                          ...current,
                          display_name: event.target.value,
                        }))
                      }
                      maxLength={120}
                      required
                      placeholder="Como está no convite"
                      className="w-full border-0 border-b border-border bg-transparent py-3 outline-none transition-colors focus:border-olive"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                      Grupo
                    </span>
                    <input
                      value={guestForm.group_name}
                      onChange={(event) =>
                        setGuestForm((current) => ({ ...current, group_name: event.target.value }))
                      }
                      maxLength={120}
                      placeholder="Família, amigos, trabalho..."
                      className="w-full border-0 border-b border-border bg-transparent py-3 outline-none transition-colors focus:border-olive"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                      Acompanhantes permitidos
                    </span>
                    <input
                      type="number"
                      min={0}
                      max={10}
                      value={guestForm.allowed_companions}
                      onChange={(event) =>
                        setGuestForm((current) => ({
                          ...current,
                          allowed_companions: Number(event.target.value),
                        }))
                      }
                      className="w-full border-0 border-b border-border bg-transparent py-3 outline-none transition-colors focus:border-olive"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setGuestForm((current) => ({ ...current, is_active: !current.is_active }))
                    }
                    className={`w-full rounded-md border px-4 py-3 text-xs uppercase tracking-[0.24em] transition-all ${
                      guestForm.is_active
                        ? "border-olive bg-olive/[0.08] text-gold"
                        : "border-border bg-background/50 text-muted-foreground"
                    }`}
                  >
                    {guestForm.is_active ? "Convite ativo" : "Convite inativo"}
                  </button>
                </div>

                {guestError && (
                  <p className="mt-5 rounded-md border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                    {guestError}
                  </p>
                )}

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <button
                    disabled={guestSaving}
                    className="rounded-md bg-gold px-6 py-3 text-[10px] uppercase tracking-[0.3em] text-background shadow-gold transition-all hover:bg-olive-deep disabled:cursor-wait disabled:opacity-70"
                  >
                    {guestSaving ? "Salvando..." : guestForm.id ? "Salvar alterações" : "Cadastrar"}
                  </button>
                  {guestForm.id && (
                    <button
                      type="button"
                      onClick={resetGuestForm}
                      className="rounded-md border border-border px-6 py-3 text-[10px] uppercase tracking-[0.3em] text-muted-foreground transition hover:border-olive hover:text-gold"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>

              <div className="paper-luxe rounded-md p-6">
                <p className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
                  Resumo
                </p>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <MiniStat
                    label="Ativos"
                    value={invitedGuests.filter((g) => g.is_active).length}
                  />
                  <MiniStat
                    label="Inativos"
                    value={invitedGuests.filter((g) => !g.is_active).length}
                  />
                  <MiniStat label="Com RSVP" value={invitedGuests.filter(getGuestRsvp).length} />
                  <MiniStat
                    label="Sem RSVP"
                    value={invitedGuests.filter((guest) => !getGuestRsvp(guest)).length}
                  />
                </div>
                <div className="mt-7">
                  <label className="block">
                    <span className="mb-2 block text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                      Buscar convidado
                    </span>
                    <input
                      value={guestSearch}
                      onChange={(event) => setGuestSearch(event.target.value)}
                      placeholder="Nome, apelido ou grupo"
                      className="w-full border-0 border-b border-border bg-transparent py-3 outline-none transition-colors focus:border-olive"
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto rounded-md border border-border bg-card shadow-luxe">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-secondary/55 text-[10px] uppercase tracking-[0.2em]">
                  <tr>
                    <Th>Nome</Th>
                    <Th>Grupo</Th>
                    <Th>Acomp.</Th>
                    <Th>Status</Th>
                    <Th>RSVP</Th>
                    <Th className="hidden sm:table-cell">Criado em</Th>
                    <Th>Ações</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {filteredInvitedGuests.map((guest) => {
                    const guestRsvp = getGuestRsvp(guest);

                    return (
                      <tr key={guest.id} className="transition-colors hover:bg-secondary/25">
                        <Td className="font-medium">{guest.display_name}</Td>
                        <Td className="text-xs text-muted-foreground">{guest.group_name || "—"}</Td>
                        <Td className="text-center">{guest.allowed_companions}</Td>
                        <Td>
                          <span
                            className={`rounded-full px-2 py-1 text-[10px] uppercase tracking-widest ${
                              guest.is_active
                                ? "bg-olive/[0.08] text-gold"
                                : "bg-muted/60 text-muted-foreground"
                            }`}
                          >
                            {guest.is_active ? "Ativo" : "Inativo"}
                          </span>
                        </Td>
                        <Td>
                          <span
                            className={`rounded-full px-2 py-1 text-[10px] uppercase tracking-widest ${
                              guestRsvp?.attending
                                ? "bg-olive/[0.08] text-gold"
                                : guestRsvp
                                  ? "bg-muted/60 text-muted-foreground"
                                  : "bg-background text-muted-foreground"
                            }`}
                          >
                            {guestRsvp
                              ? guestRsvp.attending
                                ? "Confirmou"
                                : "Não vai"
                              : "Sem resposta"}
                          </span>
                        </Td>
                        <Td className="hidden text-xs text-muted-foreground sm:table-cell">
                          {new Date(guest.created_at).toLocaleDateString("pt-BR")}
                        </Td>
                        <Td>
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => editGuest(guest)}
                              className="rounded-md border border-border px-3 py-2 text-[10px] uppercase tracking-[0.22em] transition hover:border-olive hover:text-gold"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => void toggleGuestActive(guest)}
                              className="rounded-md bg-gold px-3 py-2 text-[10px] uppercase tracking-[0.22em] text-background transition hover:bg-olive-deep"
                            >
                              {guest.is_active ? "Desativar" : "Ativar"}
                            </button>
                          </div>
                        </Td>
                      </tr>
                    );
                  })}
                  {filteredInvitedGuests.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-12 text-center text-muted-foreground">
                        Nenhum convidado encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "gifts" && (
          <div className="space-y-6">
            <div className="paper-luxe flex items-end justify-between rounded-md p-6">
              <div>
                <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
                  Total informado
                </p>
                <p className="font-display text-5xl text-gold mt-1">
                  R$ {giftTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
                  Informações
                </p>
                <p className="font-display text-3xl mt-1">{gifts.length}</p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-md border border-border bg-card shadow-luxe">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-secondary/55 text-[10px] uppercase tracking-[0.2em]">
                  <tr>
                    <Th>Convidado</Th>
                    <Th>Cota</Th>
                    <Th>Valor</Th>
                    <Th className="hidden sm:table-cell">Data</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {gifts.map((g) => (
                    <tr key={g.id} className="transition-colors hover:bg-secondary/25">
                      <Td className="font-medium">{g.guest_name}</Td>
                      <Td className="text-xs">{g.gift_name}</Td>
                      <Td className="text-gold font-medium">
                        R$ {Number(g.amount).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </Td>
                      <Td className="text-xs text-muted-foreground hidden sm:table-cell">
                        {new Date(g.created_at).toLocaleDateString("pt-BR")}
                      </Td>
                    </tr>
                  ))}
                  {gifts.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-12 text-center text-muted-foreground">
                        Nenhuma contribuição ainda.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "messages" && (
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="paper-luxe rounded-md p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-[10px] uppercase tracking-[0.3em] text-gold">
                        {message.name}
                      </p>
                      <span
                        className={`text-[9px] uppercase tracking-[0.2em] px-2 py-1 rounded-full ${
                          message.approved
                            ? "bg-olive/[0.08] text-gold"
                            : "bg-muted/60 text-muted-foreground"
                        }`}
                      >
                        {message.approved ? "Aprovada" : "Pendente"}
                      </span>
                    </div>
                    <p className="mt-3 text-foreground/90 leading-relaxed">"{message.message}"</p>
                    <p className="mt-3 text-[9px] text-muted-foreground">
                      {new Date(message.created_at).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => void setMessageApproval(message.id, true)}
                      disabled={message.approved}
                      className="rounded-md bg-gold px-4 py-2 text-[10px] uppercase tracking-[0.25em] text-background transition hover:bg-olive-deep disabled:opacity-40"
                    >
                      Aprovar
                    </button>
                    <button
                      onClick={() => void setMessageApproval(message.id, false)}
                      disabled={!message.approved}
                      className="rounded-md border border-border px-4 py-2 text-[10px] uppercase tracking-[0.25em] transition hover:border-olive hover:text-gold disabled:opacity-40"
                    >
                      Reprovar
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {messages.length === 0 && (
              <p className="text-muted-foreground py-10 text-center">
                Nenhuma mensagem no mural ainda.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div
      className={`rounded-md border p-6 transition-all hover:shadow-md ${
        accent ? "border-olive bg-gold text-background shadow-gold" : "paper-luxe text-foreground"
      }`}
    >
      <p
        className={`text-[10px] uppercase tracking-[0.3em] ${
          accent ? "text-background/75" : "text-muted-foreground"
        }`}
      >
        {label}
      </p>
      <p className="font-display text-4xl mt-2">{value}</p>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-olive/15 bg-background/45 px-4 py-3">
      <p className="text-[9px] uppercase tracking-[0.24em] text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-3xl leading-none text-gold">{value}</p>
    </div>
  );
}

const Th = ({
  children,
  className = "",
  title,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
}) => (
  <th className={`text-left px-6 py-4 font-medium whitespace-nowrap ${className}`} title={title}>
    {children}
  </th>
);
const Td = ({
  children,
  className = "",
  title,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
}) => (
  <td className={`px-6 py-4 whitespace-nowrap ${className}`} title={title}>
    {children}
  </td>
);
