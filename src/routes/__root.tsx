import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";

const SITE_TITLE = "Lucas & Vanessa — Nosso Casamento";
const SITE_DESCRIPTION =
  "Site oficial do casamento de Lucas & Vanessa. Veja os detalhes da celebração, confirme presença, envie uma mensagem e participe da lista de presentes.";
const HERO_IMAGE = "/images/capa-casal.jpg";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="paper-luxe max-w-md rounded-md p-8 text-center">
        <p className="gold-kicker mb-4">Lucas & Vanessa</p>
        <h1 className="font-display text-7xl text-gold">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Página não encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Este endereço não existe ou foi movido. Volte para o site do casamento de Lucas & Vanessa.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-gold px-5 py-3 text-xs font-medium uppercase tracking-[0.24em] text-background shadow-gold transition-colors hover:bg-olive-deep"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="paper-luxe max-w-md rounded-md p-8 text-center">
        <p className="gold-kicker mb-4">Instabilidade</p>
        <h1 className="font-display text-3xl leading-tight tracking-tight text-foreground">
          Não conseguimos carregar esta página
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Tente atualizar a página ou voltar para o início do site de Lucas & Vanessa.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-gold px-5 py-3 text-xs font-medium uppercase tracking-[0.22em] text-background shadow-gold transition-colors hover:bg-olive-deep"
          >
            Tentar novamente
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-border bg-background px-5 py-3 text-xs font-medium uppercase tracking-[0.22em] text-foreground transition-colors hover:border-olive hover:text-gold"
          >
            Voltar ao início
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: SITE_TITLE },
      { name: "description", content: SITE_DESCRIPTION },
      { name: "author", content: "Lucas & Vanessa" },
      { name: "application-name", content: SITE_TITLE },
      { name: "apple-mobile-web-app-title", content: SITE_TITLE },
      { name: "robots", content: "index, follow" },
      {
        name: "keywords",
        content:
          "casamento Lucas e Vanessa, Lucas & Vanessa, RSVP casamento, lista de presentes, mural de mensagens",
      },
      { name: "theme-color", content: "#66724c" },
      { property: "og:title", content: SITE_TITLE },
      { property: "og:description", content: SITE_DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:site_name", content: SITE_TITLE },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: SITE_TITLE },
      { name: "twitter:description", content: SITE_DESCRIPTION },
      {
        property: "og:image",
        content: HERO_IMAGE,
      },
      {
        name: "twitter:image",
        content: HERO_IMAGE,
      },
    ],
    links: [
      {
        rel: "canonical",
        href: "/",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
