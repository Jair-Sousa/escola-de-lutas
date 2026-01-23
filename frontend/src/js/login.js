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
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error("LOGIN ERROR:", error);
      feedback.textContent = error.message;
      return;
    }

    // ✅ LOGIN OK → REDIRECIONA
    window.location.href = "/pages/aluno.html";
  });
}
