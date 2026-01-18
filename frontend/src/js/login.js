
// ==========================
// ELEMENTOS
// ==========================
const form = document.getElementById("loginForm");
const feedback = document.getElementById("feedback");

// ==========================
// SUBMIT LOGIN
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

    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        feedback.textContent = data.error || "Erro ao autenticar";
        return;
      }

      // ==========================
      // NORMALIZA ROLE (BACKEND ENVIA EM MAIÚSCULO)
      // ==========================
      const role = data.role?.toLowerCase();

      if (!role) {
        feedback.textContent = "Perfil não encontrado";
        return;
      }

      // ==========================
      // SALVA SESSÃO
      // ==========================
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("role", role);

      // ==========================
      // REDIRECIONA POR ROLE
      // ==========================
      if (role === "admin") {
        window.location.href = "pages/admin.html";
        return;
      }

      if (role === "professor") {
        window.location.href = "pages/professor.html";
        return;
      }

      if (role === "aluno") {
        window.location.href = "pages/aluno.html";
        return;
      }

      // ==========================
      // FALLBACK DE SEGURANÇA
      // ==========================
      feedback.textContent = "Perfil inválido";

    } catch (error) {
      console.error("Erro no login:", error);
      feedback.textContent = "Erro ao conectar com a API";
    }
  });
}
