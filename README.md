# Amazon BSB — Óleo de Avestruz

Site institucional e de e-commerce da Amazon BSB.

## Como rodar localmente

O site é HTML estático + React via Babel no navegador. Para abrir, basta servir os arquivos por qualquer servidor HTTP simples:

```bash
# Python 3
python -m http.server 8000

# Node
npx serve .
```

Depois acesse `http://localhost:8000`.

> Abrir o `index.html` direto pelo navegador (file://) não funciona por causa das restrições de CORS do Babel/JSX.

## Estrutura

- `index.html` — Página principal, estilos globais e configuração
- `app.jsx` — Composição da página + estado do carrinho
- `sections.jsx` — Todos os blocos visuais (header, hero, produtos, kits, etc.)
- `data.jsx` — Catálogo de produtos, FAQ e depoimentos
- `icons.jsx` — Ícones SVG
- `tweaks-panel.jsx` — Painel de variações (somente em modo de edição)
- `assets/` — Fotos de produtos e imagens do hero

## Deploy

Funciona em qualquer hosting estático: GitHub Pages, Netlify, Vercel, Cloudflare Pages.

### GitHub Pages

1. Faça push do conteúdo dessa pasta para o seu repositório
2. Vá em **Settings → Pages**
3. Selecione branch `main` e pasta `/ (root)`
4. Aguarde alguns minutos e acesse `https://<seu-usuario>.github.io/<repo>`
