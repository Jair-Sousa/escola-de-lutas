import { supabase } from "../services/supabaseClient.js";

export function adminController() {
  console.log("✅ AdminController carregado!");

  // ======================================================
  // 🔥 SEÇÕES
  // ======================================================
  const dashboard = document.getElementById("dashboardSection");
  const preCadastro = document.getElementById("preCadastroSection");
  const listaPessoas = document.getElementById("listaPessoasSection");
  const presencas = document.getElementById("presencasSection");

  // ======================================================
  // 🔥 BOTÕES PRINCIPAIS
  // ======================================================
  const pessoasBtn = document.getElementById("pessoasBtn");
  const presencasBtn = document.getElementById("presencasBtn");
  const voltarBtn = document.getElementById("voltarPainelBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  // ======================================================
  // 🔥 TABELA
  // ======================================================
  const pessoasTableBody = document.getElementById("pessoasTableBody");

  // ======================================================
  // 🔥 MODAL EDITAR
  // ======================================================
  const editarModal = document.getElementById("editarPessoaModal");
  const formEditarPessoa = document.getElementById("formEditarPessoa");

  const fecharModalBtn = document.getElementById("fecharEditarPessoa");
  const cancelarModalBtn = document.getElementById("cancelarEditarPessoa");

  // ======================================================
  // ✅ ESCONDER TODAS AS TELAS
  // ======================================================
  function esconderTudo() {
    dashboard.style.display = "none";
    preCadastro.style.display = "none";
    listaPessoas.style.display = "none";
    presencas.style.display = "none";
  }

  // ======================================================
  // ✅ FECHAR MODAL
  // ======================================================
  function fecharModal() {
    editarModal.classList.add("hidden");
  }

  fecharModalBtn.onclick = fecharModal;
  cancelarModalBtn.onclick = fecharModal;

  // ======================================================
  // ✅ LISTAR PESSOAS
  // ======================================================
  async function carregarPessoas() {
    const { data, error } = await supabase
      .from("pessoas")
      .select(`
        *,
        pessoas_modalidades (
          modalidade,
          faixa
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ Erro ao carregar pessoas:", error);
      return;
    }

    pessoasTableBody.innerHTML = "";

    // ======================================================
    // ✅ ESTADO VAZIO
    // ======================================================
    if (data.length === 0) {
      pessoasTableBody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align:center;">
            Nenhuma pessoa cadastrada ainda.
          </td>
        </tr>
      `;
      return;
    }

    // ======================================================
    // ✅ RENDER DA TABELA (com data-label para Mobile UX)
    // ======================================================
    data.forEach((pessoa) => {
      // Modalidades formatadas
      const modalidadesTexto =
        pessoa.pessoas_modalidades.length > 0
          ? pessoa.pessoas_modalidades
              .map((m) => `${m.modalidade} (${m.faixa})`)
              .join(", ")
          : "-";

      // ✅ Apenas melhoria visual: data-label nos <td>
      pessoasTableBody.innerHTML += `
        <tr>
          <td data-label="Nome">${pessoa.nome_completo}</td>

          <td data-label="Tipo">${pessoa.tipo}</td>

          <td data-label="Modalidades">${modalidadesTexto}</td>

          <td data-label="Status">Ativo</td>

          <td data-label="Ações">
            <button class="btn-editar" data-id="${pessoa.id}">
              Editar
            </button>
          </td>
        </tr>
      `;
    });

    // ======================================================
    // ✅ ATIVAR BOTÕES EDITAR
    // ======================================================
    document.querySelectorAll(".btn-editar").forEach((btn) => {
      btn.onclick = () => abrirModalEditar(btn.dataset.id);
    });
  }

  // ======================================================
  // ✅ ABRIR MODAL EDITAR
  // ======================================================
  async function abrirModalEditar(id) {
    editarModal.classList.remove("hidden");

    const { data, error } = await supabase
      .from("pessoas")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Erro ao buscar pessoa:", error);
      return;
    }

    // preencher modal
    document.getElementById("editNome").value = data.nome_completo;
    document.getElementById("editEmail").value = data.email || "";
    document.getElementById("editTelefone").value = data.telefone || "";
    document.getElementById("editTipo").value = data.tipo;

    // guardar id no modal
    editarModal.dataset.id = id;
  }

  // ======================================================
  // ✅ SALVAR ALTERAÇÕES MODAL
  // ======================================================
  formEditarPessoa.onsubmit = async (e) => {
    e.preventDefault();

    const id = editarModal.dataset.id;

    const { error } = await supabase
      .from("pessoas")
      .update({
        nome_completo: document.getElementById("editNome").value,
        email: document.getElementById("editEmail").value,
        telefone: document.getElementById("editTelefone").value,
        tipo: document.getElementById("editTipo").value,
      })
      .eq("id", id);

    if (error) {
      alert("Erro ao atualizar pessoa!");
      console.error(error);
      return;
    }

    alert("✅ Pessoa atualizada!");

    fecharModal();
    carregarPessoas();
  };

  // ======================================================
  // ✅ ATIVAR FORMULÁRIO DE CADASTRO
  // ======================================================
  function ativarFormularioPessoa() {
    const formPessoa = document.getElementById("formPessoa");

    formPessoa.onsubmit = async (e) => {
      e.preventDefault();

      // Dados principais
      const novaPessoa = {
        nome_completo: document.getElementById("nome").value,
        data_nascimento: document.getElementById("dataNascimento").value,
        email: document.getElementById("email").value || null,
        telefone: document.getElementById("telefone").value || null,
        tipo: document.getElementById("tipo").value,
      };

      // Inserir pessoa
      const { data, error } = await supabase
        .from("pessoas")
        .insert([novaPessoa])
        .select()
        .single();

      if (error) {
        alert("Erro ao cadastrar pessoa!");
        console.error(error);
        return;
      }

      const pessoaId = data.id;

      // ======================================================
      // ✅ SALVAR MODALIDADES
      // ======================================================
      const modalidadesSelecionadas = [];

      document
        .querySelectorAll("fieldset input[type='checkbox']")
        .forEach((check) => {
          if (check.checked) {
            const modalidade = check.value;

            const faixaSelect = document.querySelector(
              `select[data-faixa="${modalidade}"]`
            );

            modalidadesSelecionadas.push({
              pessoa_id: pessoaId,
              modalidade: modalidade,
              faixa: faixaSelect.value,
              ativa: true,
            });
          }
        });

      if (modalidadesSelecionadas.length > 0) {
        const { error: modError } = await supabase
          .from("pessoas_modalidades")
          .insert(modalidadesSelecionadas);

        if (modError) {
          console.error("Erro ao salvar modalidades:", modError);
        }
      }

      alert("✅ Pessoa cadastrada com modalidades!");

      formPessoa.reset();
      carregarPessoas();
    };
  }

  // ======================================================
  // 🔥 BOTÃO: PESSOAS
  // ======================================================
  pessoasBtn.onclick = () => {
    esconderTudo();

    preCadastro.style.display = "block";
    listaPessoas.style.display = "block";
    voltarBtn.style.display = "block";

    ativarFormularioPessoa();
    carregarPessoas();
  };

  // ======================================================
  // 🔥 BOTÃO: PRESENÇAS
  // ======================================================
  presencasBtn.onclick = () => {
    esconderTudo();

    presencas.style.display = "block";
    voltarBtn.style.display = "block";
  };

  // ======================================================
  // 🔥 BOTÃO: VOLTAR
  // ======================================================
  voltarBtn.onclick = () => {
    esconderTudo();

    dashboard.style.display = "block";
    voltarBtn.style.display = "none";
  };

  // ======================================================
  // 🔥 LOGOUT
  // ======================================================
  logoutBtn.onclick = async () => {
    await supabase.auth.signOut();
    location.hash = "/login";
  };
}
