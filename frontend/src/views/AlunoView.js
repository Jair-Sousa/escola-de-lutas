import { alunoController } from "../controllers/alunoController.js";

export default function AlunoView() {
  // chama o controller depois que a view entrar na tela
  setTimeout(() => professorController(), 0);

  return `
    <header class="header">
    <h1>Área do Aluno</h1>
    <button id="logoutBtn">Sair</button>
  </header>

  <main class="container">
    <h2>Minhas Presenças</h2>

    <table id="presencaTable">
      <thead>
        <tr>
          <th>Data</th>
          <th>Treino</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <!-- Presenças entram aqui -->
      </tbody>
    </table>
  </main>
  `;
}