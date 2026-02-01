import { requireAdmin } from "./authGuard.js";
import { supabase } from "./supabaseClient.js";

document.addEventListener("DOMContentLoaded", async () => {
  await requireAdmin();

  // ===== SEÇÕES =====
  const dashboard = document.getElementById("dashboardSection");
  const preCadastro = document.getElementById("preCadastroSection");
  const listaPessoas = document.getElementById("listaPessoasSection");
  const presencasSection = document.getElementById("presencasSection");

  // ===== BOTÕES =====
  const pessoasBtn = document.getElementById("pessoasBtn");
  const presencasBtn = document.getElementById("presencasBtn");
  const voltarBtn = document.getElementById("voltarPainelBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  // ===== FORM =====
  const form = document.getElementById("formPessoa");
  const nome = document.getElementById("nome");
  const dataNascimento = document.getElementById("dataNascimento");
  const email = document.getElementById("email");
  const telefone = document.getElementById("telefone");
  const tipo = document.getElementById("tipo");

  // ===== NAVEGAÇÃO =====
  function mostrarDashboard() {
    dashboard.style.display = "block";
    preCadastro.style.display = "none";
    listaPessoas.style.display = "none";
    presencasSection.style.display = "none";
    voltarBtn.style.display = "none";
  }

  function mostrarPessoas() {
    dashboard.style.display = "none";
    preCadastro.style.display = "block";
    listaPessoas.style.display = "block";
    presencasSection.style.display = "none";
    voltarBtn.style.display = "block";
    carregarPessoas();
  }

  function mostrarPresencas() {
    dashboard.style.display = "none";
    preCadastro.style.display = "none";
    listaPessoas.style.display = "none";
    presencasSection.style.display = "block";
    voltarBtn.style.display = "block";
    carregarPresencas();
  }

  // ===== EVENTOS =====
  pessoasBtn.addEventListener("click", mostrarPessoas);
  presencasBtn.addEventListener("click", mostrarPresencas);
  voltarBtn.addEventListener("click", mostrarDashboard);

  logoutBtn.addEventListener("click", async () => {
    await supabase.auth.signOut();
  });

  // ===== SUBMIT =====
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const { data: pessoa, error } = await supabase
      .from("pessoas")
      .insert({
        nome_completo: nome.value,
        data_nascimento: dataNascimento.value,
        email: email.value || null,
        telefone: telefone.value || null,
        tipo: tipo.value,
      })
      .select()
      .single();

    if (error) {
      alert(error.message);
      return;
    }

    const modalidades = [];
    document
    .querySelectorAll('input[type="checkbox"]:checked')
    .forEach((cb) => {
      const faixa = document.querySelector(
        `select[data-faixa="${cb.value}"]`
      ).value;

      modalidades.push({
        pessoa_id: pessoa.id,
        modalidade: cb.value,
        faixa,
      });
    });

    console.log("ANTES DO INSERT - MODALIDADES:", modalidades);

    if (modalidades.length > 0) {
      const { error } = await supabase
        .from("pessoas_modalidades")
        .insert(modalidades);

      if (error) {
        console.error("ERRO AO INSERIR MODALIDADES:", error);
        return; // 👈 não reseta se deu erro
      }
    } else {
      console.warn("⚠️ Nenhuma modalidade selecionada");
    }

    // 👇 só reseta se tudo deu certo
    form.reset();
    carregarPessoas();

  });
});

// ===== LISTAGEM PESSOAS =====
async function carregarPessoas() {
  const { data, error } = await supabase
    .from("pessoas")
    .select(`
      id,
      nome_completo,
      tipo,
      profiles ( id ),
      pessoas_modalidades (modalidade, faixa, ativa)
    `)
    .order("nome_completo");

  if (error) {
    console.error(error);
    return;
  }

  const tbody = document.getElementById("pessoasTableBody");
  tbody.innerHTML = "";

  data.forEach((pessoa) => {
    const temConta = pessoa.profiles && pessoa.profiles.length > 0;
    
    const modalidades = pessoa.pessoas_modalidades
      .filter((m) => m.ativa)
      .map((m) => `${m.modalidade} (${m.faixa})`)
      .join(", ");

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td data-label="Nome">${pessoa.nome_completo}</td>
      <td data-label="Tipo">${pessoa.tipo}</td>
      <td data-label="Modalidades">${modalidades || "-"}</td>
      <td data-label="Status"
      class="${temConta ? "status-ok" : "status-sem-conta"}"
      >
      ${temConta ? "Com conta" : "Sem conta"}
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// ===== LISTAGEM PRESENÇAS =====
async function carregarPresencas() {
  const { data, error } = await supabase
    .from("presencas")
    .select(`
      data,
      profiles (
        role
      )
    `)
    .order("data", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  const tbody = document.getElementById("presencasTableBody");
  tbody.innerHTML = "";

  data.forEach((registro) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${registro.profiles?.name || "-"}</td>
      <td>${registro.data}</td>
      <td>${registro.profiles?.role || "-"}</td>
    `;
    tbody.appendChild(tr);
  });
}
