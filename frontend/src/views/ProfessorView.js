import { professorController } from "../controllers/professorController.js";

export default function ProfessorView() {
  setTimeout(() => professorController(), 0);

  return `
    <main class="professor-container">

      <!-- HEADER -->
      <header class="professor-header">
        <h1>Painel do Professor</h1>
        <button id="btnSair">Sair</button>
      </header>

      <!-- REGISTRO DE PRESENÇA -->
      <section class="professor-section form-presenca">
        <h2>Registrar Presença</h2>

        <div class="filtro-data">
          <div>
            <label for="dataPresenca">Data da aula:</label>
            <input type="date" id="dataPresenca" />
          </div>

          <button id="btnCarregarAlunos" type="button">
            Carregar alunos
          </button>
        </div>
      </section>

      <!-- LISTA DE ALUNOS -->
      <section class="professor-section lista-alunos">
        <h2>Alunos</h2>

        <form id="formListaPresenca">
          <ul id="listaAlunos"></ul>

          <button type="submit" class="btn-confirmar">
            Confirmar presença
          </button>
        </form>
      </section>

    </main>
  `;
}
