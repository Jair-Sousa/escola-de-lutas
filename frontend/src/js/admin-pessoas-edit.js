/**
 * admin-pessoas-edit.js
 *
 * Módulo responsável pela EDIÇÃO de dados da entidade "pessoas".
 *
 * Campos editáveis neste passo:
 * - nome_completo
 * - email
 * - telefone
 * - tipo (aluno | professor)
 *
 * ⚠️ NÃO:
 * - cria pessoa
 * - cria conta
 * - altera profiles
 * - altera modalidades
 */

import { supabase } from "./supabaseClient.js";

let pessoaIdAtual = null;
let onSuccessCallback = null;

// ======================================================
// 🚀 INICIALIZAÇÃO DO MÓDULO
// ======================================================

/**
 * Inicializa o módulo de edição.
 *
 * @param {Object} options
 * @param {Function} options.onSuccess
 *        Callback executado após edição bem-sucedida
 */
export function initEdicaoPessoa({ onSuccess }) {
  onSuccessCallback = onSuccess;

  const form = document.getElementById("formEditarPessoa");

  form.addEventListener("submit", handleSubmit);
}

// ======================================================
// 📥 CARREGAMENTO DE DADOS
// ======================================================

/**
 * Carrega os dados da pessoa selecionada
 * e preenche o formulário de edição.
 *
 * @param {string} pessoaId
 */
export async function loadPessoa(pessoaId) {
  pessoaIdAtual = pessoaId;

  const { data, error } = await supabase
    .from("pessoas")
    .select(`
      id,
      nome_completo,
      email,
      telefone,
      tipo
    `)
    .eq("id", pessoaId)
    .maybeSingle(); // sempre seguro

  if (error || !data) {
    alert("Erro ao carregar dados da pessoa.");
    console.error(error);
    return;
  }

  preencherFormulario(data);
}

/**
 * Preenche o formulário de edição
 * com os dados atuais da pessoa.
 */
function preencherFormulario(pessoa) {
  document.getElementById("editNome").value = pessoa.nome_completo;
  document.getElementById("editEmail").value = pessoa.email || "";
  document.getElementById("editTelefone").value = pessoa.telefone || "";
  document.getElementById("editTipo").value = pessoa.tipo;
}

// ======================================================
// 🧾 SUBMIT — EDIÇÃO
// ======================================================

/**
 * Handler do submit de edição.
 *
 * Executa apenas UPDATE em "pessoas".
 */
async function handleSubmit(e) {
  e.preventDefault();

  if (!pessoaIdAtual) {
    alert("Pessoa não identificada para edição.");
    return;
  }

  const nome = document.getElementById("editNome").value.trim();
  const email = document.getElementById("editEmail").value.trim();
  const telefone = document.getElementById("editTelefone").value.trim();
  const tipo = document.getElementById("editTipo").value;

  if (!nome || !tipo) {
    alert("Nome e tipo são obrigatórios.");
    return;
  }

  const { error } = await supabase
    .from("pessoas")
    .update({
      nome_completo: nome,
      email: email || null,
      telefone: telefone || null,
      tipo
    })
    .eq("id", pessoaIdAtual);

  if (error) {
    alert("Erro ao salvar alterações.");
    console.error(error);
    return;
  }

  // Sucesso
  pessoaIdAtual = null;

  if (typeof onSuccessCallback === "function") {
    onSuccessCallback();
  }
}
