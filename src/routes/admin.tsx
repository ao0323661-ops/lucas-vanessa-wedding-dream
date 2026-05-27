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
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Carregando…
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
    <div className="min-h-screen bg-foreground text-background flex items-center justify-center px-6">
      <div className="w-full max-w-md p-10 bg-background text-foreground rounded-md shadow-luxe">
        <Link
          to="/"
          className="text-xs uppercase tracking-[0.3em] text-muted-foreground hover:text-gold"
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
            className="w-full bg-transparent border-b border-border focus:border-gold outline-none py-3"
          />
          <input
            type="password"
            required
            minLength={6}
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent border-b border-border focus:border-gold outline-none py-3"
          />
          {error && <p className="text-destructive text-sm">{error}</p>}
          <button
            disabled={loading}
            className="w-full py-3 bg-foreground text-background uppercase tracking-[0.3em] text-xs hover:bg-gold hover:text-foreground transition"
          >
            {loading ? "…" : mode === "login" ? "Entrar" : "Criar conta"}
          </button>
        </form>
        <button
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
          className="mt-4 text-xs text-muted-foreground hover:text-gold uppercase tracking-[0.3em]"
        >
          {mode === "login" ? "Primeiro acesso? Criar conta" : "Já tenho conta"}
        </button>
      </div>
    </div>
  );
}

function NotAdmin() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 gap-4">
      <h1 className="font-display text-3xl">Sem permissão</h1>
      <p className="text-muted-foreground max-w-md">
        Sua conta foi criada mas ainda não tem acesso de administrador. Para liberar, abra o painel
        da Lovable Cloud e adicione uma linha na tabela <code>user_roles</code> com seu{" "}
        <code>user_id</code> e role <code>admin</code>.
      </p>
      <button
        onClick={() => supabase.auth.signOut()}
        className="mt-4 px-6 py-2 border border-border text-xs uppercase tracking-[0.3em] hover:border-gold"
      >
        Sair
      </button>
      <Link
        to="/"
        className="text-xs uppercase tracking-[0.3em] text-muted-foreground hover:text-gold"
      >
        ← Voltar ao site
      </Link>
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
      <header className="border-b border-border bg-foreground text-background">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <p className="font-script text-gold text-2xl leading-none">{WEDDING.names.full}</p>
            <p className="text-xs uppercase tracking-[0.3em] text-background/60">
              Painel administrativo
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              to="/"
              className="px-4 py-2 text-xs uppercase tracking-[0.25em] border border-background/30 hover:border-gold transition-colors"
            >
              Site
            </Link>
            <button
              onClick={() => supabase.auth.signOut()}
              className="px-4 py-2 text-xs uppercase tracking-[0.25em] bg-gold text-foreground hover:bg-white transition-colors"
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
              className={`px-5 py-3 text-[10px] sm:text-xs uppercase tracking-[0.3em] border-b-2 transition-all ${tab === k ? "border-gold text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
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
                  className="p-6 border border-border bg-card rounded-md shadow-sm relative overflow-hidden group"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-gold opacity-50 group-hover:opacity-100 transition-opacity" />
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
                  className="flex-1 bg-transparent border-b border-border focus:border-gold outline-none py-2 text-sm"
                />
                <select
                  value={filter}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "all" || value === "confirmed" || value === "declined") {
                      setFilter(value);
                    }
                  }}
                  className="bg-transparent border-b border-border focus:border-gold outline-none py-2 text-xs uppercase tracking-widest"
                >
                  <option value="all">Todos</option>
                  <option value="confirmed">Confirmados</option>
                  <option value="declined">Não vão</option>
                </select>
              </div>
              <button
                onClick={() => exportCsv(filteredRsvps)}
                className="px-6 py-3 bg-foreground text-background text-[10px] uppercase tracking-[0.3em] hover:bg-gold hover:text-foreground transition-all shadow-md"
              >
                Exportar CSV
              </button>
            </div>

            <div className="overflow-x-auto border border-border rounded-md bg-card">
              <table className="w-full text-sm">
                <thead className="bg-secondary/50 text-[10px] uppercase tracking-[0.2em] border-b border-border">
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
                    <tr key={r.id} className="hover:bg-secondary/20 transition-colors">
                      <Td className="font-medium">{r.full_name}</Td>
                      <Td>
                        <span
                          className={`text-[10px] uppercase tracking-widest px-2 py-1 rounded-full ${r.attending ? "bg-gold/10 text-gold" : "bg-muted/10 text-muted-foreground"}`}
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
            <div className="flex justify-between items-end p-6 bg-card border border-border rounded-md shadow-sm">
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

            <div className="overflow-x-auto border border-border rounded-md bg-card">
              <table className="w-full text-sm">
                <thead className="bg-secondary/50 text-[10px] uppercase tracking-[0.2em] border-b border-border">
                  <tr>
                    <Th>Convidado</Th>
                    <Th>Cota</Th>
                    <Th>Valor</Th>
                    <Th className="hidden sm:table-cell">Data</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {gifts.map((g) => (
                    <tr key={g.id} className="hover:bg-secondary/20 transition-colors">
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
              <div
                key={message.id}
                className="p-6 border border-border bg-card rounded-md shadow-sm"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-[10px] uppercase tracking-[0.3em] text-gold">
                        {message.name}
                      </p>
                      <span
                        className={`text-[9px] uppercase tracking-[0.2em] px-2 py-1 rounded-full ${
                          message.approved
                            ? "bg-gold/10 text-gold"
                            : "bg-muted/20 text-muted-foreground"
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
                      className="px-4 py-2 text-[10px] uppercase tracking-[0.25em] bg-foreground text-background hover:bg-gold hover:text-foreground transition disabled:opacity-40"
                    >
                      Aprovar
                    </button>
                    <button
                      onClick={() => void setMessageApproval(message.id, false)}
                      disabled={!message.approved}
                      className="px-4 py-2 text-[10px] uppercase tracking-[0.25em] border border-border hover:border-gold transition disabled:opacity-40"
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
      className={`p-6 rounded-md border transition-all hover:shadow-md ${accent ? "bg-foreground text-background border-foreground" : "bg-card border-border"}`}
    >
      <p
        className={`text-[10px] uppercase tracking-[0.3em] ${accent ? "text-gold" : "text-muted-foreground"}`}
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
