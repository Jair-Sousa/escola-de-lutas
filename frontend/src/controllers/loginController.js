import { supabase } from "../services/supabaseClient.js";

export function loginController() {
  console.log("🚀 loginController carregado (SPA)");

  const form = document.getElementById("loginForm");
  const feedback = document.getElementById("feedback");

  if (!form) {
    console.error("❌ Formulário não encontrado");
    return;
  }

  // ======================================================
  // ✅ Espera automática pelo profile (trigger pode demorar)
  // ======================================================
  async function esperarProfile(userId) {
    for (let i = 0; i < 5; i++) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role, pessoa_id")
        .eq("id", userId)
        .maybeSingle();

      if (profile) return profile;

      console.log("⏳ aguardando profile ser criado...");
      await new Promise((r) => setTimeout(r, 1000));
    }

    return null;
  }

  // ======================================================
  // ✅ SUBMIT LOGIN
  // ======================================================
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

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

      // ======================================================
      // 2️⃣ Buscar profile (com espera automática SPA)
      // ======================================================
      feedback.textContent = "Validando acesso...";

      const profile = await esperarProfile(user.id);

      if (!profile) {
        feedback.textContent =
          "Conta criada, mas perfil ainda não disponível. Aguarde alguns instantes.";
        return;
      }

      console.log("✅ PROFILE:", profile);

      // ======================================================
      // 3️⃣ ADMIN primeiro
      // ======================================================
      if (profile.role === "admin") {
        location.hash = "/admin";
        return;
      }

      // ======================================================
      // 4️⃣ Sem vínculo pessoa → liberação automática por email
      // ======================================================
      if (!profile.pessoa_id) {
        feedback.textContent = "🔍 Verificando liberação automática...";

        // buscar pessoa cadastrada com mesmo email
        const { data: pessoaAuto, error: autoError } = await supabase
          .from("pessoas")
          .select("id, tipo")
          .eq("email", email)
          .maybeSingle();

        if (autoError) {
          console.error(autoError);
          feedback.textContent = "Erro ao verificar liberação automática.";
          return;
        }

        // se encontrou pessoa → vincular automaticamente
        if (pessoaAuto) {
          console.log("✅ Pessoa encontrada, liberando acesso...");

          await supabase
            .from("profiles")
            .update({ pessoa_id: pessoaAuto.id })
            .eq("id", user.id);

          const tipoAuto = pessoaAuto.tipo?.trim().toLowerCase();

          feedback.textContent = "✅ Acesso liberado automaticamente!";

          if (tipoAuto === "aluno") {
            location.hash = "/aluno";
            return;
          }

          if (tipoAuto === "professor") {
            location.hash = "/professor";
            return;
          }
        }

        // se não encontrou → continua bloqueado
        feedback.textContent =
          "Conta criada. Aguarde a secretaria liberar o acesso.";
        return;
      }

      // ======================================================
      // 5️⃣ Buscar tipo da pessoa (fluxo normal)
      // ======================================================
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

      // ======================================================
      // 6️⃣ Redirecionamento SPA
      // ======================================================
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
