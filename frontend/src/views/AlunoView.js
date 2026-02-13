import { alunoController } from "../controllers/alunoController.js";

export default function AlunoView() {
  setTimeout(() => alunoController(), 0);

  return `
    <main class="aluno-container">

      <header class="aluno-header">
        <h1>Área do Aluno</h1>
        <button id="logoutBtn">Sair</button>
      </header>

      <section class="aluno-section">
        <h2>Minhas Presenças</h2>

        <div class="aluno-table-wrapper">
          <table class="presenca-table" id="presencaTable">
            <thead>
              <tr>
                <th>Data</th>
                <th>Treino</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody></tbody>
          </table>
        </div>
      </section>

    </main>
  `;
}
