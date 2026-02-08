import HomeView from "../views/HomeView.js";
import LoginView from "../views/LoginView.js";
import AdminView from "../views/AdminView.js";
import AlunoView from "../views/AlunoView.js";
import ProfessorView from "../views/ProfessorView.js";
import SignupView from "../views/SignupView.js";

const routes = {
  "/": HomeView,
  "/login": LoginView,
  "/signup": SignupView,
  "/admin": AdminView,
  "/professor": ProfessorView,
  "/aluno": AlunoView,
};

export function router() {
  const path = location.hash.replace("#", "") || "/";
  const view = routes[path];

  document.getElementById("app").innerHTML = view();
}
