
// ==========================
// PROTEÇÃO POR AUTH + ROLE
// ==========================
const token = localStorage.getItem("access_token");
const role = localStorage.getItem("role");

if (!token || role !== "admin") {
  window.location.href = "login.html";
  throw new Error("Acesso não autorizado");
}

// ==========================
// BOTÕES
// ==========================
document.getElementById("presencasBtn")
  .addEventListener("click", () => {
    window.location.href = "presencas.html";
  });

document.getElementById("usuariosBtn")
  .addEventListener("click", () => {
    window.location.href = "usuarios.html";
  });

// ==========================
// LOGOUT
// ==========================
document.getElementById("logoutBtn")
  .addEventListener("click", () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("role");

    window.location.href = "../index.html";
});

