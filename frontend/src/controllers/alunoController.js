import { supabase } from "../services/supabaseClient.js";

export function alunoController() {
  const logoutBtn = document.getElementById("logoutBtn");
  const tbody = document.querySelector("#presencaTable tbody");

  // logout
  logoutBtn.addEventListener("click", async () => {
    await supabase.auth.signOut();
    location.hash = "/login";
  });

  // exemplo de presenças (mock)
  const presencas = [
    { data: "2026-02-01", treino: "Luta Livre", status: "Presente" },
    // { data: "2026-02-03", treino: "Jiu-Jitsu", status: "Faltou" },
  ];

  // renderiza tabela
  tbody.innerHTML = presencas
    .map(
      (p) => `
        <tr>
          <td>${p.data}</td>
          <td>${p.treino}</td>
          <td>${p.status}</td>
        </tr>
      `
    )
    .join("");
}
