import { supabase } from "../js/supabaseClient.js";

export function loginController() {
  console.log("🚀 loginController carregado (SPA)");

  const form = document.getElementById("loginForm");
  const feedback = document.getElementById("feedback");

  if (!form) {
    console.error("❌ Formulário não encontrado");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // ⚠️ IDs precisam existir na View
    const email = document.getElementById("email")?.value.trim();
    const password = document.getElementById("password")?.value.trim();

    if (!email || !password) {
      feedback.textContent = "Preencha todos os campos";
      return;
    }

    feedback.textContent = "Entrando...";

    try {
      // 1️⃣ Login Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        feedback.textContent = error.message;
        return;
      }

      const user = data.user;
      console.log("👤 USER:", user);

      // 2️⃣ Buscar profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role, pessoa_id")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        console.error(profileError);
        feedback.textContent = "Erro ao carregar perfil";
        return;
      }

      if (!profile) {
        feedback.textContent =
          "Conta criada, mas perfil ainda não disponível.";
        return;
      }

      // 3️⃣ ADMIN primeiro
      if (profile.role === "admin") {
        location.hash = "/admin"; // ✅ SPA route
        return;
      }

      // 4️⃣ Sem vínculo pessoa
      if (!profile.pessoa_id) {
        feedback.textContent =
          "Conta criada. Aguarde a secretaria liberar o acesso.";
        return;
      }

      // 5️⃣ Buscar tipo da pessoa
      const { data: pessoa, error: pessoaError } = await supabase
        .from("pessoas")
        .select("tipo")
        .eq("id", profile.pessoa_id)
        .maybeSingle();

      if (pessoaError || !pessoa) {
        feedback.textContent = "Erro ao carregar dados do usuário.";
        return;
      }

      const tipo = pessoa.tipo?.trim().toLowerCase();

      // 6️⃣ Redirecionamento SPA
      if (tipo === "aluno") {
        location.hash = "/aluno";
        return;
      }

      if (tipo === "professor") {
        location.hash = "/professor";
        return;
      }

      feedback.textContent =
        "Conta com configuração inválida. Contate o suporte.";
    } catch (err) {
      console.error("💥 ERRO:", err);
      feedback.textContent = "Erro inesperado ao realizar login";
    }
  });
}
