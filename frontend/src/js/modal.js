// modal.js — Controle universal do modal

export function initModalEditarPessoa() {
  const modal = document.getElementById("editarPessoaModal");

  if (!modal) {
    console.warn("Modal não encontrado");
    return;
  }

  const btnX = document.getElementById("fecharEditarPessoa");
  const btnCancel = document.getElementById("cancelarEditarPessoa");
  const overlay = modal.querySelector(".modal-overlay");

  function fechar() {
    modal.classList.add("hidden");
  }

  function abrir() {
    modal.classList.remove("hidden");
  }

  // 🔥 força fechar sempre
  fechar();

  // Eventos com segurança
  btnX?.addEventListener("click", fechar);
  btnCancel?.addEventListener("click", fechar);
  overlay?.addEventListener("click", fechar);

  console.log("✅ Modal inicializado corretamente");

  return { abrir, fechar };
}

