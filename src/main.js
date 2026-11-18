// =====================================================================
// src/main.js — PONTO DE ENTRADA do JavaScript
// =====================================================================
// O index.html aponta para este arquivo. O Vite começa AQUI, segue cada
// "import" e monta o grafo de dependências (bundling).

// ---------- 1) CSS importado pelo JavaScript ----------
// O bundler entende CSS: junta, minifica e coloca no dist/ com hash no nome.
import './estilos.css';

// ---------- 2) PACOTES DO NPM (instalados com "npm install dayjs") ----------
// Importar pelo NOME do pacote (sem "./") faz o Vite procurar em node_modules/.
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime.js'; // plugin: "há 5 minutos"
import 'dayjs/locale/pt-br.js';                           // idioma português

dayjs.extend(relativeTime);
dayjs.locale('pt-br');

// ---------- 3) ASSETS (imagens, fontes...) ----------
// Importar um arquivo devolve a URL FINAL dele. No build, o nome ganha um hash
// (ex.: logo-3a9f1c.svg). Se a imagem mudar, o hash muda e o cache do navegador
// é renovado automaticamente.
import logoUrl from './assets/logo.svg';

// ---------- 4) NOSSOS PRÓPRIOS MÓDULOS (caminho relativo: "./") ----------
// Importamos só 4 das 5 funções: "exportarComoTexto" NÃO é importada,
// então o tree-shaking vai removê-la do dist/.
import {
  criarTarefa,
  alternarTarefa,
  removerTarefa,
  contarPendentes,
} from './modulos/tarefas.js';
import { carregar, salvar } from './modulos/armazenamento.js';

// ---------- 5) VARIÁVEIS DE AMBIENTE ----------
// import.meta.env.VITE_* vem do arquivo .env e é gravada no código NO BUILD.
// (O Render não "lê" variáveis em tempo de execução: não existe servidor.)
document.querySelector('#titulo').textContent = import.meta.env.VITE_APP_TITULO;
document.querySelector('#logo').src = logoUrl;

// ---------- 6) ESTADO E DESENHO DA TELA ----------
let tarefas = carregar(); // começa com o que estava salvo no navegador

function desenhar() {
  const lista = document.querySelector('#lista');
  lista.replaceChildren(); // limpa a lista antes de redesenhar

  for (const t of tarefas) {
    const li = document.createElement('li');
    if (t.feita) li.className = 'feita';

    const caixa = document.createElement('input');
    caixa.type = 'checkbox';
    caixa.checked = t.feita;
    caixa.addEventListener('change', () => atualizar(alternarTarefa(tarefas, t.id)));

    // textContent (e não innerHTML) evita injeção de HTML/XSS com texto digitado
    const texto = document.createElement('span');
    texto.textContent = t.texto;

    const quando = document.createElement('small');
    quando.textContent = dayjs(t.criadaEm).fromNow(); // "há 2 minutos" (usa o pacote dayjs)

    const remover = document.createElement('button');
    remover.className = 'remover';
    remover.textContent = '×';
    remover.setAttribute('aria-label', 'Remover tarefa');
    remover.addEventListener('click', () => atualizar(removerTarefa(tarefas, t.id)));

    li.append(caixa, texto, quando, remover);
    lista.append(li);
  }

  document.querySelector('#contador').textContent =
    `${contarPendentes(tarefas)} pendente(s)`;
}

// Substitui a lista, salva no navegador e redesenha.
function atualizar(novaLista) {
  tarefas = novaLista;
  salvar(tarefas);
  desenhar();
}

// ---------- 7) EVENTOS ----------
document.querySelector('#form').addEventListener('submit', (evento) => {
  evento.preventDefault(); // não recarregar a página
  const campo = document.querySelector('#novo');
  atualizar(criarTarefa(tarefas, campo.value));
  campo.value = '';
  campo.focus();
});

// CODE SPLITTING: o módulo "sobre" só é baixado neste clique.
// Abra a aba Rede (Network) das DevTools e veja o arquivo sobre-<hash>.js chegar.
document.querySelector('#btn-sobre').addEventListener('click', async () => {
  const { mostrarSobre } = await import('./modulos/sobre.js');
  mostrarSobre(document.querySelector('#sobre'));
});

desenhar(); // primeira renderização
