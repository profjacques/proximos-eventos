// =====================================================================
// vite.config.js — configuração do VITE (ferramenta de build)
// =====================================================================
// Este arquivo roda no NODE (no seu computador ou no Render), nunca no navegador.
// Tudo é opcional: o Vite funciona sem configuração. Aqui mostramos as opções
// mais úteis para entender o que a ferramenta controla.

import { defineConfig } from 'vite'; // defineConfig só ajuda o editor com autocompletar
import { readFileSync } from 'node:fs';

// Lemos o package.json para reaproveitar a versão do projeto dentro do site.
const pkg = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf-8'),
);

export default defineConfig({
  // base = prefixo de todas as URLs do site.
  //   '/'         -> site na raiz do domínio (caso do Render: https://meu-site.onrender.com/)
  //   '/repo/'    -> necessário em hospedagens com subpasta (ex.: GitHub Pages de projeto)
  base: '/',

  // ---------- DESENVOLVIMENTO: npm run dev ----------
  server: {
    port: 5173,  // porta do servidor local
    open: true,  // abre o navegador automaticamente
  },

  // ---------- PRÉVIA: npm run preview ----------
  // Serve a pasta dist/ para você testar o resultado do build antes de publicar.
  preview: {
    port: 4173,
  },

  // ---------- PRODUÇÃO: npm run build ----------
  build: {
    outDir: 'dist',       // pasta de saída (é a "Publish Directory" do Render)
    emptyOutDir: true,    // limpa o dist/ antigo antes de gerar o novo
    sourcemap: false,     // true geraria .map para depurar o código minificado
    assetsInlineLimit: 0, // 0 = nunca embutir imagens no JS; todas viram arquivos com hash.
                          // (padrão: arquivos < 4 KB viram texto base64 dentro do JS)
  },

  // define = substituição de TEXTO feita no build.
  // Onde o código tiver __APP_VERSAO__, o Vite escreve o valor literal.
  // JSON.stringify é obrigatório: o valor precisa ser um trecho de código válido ("1.0.0" com aspas).
  define: {
    __APP_VERSAO__: JSON.stringify(pkg.version),
    __BUILD_DATA__: JSON.stringify(new Date().toISOString()),
  },
});
