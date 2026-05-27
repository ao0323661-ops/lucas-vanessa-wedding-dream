import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
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
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [messages, setMessages] = useState<GuestMessage[]>([]);
  const [tab, setTab] = useState<"overview" | "rsvps" | "gifts" | "messages">("overview");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "confirmed" | "declined">("all");

  useEffect(() => {
    void loadAdminData();
  }, []);

  async function loadAdminData() {
    const [rsvpsResult, giftsResult, messagesResult] = await Promise.all([
      supabase.from("rsvps").select("*").order("created_at", { ascending: false }),
      supabase.from("gift_contributions").select("*").order("created_at", { ascending: false }),
      supabase.from("messages").select("*").order("created_at", { ascending: false }),
    ]);

    if (rsvpsResult.data) setRsvps(rsvpsResult.data);
    if (giftsResult.data) setGifts(giftsResult.data);
    if (messagesResult.data) setMessages(messagesResult.data);
  }

  async function setMessageApproval(id: string, approved: boolean) {
    const { error } = await supabase.from("messages").update({ approved }).eq("id", id);
    if (error) return;
    setMessages((current) =>
      current.map((message) => (message.id === id ? { ...message, approved } : message)),
    );
  }

  const confirmed = rsvps.filter((r) => r.attending);
  const declined = rsvps.filter((r) => !r.attending);
  const companionsTotal = confirmed.reduce((s, r) => s + (r.companions || 0), 0);
  const totalPeople = confirmed.length + companionsTotal;
  const giftTotal = gifts.reduce((s, g) => s + Number(g.amount), 0);
  const pendingMessages = messages.filter((message) => !message.approved);

  const filteredRsvps = rsvps
    .filter((r) => {
      if (filter === "confirmed") return r.attending;
      if (filter === "declined") return !r.attending;
      return true;
    })
    .filter((r) => r.full_name.toLowerCase().includes(search.toLowerCase()));

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
          {(["overview", "rsvps", "gifts", "messages"] as const).map((k) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`px-5 py-3 text-[10px] sm:text-xs uppercase tracking-[0.3em] border-b-2 transition-all ${tab === k ? "border-olive text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              {k === "overview"
                ? "RSVP"
                : k === "rsvps"
                  ? `Convidados (${rsvps.length})`
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
