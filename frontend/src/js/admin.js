/**
 * admin.js — Painel Administrativo
 */

import { requireAdmin } from "./authGuard.js";
import { supabase } from "./supabaseClient.js";
import { loadPessoa, initEdicaoPessoa } from "./admin-pessoas-edit.js";
import { initModalEditarPessoa } from "./modal.js";

/* ======================================================
   🚀 INIT
====================================================== */

document.addEventListener("DOMContentLoaded", async () => {
  await requireAdmin();

  // ✅ Modal inicializado
  const modalEditarPessoa = initModalEditarPessoa();

  // ✅ Submit do modal conectado aqui
  initEdicaoPessoa({
    onSuccess: () => {
      alert("Pessoa atualizada com sucesso!");
      modalEditarPessoa.fechar();
      carregarPessoas();
    }
  });


  /* ======================================================
     SEÇÕES
  ====================================================== */

  const dashboardSection = document.getElementById("dashboardSection");
  const preCadastroSection = document.getElementById("preCadastroSection");
  const listaPessoasSection = document.getElementById("listaPessoasSection");
  const presencasSection = document.getElementById("presencasSection");

  /* ======================================================
     BOTÕES
  ====================================================== */

  const pessoasBtn = document.getElementById("pessoasBtn");
  const presencasBtn = document.getElementById("presencasBtn");
  const voltarBtn = document.getElementById("voltarPainelBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  /* ======================================================
     FORM PRÉ-CADASTRO
  ====================================================== */

  const formPessoa = document.getElementById("formPessoa");
  const nomeInput = document.getElementById("nome");
  const dataNascimentoInput = document.getElementById("dataNascimento");
  const emailInput = document.getElementById("email");
  const telefoneInput = document.getElementById("telefone");
  const tipoInput = document.getElementById("tipo");

  /* ======================================================
     NAVEGAÇÃO
  ====================================================== */

  function mostrarDashboard() {
    dashboardSection.style.display = "block";
    preCadastroSection.style.display = "none";
    listaPessoasSection.style.display = "none";
    presencasSection.style.display = "none";
    voltarBtn.style.display = "none";
  }

  function mostrarPessoas() {
    dashboardSection.style.display = "none";
    preCadastroSection.style.display = "block";
    listaPessoasSection.style.display = "block";
    presencasSection.style.display = "none";
    voltarBtn.style.display = "block";
    carregarPessoas();
  }

  function mostrarPresencas() {
    dashboardSection.style.display = "none";
    preCadastroSection.style.display = "none";
    listaPessoasSection.style.display = "none";
    presencasSection.style.display = "block";
    voltarBtn.style.display = "block";
    carregarPresencas();
  }

  document.getElementById("pessoasBtn").addEventListener("click", mostrarPessoas);
  presencasBtn.addEventListener("click", mostrarPresencas);
  voltarBtn.addEventListener("click", mostrarDashboard);

  logoutBtn.addEventListener("click", async () => {
    await supabase.auth.signOut();
  });

  /* ======================================================
     SUBMIT — PRÉ-CADASTRO
  ====================================================== */

  formPessoa.addEventListener("submit", async (e) => {
    e.preventDefault();

    const { data: pessoa, error } = await supabase
      .from("pessoas")
      .insert({
        nome_completo: nomeInput.value,
        data_nascimento: dataNascimentoInput.value,
        email: emailInput.value || null,
        telefone: telefoneInput.value || null,
        tipo: tipoInput.value,
      })
      .select()
      .maybeSingle();

    if (error) return alert(error.message);

    formPessoa.reset();
    carregarPessoas();
  });

  /* ======================================================
     LISTAGEM — Pessoas
  ====================================================== */

  async function carregarPessoas() {
    const { data, error } = await supabase
      .from("pessoas")
      .select("id,nome_completo,tipo,profiles(id)")
      .order("nome_completo");

    if (error) return console.error(error);

    const tbody = document.getElementById("pessoasTableBody");
    tbody.innerHTML = "";

    data.forEach((pessoa) => {
      const temConta = pessoa.profiles?.length > 0;

      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${pessoa.nome_completo}</td>
        <td>${pessoa.tipo}</td>
        <td>-</td>
        <td class="${temConta ? "status-ok" : "status-sem-conta"}">
          ${temConta ? "Com conta" : "Sem conta"}
        </td>
        <td>
          <button class="btn-edit">Editar</button>
        </td>
      `;

      tr.querySelector(".btn-edit").addEventListener("click", () => {
        modalEditarPessoa.abrir();
        loadPessoa(pessoa.id);
      });


      tbody.appendChild(tr);
    });
  }

  /* ======================================================
     LISTAGEM — Presenças
  ====================================================== */

  async function carregarPresencas() {
    const { data, error } = await supabase
      .from("presencas")
      .select("data")
      .order("data", { ascending: false });

    if (error) return console.error(error);

    const tbody = document.getElementById("presencasTableBody");
    tbody.innerHTML = "";

    data.forEach((registro) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>-</td>
        <td>${registro.data}</td>
        <td>-</td>
      `;
      tbody.appendChild(tr);
    });
  }

  mostrarDashboard();
});
