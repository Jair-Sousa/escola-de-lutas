import { signupController } from "../controllers/signupController.js";

export default function SignupView() {
  setTimeout(() => signupController(), 0);

  return `
    <main class="signup-container">

      <img src="/logo-luta-livre-yellow.png" alt="Logo Academia" class="logo" />

      <h2>Criar conta</h2>

      <form id="signupForm">

        <input
          type="text"
          id="name"
          placeholder="Nome completo"
          required
        />

        <input
          type="email"
          id="email"
          placeholder="Email"
          required
        />

        <input
          type="password"
          id="password"
          placeholder="Senha"
          required
        />

        <button type="submit">Cadastrar</button>

        <p id="message"></p>

      </form>

      <p class="toggle">
        Já tem conta?
        <a href="#/login">Fazer login</a>
      </p>

    </main>
  `;
}
