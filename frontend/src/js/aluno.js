// ==========================
// PROTEÇÃO DA ROTA
// ==========================
console.log("aluno.js carregado");

const role = localStorage.getItem("role");
const token = localStorage.getItem("access_token");

if (!token || role !== "aluno") {
  window.location.href = "/index.html";
}

// ==========================
// LOGOUT
// ==========================
const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "/index.html";
});

// ==========================
// PRESENÇA (MOCK POR ENQUANTO)
// ==========================
const presencas = [
  { data: "10/01/2026", treino: "Jiu-Jitsu", status: "Presente" },
  { data: "12/01/2026", treino: "Jiu-Jitsu", status: "Ausente" },
  { data: "15/01/2026", treino: "Jiu-Jitsu", status: "Presente" },
];

const tbody = document.querySelector("#presencaTable tbody");

presencas.forEach(p => {
  const tr = document.createElement("tr");

  tr.innerHTML = `
    <td>${p.data}</td>
    <td>${p.treino}</td>
    <td>${p.status}</td>
  `;

  tbody.appendChild(tr);
});
