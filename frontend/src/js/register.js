const registerForm = document.getElementById("registerForm");
const message = document.getElementById("message");

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const role = document.querySelector('input[name="role"]:checked')?.value;

  if (!name || !email || !password || !role) {
    message.textContent = "Preencha todos os campos.";
    message.style.color = "red";
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password, role }),
    });

    const data = await response.json();

    if (!response.ok) {
      message.textContent = data.error || "Erro ao cadastrar.";
      message.style.color = "red";
      return;
    }

    message.textContent = "Conta criada com sucesso! Redirecionando...";
    message.style.color = "green";

    setTimeout(() => {
      window.location.href = "login.html";
    }, 1500);

  } catch (error) {
    console.error("Erro no cadastro:", error);
    message.textContent = "Erro ao conectar com o servidor.";
    message.style.color = "red";
  }
});
