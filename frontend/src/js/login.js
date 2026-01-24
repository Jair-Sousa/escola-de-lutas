import { supabase } from "./supabaseClient.js";

// ==========================
// ELEMENTOS
// ==========================
const form = document.getElementById("loginForm");
const feedback = document.getElementById("feedback");

// ==========================
// SUBMIT LOGIN (SUPABASE)
// ==========================
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      feedback.textContent = "Preencha todos os campos";
      return;
    }

    feedback.textContent = "Entrando...";

    // 🔐 LOGIN
    const {data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error("LOGIN ERROR:", error);
      feedback.textContent = error.message;
      return;
    }

    // ==========================
    // BUSCA PROFILE (ROLE)
    // ==========================
    const userId = data.user.id;

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();
      console.log("ROLE VINDO DO BANCO:", profile.role);


    if (profileError || !profile?.role) {
      console.error("PROFILE ERROR:", profileError);
      feedback.textContent = "Erro ao carregar perfil do usuário";
      return;
    }

    // ==========================
    // REDIRECIONAMENTO POR ROLE
    // ==========================
    switch (profile.role) {
      case "admin":
        window.location.replace("/pages/admin.html");
        break;

      case "professor":
        window.location.replace("/pages/professor.html");
        break;

      default:
        window.location.replace("/pages/aluno.html");
    }
  });
}
