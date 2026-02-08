export function professorController() {
  const btnSair = document.getElementById("btnSair");
  const btnCarregar = document.getElementById("btnCarregarAlunos");
  const lista = document.getElementById("listaAlunos");

  // botão sair
  btnSair.addEventListener("click", () => {
    location.hash = "/login";
  });

  // carregar alunos
  btnCarregar.addEventListener("click", () => {
    lista.innerHTML = `
      <li><label><input type="checkbox"> João</label></li>
      <li><label><input type="checkbox"> Maria</label></li>
    `;
  });

  // confirmar presença
  document
    .getElementById("formListaPresenca")
    .addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Presença registrada!");
    });
}
