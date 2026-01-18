import { supabase } from "./supabaseClient.js";

let presencas = [];
let editandoId = null;

const form = document.getElementById("formPresenca");
const tabela = document.getElementById("tabelaPresencas");
const totalLista = document.getElementById("totalPresencas");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const aluno = document.getElementById("aluno").value.trim();
  const data = document.getElementById("data").value;

  if (!aluno || !data) return;

  if (editandoId === null) {
    presencas.push({
      id: Date.now(),
      aluno,
      data
    });
  } else {
    const p = presencas.find(p => p.id === editandoId);
    p.aluno = aluno;
    p.data = data;
    editandoId = null;
  }

  form.reset();
  render();
});

function render() {
  tabela.innerHTML = "";
  totalLista.innerHTML = "";

  presencas.forEach(p => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${p.aluno}</td>
      <td>${formatarData(p.data)}</td>
      <td>
        <button onclick="editar(${p.id})">Editar</button>
        <button onclick="excluir(${p.id})">Excluir</button>
      </td>
    `;

    tabela.appendChild(tr);
  });

  atualizarTotais();
}

function editar(id) {
  const p = presencas.find(p => p.id === id);
  document.getElementById("aluno").value = p.aluno;
  document.getElementById("data").value = p.data;
  editandoId = id;
}

function excluir(id) {
  presencas = presencas.filter(p => p.id !== id);
  render();
}

function atualizarTotais() {
  const mapa = {};

  presencas.forEach(p => {
    mapa[p.aluno] = (mapa[p.aluno] || 0) + 1;
  });

  for (let aluno in mapa) {
    const li = document.createElement("li");
    li.textContent = `${aluno}: ${mapa[aluno]} presença(s)`;
    totalLista.appendChild(li);
  }
}

function formatarData(data) {
  return new Date(data).toLocaleDateString("pt-BR");
}

const btnSair = document.getElementById("btnSair");

if (btnSair) {
  btnSair.addEventListener("click", async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Erro ao sair:", error.message);
      return;
    }

    window.location.href = "/index.html";
  });
}
