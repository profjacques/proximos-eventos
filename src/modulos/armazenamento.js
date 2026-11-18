// =====================================================================
// src/modulos/armazenamento.js — guarda as tarefas no navegador
// =====================================================================
// O site é ESTÁTICO: não existe servidor nem banco de dados no Render.
// Por isso os dados ficam no localStorage do próprio navegador de cada pessoa.
// (Consequência: cada visitante vê apenas as SUAS tarefas.)

const CHAVE = 'mini-tarefas:v1'; // "v1" permite mudar o formato no futuro sem conflito

/** Lê as tarefas salvas. Se não houver (ou estiver corrompido), devolve lista vazia. */
export function carregar() {
  try {
    const texto = localStorage.getItem(CHAVE);
    return texto ? JSON.parse(texto) : [];
  } catch {
    // localStorage pode estar bloqueado (modo privado) ou o JSON pode estar inválido
    return [];
  }
}

/** Salva a lista completa. */
export function salvar(lista) {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(lista));
  } catch {
    // Sem permissão ou sem espaço: o app continua funcionando, só não persiste.
  }
}
