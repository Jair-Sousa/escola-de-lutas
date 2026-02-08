import { supabase } from "../js/supabaseClient.js";

export function signupController() {
  console.log("🚀 signupController carregado");

  const form = document.getElementById("signupForm");
  const message = document.getElementById("message");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!name || !email || !password) {
      message.textContent = "Preencha todos os campos.";
      return;
    }

    message.textContent = "Criando conta...";

    // 1️⃣ Criar usuário no Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      message.textContent = error.message;
      return;
    }

    console.log("✅ Usuário criado:", data);

    message.textContent =
      "Conta criada com sucesso! Aguarde liberação da secretaria.";

    // 2️⃣ Redirecionar para login após alguns segundos
    setTimeout(() => {
      location.hash = "/login";
    }, 2000);
  });
}
