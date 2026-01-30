// =======================================================
// LOGIN.JS
// -------------------------------------------------------
// Responsabilidades:
// - Autenticar usuário via Supabase Auth
// - Vincular automaticamente o usuário a uma Pessoa (se existir)
// - Decidir a tela correta com base em:
//   1) profiles.role  -> controle técnico (admin)
//   2) pessoas.tipo   -> regra de negócio (aluno | professor)
// -------------------------------------------------------
// IMPORTANTE:
// ❌ NÃO alteramos profiles.role aqui
// ❌ NÃO brigamos com trigger do Supabase
// ✅ pessoas.tipo define a experiência do usuário
// =======================================================

import { supabase } from "./supabaseClient.js";
import { requireAuth } from "./authGuard.js";

console.log("🚀 LOGIN.JS CARREGADO");

// =======================================================
// ELEMENTOS DO DOM
// =======================================================
const form = document.getElementById("loginForm");
const feedback = document.getElementById("feedback");

// =======================================================
// FUNÇÃO: VINCULAR USUÁRIO AUTENTICADO À PESSOA (SE EXISTIR)
// =======================================================
// - Busca pessoa pelo e-mail
// - Se existir, vincula em profiles.pessoa_id
// - NÃO altera role (trigger do Supabase cuida disso)
// =======================================================
async function vincularPessoaAoUsuario(user) {
  console.log("🔗 Tentando vincular pessoa ao usuário...");

  // 1️⃣ Busca profile atual
  const { data: profile } = await supabase
    .from("profiles")
    .select("pessoa_id")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.pessoa_id) {
    console.log("ℹ️ Usuário já está vinculado a uma pessoa");
    return;
  }

  // 2️⃣ Busca pessoa pelo email
  const email = user.email.trim().toLowerCase();
  const { data: pessoa, error } = await supabase
    .from("pessoas")
    .select("id")
    .not("email", "is", null)
    .eq("email", email)
    .maybeSingle();

  console.log("👤 Pessoa encontrada:", pessoa, error);

  if (!pessoa) {
    feedback.textContent =
      "Aluno não encontrado. Procure a secretaria.";
    return;
  }

  // 3️⃣ Vincula somente se necessário
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ pessoa_id: pessoa.id })
    .eq("id", user.id);

  if (updateError) {
    console.error("❌ Erro ao vincular pessoa:", updateError);
    return;
  }

  console.log("✅ Pessoa vinculada com sucesso");
}


// =======================================================
// SUBMIT DO FORMULÁRIO DE LOGIN
// =======================================================
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("🔥 SUBMIT FUNCIONOU");

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

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

      console.log("🔐 RESULTADO LOGIN:", data, error);

      if (error) {
        feedback.textContent = error.message;
        return;
      }

      const user = data.user;
      console.log("👤 USER LOGADO:", user);

      // ===================================================
      // 2️⃣ VÍNCULO AUTOMÁTICO COM PESSOA (SE EXISTIR)
      // ===================================================
      await vincularPessoaAoUsuario(user);

      // ===================================================
      // 3️⃣ BUSCAR PROFILE (CONTROLE TÉCNICO)
      // ===================================================
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role, pessoa_id")
        .eq("id", user.id)
        .single();

      console.log("🧭 PROFILE:", profile, profileError);

      if (profileError || !profile) {
        feedback.textContent = "Erro ao carregar perfil do usuário";
        return;
      }

      // ===================================================
      // 4️⃣ PRIORIDADE: ADMIN
      // ===================================================
      if (profile.role === "admin") {
        window.location.replace("/pages/admin.html");
        return;
      }

// ===================================================
// 5️⃣ REGRA DE NEGÓCIO: PESSOA (aluno | professor)
// ===================================================
    if (profile.pessoa_id) {
    const { data: pessoa, error: pessoaError } = await supabase
      .from("pessoas")
      .select("tipo")
      .eq("id", profile.pessoa_id)
      .single();

      console.log("🎯 PESSOA RAW:", pessoa);

      const tipo = pessoa?.tipo?.trim().toLowerCase();

      if (!tipo) {
        feedback.textContent =
          "Conta sem tipo definido. Contate o suporte.";
        return;
      }

      if (tipo === "professor") {
        window.location.replace("/pages/professor.html");
        return;
      }

      if (tipo === "aluno") {
        window.location.replace("/pages/aluno.html");
        return;
      }

      console.warn("⚠️ Tipo inválido:", tipo);
      feedback.textContent =
        "Conta com configuração inválida. Contate o suporte.";
      return;
    }


    } catch (err) {
      console.error("💥 ERRO NÃO TRATADO:", err);
      feedback.textContent = "Erro inesperado ao realizar login";
    }
  });
}
