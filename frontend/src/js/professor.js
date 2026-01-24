import { requireRole } from "./authGuard.js";
import { supabase } from "./supabaseClient.js";

document.addEventListener("DOMContentLoaded", async () => {
  await requireRole(["professor", "admin"]);

  const btnSair = document.getElementById("btnSair");
  if (btnSair) {
    btnSair.addEventListener("click", async () => {
      await supabase.auth.signOut();
      window.location.href = "/login.html";
    });
  }

  // ==========================
  // ELEMENTOS
  // ==========================
  const btnCarregar = document.getElementById("btnCarregarAlunos");
  const listaAlunos = document.getElementById("listaAlunos");
  const formPresenca = document.getElementById("formListaPresenca");
  const inputData = document.getElementById("dataPresenca");

  let alunos = [];

  // ==========================
  // CARREGAR ALUNOS
  // ==========================
  btnCarregar.addEventListener("click", async () => {
    listaAlunos.innerHTML = "<li>Carregando alunos...</li>";

    const { data, error } = await supabase
      .from("profiles")
      .select("id, name")
      .eq("role", "aluno")
      .order("name");

    if (error) {
      alert("Erro ao carregar alunos");
      console.error(error);
      return;
    }

    alunos = data;
    renderizarAlunos(alunos);
  });

  function renderizarAlunos(alunos) {
    listaAlunos.innerHTML = "";

    if (alunos.length === 0) {
      listaAlunos.innerHTML = "<li>Nenhum aluno encontrado</li>";
      return;
    }

    alunos.forEach((aluno) => {
      const li = document.createElement("li");

      li.innerHTML = `
        <label>
          <input type="checkbox" value="${aluno.id}" />
          ${aluno.name}
        </label>
      `;

      listaAlunos.appendChild(li);
    });
  }

  // ==========================
  // CONFIRMAR PRESENÇA
  // ==========================
  formPresenca.addEventListener("submit", async (e) => {
    e.preventDefault();

    const dataPresenca = inputData.value;
    const selecionados = [
      ...listaAlunos.querySelectorAll("input[type='checkbox']:checked"),
    ];

    if (!dataPresenca) {
      alert("Selecione a data da aula.");
      return;
    }

    if (selecionados.length === 0) {
      alert("Selecione ao menos um aluno.");
      return;
    }

    const registros = selecionados.map((checkbox) => ({
      aluno_id: checkbox.value,
      data: dataPresenca,
      presente: true,
    }));

    const { error } = await supabase
      .from("presencas")
      .insert(registros);

    if (error) {
      alert("Erro ao registrar presença.");
      console.error(error);
      return;
    }

    alert("Presença registrada com sucesso!");
    formPresenca.reset();
  });
});
