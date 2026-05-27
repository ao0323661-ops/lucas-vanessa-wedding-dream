import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

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
type Gift = { id: string; guest_name: string; gift_name: string; amount: number; created_at: string };

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Painel — Lucas & Vanessa" }, { name: "robots", content: "noindex" }] }),
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
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", uid).eq("role", "admin").maybeSingle();
      setIsAdmin(!!data);
      setLoading(false);
    }
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Carregando…</div>;
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
    const fn = mode === "login" ? supabase.auth.signInWithPassword({ email, password }) : supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin + "/admin" } });
    const { error } = await fn;
    setLoading(false);
    if (error) setError(error.message);
  }

  return (
    <div className="min-h-screen bg-foreground text-background flex items-center justify-center px-6">
      <div className="w-full max-w-md p-10 bg-background text-foreground rounded-md shadow-luxe">
        <Link to="/" className="text-xs uppercase tracking-[0.3em] text-muted-foreground hover:text-gold">← Voltar ao site</Link>
        <h1 className="mt-6 font-display text-4xl">Painel dos noivos</h1>
        <p className="text-sm text-muted-foreground mt-2">Acesso restrito a Lucas & Vanessa.</p>

        <form onSubmit={submit} className="mt-8 space-y-5">
          <input type="email" required placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-transparent border-b border-border focus:border-gold outline-none py-3" />
          <input type="password" required minLength={6} placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-transparent border-b border-border focus:border-gold outline-none py-3" />
          {error && <p className="text-destructive text-sm">{error}</p>}
          <button disabled={loading} className="w-full py-3 bg-foreground text-background uppercase tracking-[0.3em] text-xs hover:bg-gold hover:text-foreground transition">
            {loading ? "…" : mode === "login" ? "Entrar" : "Criar conta"}
          </button>
        </form>
        <button onClick={() => setMode(mode === "login" ? "signup" : "login")} className="mt-4 text-xs text-muted-foreground hover:text-gold uppercase tracking-[0.3em]">
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
        Sua conta foi criada mas ainda não tem acesso de administrador. Para liberar, abra o painel da Lovable Cloud e adicione uma linha na tabela <code>user_roles</code> com seu <code>user_id</code> e role <code>admin</code>.
      </p>
      <button onClick={() => supabase.auth.signOut()} className="mt-4 px-6 py-2 border border-border text-xs uppercase tracking-[0.3em] hover:border-gold">
        Sair
      </button>
      <Link to="/" className="text-xs uppercase tracking-[0.3em] text-muted-foreground hover:text-gold">← Voltar ao site</Link>
    </div>
  );
}

function Dashboard() {
  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [tab, setTab] = useState<"overview" | "rsvps" | "gifts">("overview");

  useEffect(() => {
    supabase.from("rsvps").select("*").order("created_at", { ascending: false }).then(({ data }) => data && setRsvps(data));
    supabase.from("gift_contributions").select("*").order("created_at", { ascending: false }).then(({ data }) => data && setGifts(data));
  }, []);

  const confirmed = rsvps.filter((r) => r.attending);
  const declined = rsvps.filter((r) => !r.attending);
  const companionsTotal = confirmed.reduce((s, r) => s + (r.companions || 0), 0);
  const totalPeople = confirmed.length + companionsTotal;
  const giftTotal = gifts.reduce((s, g) => s + Number(g.amount), 0);

  function exportCsv(rows: Rsvp[]) {
    const headers = ["Nome", "Confirmou", "Acompanhantes", "Telefone", "Restrição", "Mensagem", "Data"];
    const csv = [
      headers.join(","),
      ...rows.map((r) =>
        [r.full_name, r.attending ? "Sim" : "Não", r.companions, r.phone || "", r.dietary_restrictions || "", (r.message || "").replace(/\n/g, " "), new Date(r.created_at).toLocaleString("pt-BR")]
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
            <p className="font-script text-gold text-2xl leading-none">Lucas & Vanessa</p>
            <p className="text-xs uppercase tracking-[0.3em] text-background/60">Painel administrativo</p>
          </div>
          <div className="flex gap-2">
            <Link to="/" className="px-4 py-2 text-xs uppercase tracking-[0.25em] border border-background/30 hover:border-gold">Site</Link>
            <button onClick={() => supabase.auth.signOut()} className="px-4 py-2 text-xs uppercase tracking-[0.25em] bg-gold text-foreground">Sair</button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <Stat label="Confirmados" value={confirmed.length} />
          <Stat label="Não vão" value={declined.length} />
          <Stat label="Acompanhantes" value={companionsTotal} />
          <Stat label="Total de pessoas" value={totalPeople} accent />
        </div>

        <div className="flex gap-1 border-b border-border mb-6">
          {(["overview", "rsvps", "gifts"] as const).map((k) => (
            <button key={k} onClick={() => setTab(k)} className={`px-5 py-3 text-xs uppercase tracking-[0.3em] border-b-2 ${tab === k ? "border-gold text-foreground" : "border-transparent text-muted-foreground"}`}>
              {k === "overview" ? "Mensagens" : k === "rsvps" ? `Confirmações (${rsvps.length})` : `Presentes (${gifts.length})`}
            </button>
          ))}
        </div>

        {tab === "overview" && (
          <div className="space-y-3">
            {rsvps.filter((r) => r.message).map((r) => (
              <div key={r.id} className="p-5 border-l-2 border-gold bg-card rounded-r-md">
                <p className="text-foreground/90">"{r.message}"</p>
                <p className="text-xs mt-2 uppercase tracking-[0.25em] text-gold">— {r.full_name}</p>
              </div>
            ))}
            {rsvps.filter((r) => r.message).length === 0 && <p className="text-muted-foreground">Nenhuma mensagem ainda.</p>}
          </div>
        )}

        {tab === "rsvps" && (
          <div>
            <div className="flex justify-end mb-4">
              <button onClick={() => exportCsv(rsvps)} className="px-5 py-2 bg-foreground text-background text-xs uppercase tracking-[0.3em] hover:bg-gold hover:text-foreground transition">
                Exportar CSV
              </button>
            </div>
            <div className="overflow-x-auto border border-border rounded-md">
              <table className="w-full text-sm">
                <thead className="bg-secondary text-xs uppercase tracking-[0.2em]">
                  <tr>
                    <Th>Nome</Th><Th>Status</Th><Th>Acomp.</Th><Th>Telefone</Th><Th>Restrição</Th><Th>Data</Th>
                  </tr>
                </thead>
                <tbody>
                  {rsvps.map((r) => (
                    <tr key={r.id} className="border-t border-border">
                      <Td>{r.full_name}</Td>
                      <Td><span className={r.attending ? "text-gold" : "text-muted-foreground"}>{r.attending ? "Sim" : "Não"}</span></Td>
                      <Td>{r.companions}</Td>
                      <Td>{r.phone || "—"}</Td>
                      <Td>{r.dietary_restrictions || "—"}</Td>
                      <Td>{new Date(r.created_at).toLocaleDateString("pt-BR")}</Td>
                    </tr>
                  ))}
                  {rsvps.length === 0 && (<tr><td colSpan={6} className="p-8 text-center text-muted-foreground">Nenhuma confirmação ainda.</td></tr>)}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "gifts" && (
          <div>
            <div className="flex justify-between items-end mb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Total arrecadado</p>
                <p className="font-display text-4xl text-gold">R$ {giftTotal.toFixed(2)}</p>
              </div>
            </div>
            <div className="overflow-x-auto border border-border rounded-md">
              <table className="w-full text-sm">
                <thead className="bg-secondary text-xs uppercase tracking-[0.2em]">
                  <tr><Th>Convidado</Th><Th>Cota</Th><Th>Valor</Th><Th>Data</Th></tr>
                </thead>
                <tbody>
                  {gifts.map((g) => (
                    <tr key={g.id} className="border-t border-border">
                      <Td>{g.guest_name}</Td>
                      <Td>{g.gift_name}</Td>
                      <Td className="text-gold">R$ {Number(g.amount).toFixed(2)}</Td>
                      <Td>{new Date(g.created_at).toLocaleDateString("pt-BR")}</Td>
                    </tr>
                  ))}
                  {gifts.length === 0 && (<tr><td colSpan={4} className="p-8 text-center text-muted-foreground">Nenhuma contribuição ainda.</td></tr>)}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className={`p-6 rounded-md border ${accent ? "bg-foreground text-background border-foreground" : "bg-card border-border"}`}>
      <p className={`text-xs uppercase tracking-[0.3em] ${accent ? "text-gold" : "text-muted-foreground"}`}>{label}</p>
      <p className="font-display text-4xl mt-2">{value}</p>
    </div>
  );
}

const Th = ({ children }: { children: React.ReactNode }) => <th className="text-left px-4 py-3 font-medium">{children}</th>;
const Td = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => <td className={`px-4 py-3 ${className}`}>{children}</td>;
