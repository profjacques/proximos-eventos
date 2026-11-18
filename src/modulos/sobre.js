// =====================================================================
// src/modulos/sobre.js — painel "Sobre este build"
// =====================================================================
// CONCEITO: CODE SPLITTING (divisão de código) com import() dinâmico.
// Este arquivo NÃO é importado no topo do main.js. Ele só é baixado quando a
// pessoa clica no botão. No build, o Vite o transforma num arquivo separado
// (dist/assets/sobre-<hash>.js) -> o carregamento inicial do site fica menor.
//
// Este painel também prova a diferença entre DESENVOLVIMENTO e PRODUÇÃO:
// rode "npm run dev" e depois "npm run build + preview" e compare os valores.

// __APP_VERSAO__ e __BUILD_DATA__ NÃO são variáveis reais: o Vite troca esses
// nomes pelo texto definido em "define", no vite.config.js, durante o build.
/* global __APP_VERSAO__, __BUILD_DATA__ */

export function mostrarSobre(container) {
  const linhas = [
    // import.meta.env.* = variáveis do Vite. Viram TEXTO FIXO no bundle.
    ['Aplicação', import.meta.env.VITE_APP_TITULO],   // vem do arquivo .env
    ['Versão (package.json)', __APP_VERSAO__],         // vem do vite.config.js (define)
    ['Build gerado em', __BUILD_DATA__],
    ['Modo', import.meta.env.MODE],                    // "development" ou "production"
    ['É produção?', import.meta.env.PROD ? 'sim' : 'não'],
  ];

  const lista = document.createElement('dl');
  for (const [rotulo, valor] of linhas) {
    const dt = document.createElement('dt');
    dt.textContent = rotulo;
    const dd = document.createElement('dd');
    dd.textContent = valor;
    lista.append(dt, dd);
  }

  container.replaceChildren(lista);
  container.hidden = false;
}
