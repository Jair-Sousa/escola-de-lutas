import { loginController } from "../controllers/loginController.js";

export default function LoginView() {
  // chama o controller depois que a view entrar na tela
  setTimeout(() => loginController(), 0);

  return `
  
  <main class="login-container">
    <img src="/logo-luta-livre-yellow.png" alt="Logo Academia" class="logo">

    <h2>Área de Membros</h2>

    <form id="loginForm">
      <input type="email" id="email" placeholder="Email" required />
      <input type="password" id="password" placeholder="Senha" required />

      <button type="submit">Entrar</button>
    </form>

    <p class="toggle">Não tem conta?
      <a href="#/signup">Criar conta</a>
    </p>

    <p id="feedback"></p>
  </main>
  `;
}