# Mini Tarefas — projeto demonstrativo (Tema 3)

Aplicação simples (lista de tarefas) criada para mostrar, em 15 minutos:

1. **Gerenciamento de pacotes** — npm (e equivalentes em Yarn)
2. **Ferramentas de build** — Vite (com comparação a esbuild e Webpack)
3. **Implantação de conteúdo estático** — Render

## Requisitos
- Node.js **20.19+** ou **22.12+** (`node -v`) — arquivo `.nvmrc` indica a 22
- Conta no GitHub e no Render (plano gratuito atende sites estáticos)

## Como rodar localmente
```bash
npm install        # lê o package.json e baixa os pacotes em node_modules/ (gera o package-lock.json)
npm run dev        # servidor de desenvolvimento -> http://localhost:5173
npm run build      # gera a pasta dist/ (versão de produção)
npm run preview    # serve o dist/ -> http://localhost:4173
```

## Mapa dos arquivos (leia nesta ordem)
| Arquivo | O que ensina |
|---|---|
| `package.json` / `package.json.comentado.jsonc` | dependências, devDependencies, semver, scripts |
| `index.html` | entrada do Vite, `<script type="module">`, `%VITE_...%` |
| `src/main.js` | imports de pacote, CSS, asset, módulos, `import()` dinâmico, variáveis de ambiente |
| `src/modulos/tarefas.js` | módulos ES e **tree-shaking** (função não usada some do build) |
| `src/modulos/sobre.js` | **code splitting** + diferença dev × produção |
| `vite.config.js` | `base`, `outDir`, `define`, servidor |
| `.env` | variáveis `VITE_*` (nunca segredos) |
| `render.yaml` | deploy como código no Render |
| `comparativo-build/` | o mesmo projeto em esbuild e Webpack (apenas leitura) |

## Experimentos rápidos após `npm run build`
```bash
ls -lh dist dist/assets                 # arquivos com HASH no nome
grep -r "TREE_SHAKING_DEMO" dist        # nada: função não usada foi removida (tree-shaking)
grep -r "pendente(s)" dist              # encontra: código usado permaneceu
```
No navegador (DevTools > Rede/Network), clique em **Sobre este build**: o arquivo `sobre-<hash>.js` só é baixado nesse momento (code splitting).

## Publicar no Render (site estático)
1. **Gere e versione o lockfile:** rode `npm install` e faça commit do `package-lock.json` (o `npm ci` do Render **exige** esse arquivo).
2. Suba o projeto para um repositório no GitHub (`node_modules/` e `dist/` ficam de fora pelo `.gitignore`).
3. No Render: **New → Static Site** → conecte o repositório.
4. Preencha:
   - **Build Command:** `npm ci && npm run build`
   - **Publish Directory:** `dist`
   - **Environment:** `NODE_VERSION` = `22`
5. **Create Static Site.** Em 1–3 minutos você recebe uma URL `https://<nome>.onrender.com`.
6. A partir daí, cada `git push` na branch conectada dispara um novo deploy automático.

> Alternativa: com o `render.yaml` na raiz, use **New → Blueprint** e o Render preenche tudo.

## Cheat sheet: npm × Yarn
| Tarefa | npm | Yarn |
|---|---|---|
| Instalar tudo | `npm install` | `yarn install` |
| Adicionar pacote | `npm install dayjs` | `yarn add dayjs` |
| Adicionar como dev | `npm install -D vite` | `yarn add -D vite` |
| Remover pacote | `npm uninstall dayjs` | `yarn remove dayjs` |
| Rodar script | `npm run dev` | `yarn dev` |
| Instalação limpa (CI) | `npm ci` | `yarn install --immutable` (Yarn 1: `--frozen-lockfile`) |
| Arquivo de trava | `package-lock.json` | `yarn.lock` |
| Executar sem instalar | `npx cowsay oi` | `yarn dlx cowsay oi` |

Regra de ouro: **um gerenciador por projeto** (não misture `package-lock.json` com `yarn.lock`).

## Problemas comuns
| Sintoma | Causa provável | Solução |
|---|---|---|
| Build no Render falha em `npm ci` | `package-lock.json` não foi commitado | rode `npm install` local e faça commit do lockfile |
| Erro de versão do Node / `crypto.hash is not a function` | Node antigo | defina `NODE_VERSION=22` no Render |
| Site abre em branco após o deploy | Publish Directory errado | use `dist` (não `build` nem `public`) |
| Imagem/JS com 404 em subpasta | `base` incorreto | ajuste `base` no `vite.config.js` |
| `localStorage` vazio em outro computador | dados ficam no navegador de cada pessoa | é esperado em site estático |
