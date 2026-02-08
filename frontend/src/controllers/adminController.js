export function adminController() {
  const logoutBtn = document.getElementById("logoutBtn");

  logoutBtn.addEventListener("click", () => {
    location.hash = "/login";
  });

  console.log("Painel Admin carregado com sucesso!");
}
