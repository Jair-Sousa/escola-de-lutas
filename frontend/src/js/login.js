// =======================================================
// LOGIN.JS
// -------------------------------------------------------
// Responsabilidades:
// - Autenticar usuário via Supabase Auth
// - Ler profiles (controle técnico)
// - Decidir a tela correta com base em:
//   1) profiles.role   -> admin
//   2) pessoas.tipo    -> aluno | professor
//
// IMPORTANTE:
// ❌ Login NÃO cria nem vincula pessoa
// ❌ Login NÃO altera profiles.role
// ✅ Vínculo pessoa_id é responsabilidade do ADMIN
// =======================================================

import { supabase } from "./supabaseClient.js";

console.log("🚀 LOGIN.JS CARREGADO — VERSÃO FINAL");

// =======================================================
// ELEMENTOS DO DOM
// =======================================================
const form = document.getElementById("loginForm");
const feedback = document.getElementById("feedback");

if (!form) {
  console.error("❌ Formulário de login não encontrado");
}

// =======================================================
// SUBMIT DO LOGIN
// =======================================================
form?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email")?.value.trim();
  const password = document.getElementById("password")?.value.trim();

  if (!email || !password) {
    feedback.textContent = "Preencha todos os campos";
    return;
  }

  feedback.textContent = "Entrando...";

  try {
    // ===================================================
    // 1️⃣ LOGIN VIA SUPABASE AUTH
    // ===================================================
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      feedback.textContent = error.message;
      return;
    }

    const user = data.user;
    console.log("👤 USER LOGADO:", user);

    // ===================================================
    // 2️⃣ BUSCAR PROFILE (CONTROLE TÉCNICO)
    // ⚠️ maybeSingle evita erro 500 com RLS
    // ===================================================
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role, pessoa_id")
      .eq("id", user.id)
      .maybeSingle();

    console.log("🧭 PROFILE:", profile, profileError);

    if (profileError) {
      console.error("Erro ao buscar profile:", profileError);
      feedback.textContent = "Erro ao carregar perfil do usuário";
      return;
    }

    if (!profile) {
      feedback.textContent =
        "Conta criada, mas perfil ainda não disponível. Contate a secretaria.";
      return;
    }

    // ===================================================
    // 3️⃣ PRIORIDADE: ADMIN
    // ===================================================
    if (profile.role === "admin") {
      window.location.replace("/pages/admin.html");
      return;
    }

    // ===================================================
    // 4️⃣ CONTA SEM VÍNCULO COM PESSOA
    // ===================================================
    if (!profile.pessoa_id) {
      feedback.textContent =
        "Conta criada. Aguarde a secretaria liberar o acesso.";
      return;
    }

    // ===================================================
    // 5️⃣ REGRA DE NEGÓCIO (PESSOA)
    // ===================================================
    const { data: pessoa, error: pessoaError } = await supabase
      .from("pessoas")
      .select("tipo")
      .eq("id", profile.pessoa_id)
      .maybeSingle();

    console.log("🎯 PESSOA:", pessoa, pessoaError);

    if (pessoaError || !pessoa) {
      feedback.textContent =
        "Erro ao carregar dados do usuário. Contate o suporte.";
      return;
    }

    const tipo = pessoa.tipo?.trim().toLowerCase();

    if (tipo === "aluno") {
      window.location.replace("/pages/aluno.html");
      return;
    }

    if (tipo === "professor") {
      window.location.replace("/pages/professor.html");
      return;
    }

    feedback.textContent =
      "Conta com configuração inválida. Contate o suporte.";
  } catch (err) {
    console.error("💥 ERRO NÃO TRATADO:", err);
    feedback.textContent = "Erro inesperado ao realizar login";
  }
});
