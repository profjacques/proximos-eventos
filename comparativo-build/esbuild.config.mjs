// =====================================================================
// esbuild.config.mjs — o MESMO projeto, empacotado com o ESBUILD
// =====================================================================
// ARQUIVO DE LEITURA (comparação). Não é usado na aula nem no deploy.
// Para testar depois (opcional):
//   npm install -D esbuild
//   node comparativo-build/esbuild.config.mjs
//
// O esbuild é um bundler escrito em Go: extremamente rápido.
// Em troca, é "cru": faz bundling, minificação e tree-shaking, mas NÃO
//   - lê o index.html (você escreve o HTML e aponta para os arquivos gerados),
//   - tem servidor de desenvolvimento com HMR pronto como o Vite,
//   - entende import.meta.env (precisamos "definir" cada variável à mão).
// O Vite usa o esbuild por baixo dos panos no modo dev.

import { build } from 'esbuild';

await build({
  entryPoints: ['src/main.js'],   // ponto de entrada (igual ao <script> do index.html)
  bundle: true,                   // seguir os imports e juntar tudo
  minify: true,                   // minificar JS e CSS
  splitting: true,                // code splitting (o import() dinâmico vira arquivo separado)
  format: 'esm',                  // splitting exige ES Modules
  outdir: 'dist-esbuild',         // pasta de saída
  entryNames: '[name]-[hash]',    // hash no nome (cache busting)
  loader: { '.svg': 'file' },     // SVG importado vira arquivo + URL
  // O esbuild não conhece o "define" do Vite nem import.meta.env: declaramos tudo aqui.
  define: {
    'import.meta.env.VITE_APP_TITULO': '"Mini Tarefas"',
    'import.meta.env.MODE': '"production"',
    'import.meta.env.PROD': 'true',
    __APP_VERSAO__: '"1.0.0"',
    __BUILD_DATA__: JSON.stringify(new Date().toISOString()),
  },
});

console.log('esbuild terminou -> dist-esbuild/');
