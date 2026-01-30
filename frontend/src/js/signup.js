import { supabase } from "./supabaseClient.js";

const signupForm = document.getElementById("signupForm");
const message = document.getElementById("message");

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim().toLowerCase();
  const password = document.getElementById("password").value.trim();

  if (!name || !email || !password) {
    showMessage("Preencha todos os campos.", "red");
    return;
  }

  try {
    // 🔐 Cria usuário no Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name       // será usado pela trigger
        }
      }
    });
    console.log("SIGNUP RESULT:", data, error);

    if (!data.user) {
      showMessage("Conta criada! Verifique seu email.", "green");
      return;
    }

    showMessage(
      "Conta criada! Verifique seu email para confirmar o cadastro.",
      "green"
    );

    setTimeout(() => {
      window.location.href = "/login.html";
    }, 2500);

  } catch (err) {
    console.error("ERRO SIGNUP:", err);
    showMessage("Erro inesperado.", "red");
  }
});

function showMessage(text, color) {
  message.textContent = text;
  message.style.color = color;
}
