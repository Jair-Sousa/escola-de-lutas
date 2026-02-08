import { adminController } from "../controllers/adminController.js";

export default function AdminView() {
  // chama o controller depois que a view entrar na tela
  setTimeout(() => loginController(), 0);

  return `
  
    <main class="membro-container">
      <h1>Painel do Administrador</h1>
      <p>Gerencie o sistema</p>

      <!-- ===== DASHBOARD ===== -->
      <section id="dashboardSection">
        <div class="areas">
          <div class="card">
            <h2>Presenças</h2>
            <p>Registrar, editar e excluir presenças dos alunos.</p>
            <button id="presencasBtn">Gerenciar</button>
          </div>

          <div class="card">
            <h2>Usuários</h2>
            <p>Criar, editar permissões e desativar usuários.</p>
            <button id="usuariosBtn">Gerenciar</button>
          </div>

          <div class="card">
            <h2>Pessoas</h2>
            <p>Pré-cadastro de alunos e professores.</p>
            <button id="pessoasBtn">Cadastrar</button>
          </div>
        </div>
      </section>

      <button id="voltarPainelBtn" class="voltar-btn" style="display: none">
        ← Voltar ao painel
      </button>

      <!-- ===== PRÉ-CADASTRO ===== -->
      <section id="preCadastroSection" style="display: none">
        <h2>Pré-cadastro de Pessoa</h2>

        <form id="formPessoa">
          <input type="text" id="nome" placeholder="Nome completo" required />
          <input type="date" id="dataNascimento" required />
          <input type="email" id="email" placeholder="E-mail (opcional)" />
          <input type="tel" id="telefone" placeholder="Telefone (opcional)" />

          <select id="tipo" required>
            <option value="">Tipo</option>
            <option value="aluno">Aluno</option>
            <option value="professor">Professor</option>
          </select>

          <fieldset>
            <legend>Modalidades</legend>

            <label>
              <input type="checkbox" value="jiu-jitsu" />
              Jiu-jitsu
              <select data-faixa="jiu-jitsu">
                <option value="branca">Branca</option>
                <option value="azul">Azul</option>
                <option value="roxa">Roxa</option>
                <option value="marrom">Marrom</option>
                <option value="preta">Preta</option>
              </select>
            </label>

            <label>
              <input type="checkbox" value="luta-livre" />
              Luta livre
              <select data-faixa="luta-livre">
                <option value="branca">Branca</option>
                <option value="azul">Azul</option>
                <option value="roxa">Roxa</option>
                <option value="marrom">Marrom</option>
                <option value="preta">Preta</option>
              </select>
            </label>

            <label>
              <input type="checkbox" value="muay-thai" />
              Muay thai
              <select data-faixa="muay-thai">
                <option value="branca">Branca</option>
                <option value="azul">Azul</option>
                <option value="roxa">Roxa</option>
                <option value="marrom">Marrom</option>
                <option value="preta">Preta</option>
              </select>
            </label>
          </fieldset>

          <button type="submit">Cadastrar Pessoa</button>
        </form>
      </section>

      <!-- ===== LISTA ===== -->
      <section id="listaPessoasSection" style="display: none">
        <h2>Pessoas cadastradas</h2>

        <table class="tabela-pessoas">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Tipo</th>
              <th>Modalidades</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody id="pessoasTableBody"></tbody>
        </table>
      </section>

      <!-- ===== PRESENÇAS (ADMIN) ===== -->
      <section id="presencasSection" style="display: none">
        <h2>Presenças</h2>

        <!-- Filtros (simples por enquanto) -->
        <div class="filtros-presencas">
          <input type="date" id="filtroData" />
          <select id="filtroTipo">
            <option value="">Todos</option>
            <option value="aluno">Alunos</option>
            <option value="professor">Professores</option>
          </select>

          <button id="filtrarPresencasBtn">Filtrar</button>
        </div>

        <!-- Lista -->
        <table class="tabela-pessoas">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Data</th>
              <th>Tipo</th>
            </tr>
          </thead>
          <tbody id="presencasTableBody">
            <!-- preenchido via JS -->
          </tbody>
        </table>
      </section>

      <!-- ========================================= -->
      <!-- 🧍 MODAL — EDIÇÃO DE PESSOA               -->
      <!-- ========================================= -->

      <div id="editarPessoaModal" class="modal hidden">

        <div class="modal-overlay"></div>

        <div class="modal-content">

          <!-- Cabeçalho -->
          <header class="modal-header">
            <h2>Editar Pessoa</h2>
            <button
              type="button"
              id="fecharEditarPessoa"
              class="btn-close"
              aria-label="Fechar"
            >
              ×
            </button>
          </header>

          <!-- Corpo -->
          <section class="modal-body">
            <form id="formEditarPessoa">

              <div class="form-group">
                <label for="editNome">Nome completo</label>
                <input
                  type="text"
                  id="editNome"
                  required
                />
              </div>

              <div class="form-group">
                <label for="editEmail">Email</label>
                <input
                  type="email"
                  id="editEmail"
                  placeholder="Opcional"
                />
              </div>

              <div class="form-group">
                <label for="editTelefone">Telefone</label>
                <input
                  type="tel"
                  id="editTelefone"
                  placeholder="Opcional"
                />
              </div>

              <div class="form-group">
                <label for="editTipo">Tipo</label>
                <select id="editTipo" required>
                  <option value="">Selecione</option>
                  <option value="aluno">Aluno</option>
                  <option value="professor">Professor</option>
                </select>
              </div>

              <footer class="modal-actions">
                <button
                  type="button"
                  id="cancelarEditarPessoa"
                  class="btn-secondary"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  class="btn-primary"
                >
                  Salvar alterações
                </button>
              </footer>

            </form>
          </section>
        </div>
      </div>

      <button id="logoutBtn" class="logout">Sair</button>
    </main>
  `;
}