import { professorController } from "../controllers/professorController.js";

export default function ProfessorView() {
  // chama o controller depois que a view entrar na tela
  setTimeout(() => professorController(), 0);

  return `
  
    <header>
    <h1>Painel do Professor</h1>
    <button id="btnSair">Sair</button>
  </header>

  <main>

    <!-- REGISTRO DE PRESENÇA -->
    <section class="form-presenca">
      <h2>Registrar Presença</h2>

      <div class="filtro-data">
        <label for="dataPresenca">Data da aula:</label>
        <input type="date" id="dataPresenca" />
        <button id="btnCarregarAlunos" type="button">
          Carregar alunos
        </button>
      </div>
    </section>

    <!-- LISTA DE ALUNOS -->
    <section class="lista-alunos">
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