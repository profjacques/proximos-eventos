// =====================================================================
// src/modulos/tarefas.js — regras de negócio (funções puras)
// =====================================================================
// CONCEITO: MÓDULOS ES (import / export).
// Em vez de um arquivão de 1000 linhas, dividimos o código em arquivos pequenos.
// O navegador até entende módulos, mas carregar dezenas de arquivos é lento;
// por isso o BUNDLER (Vite) junta tudo num pacote só no build.
//
// Estas funções NÃO alteram a lista recebida: devolvem uma lista NOVA.
// (padrão "imutável": mais fácil de entender e de depurar)

/** Cria uma tarefa nova no início da lista. Texto vazio -> lista inalterada. */
export function criarTarefa(lista, texto) {
  const limpo = texto.trim();
  if (!limpo) return lista;

  const nova = {
    // id simples e único o bastante para a aula
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    texto: limpo,
    feita: false,
    criadaEm: new Date().toISOString(), // formato ISO: o dayjs entende direto
  };
  return [nova, ...lista];
}

/** Marca/desmarca uma tarefa como feita. */
export function alternarTarefa(lista, id) {
  return lista.map((t) => (t.id === id ? { ...t, feita: !t.feita } : t));
}

/** Remove uma tarefa. */
export function removerTarefa(lista, id) {
  return lista.filter((t) => t.id !== id);
}

/** Conta quantas tarefas ainda estão pendentes. */
export function contarPendentes(lista) {
  return lista.filter((t) => !t.feita).length;
}

// ---------------------------------------------------------------------
// CONCEITO: TREE-SHAKING ("sacudir a árvore" e cair o que está morto).
// Esta função é EXPORTADA, mas NINGUÉM a importa (veja o main.js).
// O Vite percebe isso e NÃO a inclui no dist/.
//
// COMO PROVAR em sala (depois de "npm run build"):
//   grep -r "TREE_SHAKING_DEMO" dist     -> não encontra nada (foi descartada)
//   grep -r "pendente(s)" dist           -> encontra (código usado ficou)
// ---------------------------------------------------------------------
export function exportarComoTexto(lista) {
  return 'TREE_SHAKING_DEMO\n' + lista.map((t) => `- ${t.texto}`).join('\n');
}
