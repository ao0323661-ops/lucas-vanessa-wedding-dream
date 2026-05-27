export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <title>Lucas & Vanessa — página indisponível</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font: 15px/1.6 system-ui, -apple-system, sans-serif; background: #f7f3ea; color: #3b3427; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 30rem; width: 100%; text-align: center; padding: 2.25rem; background: rgba(255, 252, 246, 0.88); border: 1px solid rgba(101, 114, 76, 0.2); border-radius: 0.5rem; box-shadow: 0 28px 80px -42px rgba(64, 78, 49, 0.45); }
      .kicker { color: #66724c; font-size: 0.7rem; letter-spacing: 0.28em; text-transform: uppercase; margin: 0 0 1rem; }
      h1 { font-family: Georgia, serif; font-size: 2rem; font-weight: 400; margin: 0 0 0.5rem; }
      p { color: #6f6758; margin: 0 0 1.5rem; }
      .actions { display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; }
      a, button { padding: 0.7rem 1rem; border-radius: 0.375rem; font: inherit; font-size: 0.75rem; letter-spacing: 0.18em; text-transform: uppercase; cursor: pointer; text-decoration: none; border: 1px solid transparent; }
      .primary { background: #66724c; color: #fffaf1; }
      .secondary { background: #fffaf1; color: #3b3427; border-color: rgba(101, 114, 76, 0.25); }
    </style>
  </head>
  <body>
    <div class="card">
      <p class="kicker">Lucas & Vanessa</p>
      <h1>Não conseguimos carregar esta página</h1>
      <p>Tente atualizar a página ou voltar para o início do site de Lucas & Vanessa.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Tentar novamente</button>
        <a class="secondary" href="/">Voltar ao início</a>
      </div>
    </div>
  </body>
</html>`;
}
