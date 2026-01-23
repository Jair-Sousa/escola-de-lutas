import { requireRole } from "./authGuard.js";
import { supabase } from "./supabaseClient.js";

const ok = await requireRole(["aluno"]);
if (!ok) return;

console.log("ALUNO AUTORIZADO");

const logoutBtn = document.getElementById("logoutBtn");
logoutBtn.addEventListener("click", async () => {
  await supabase.auth.signOut();
  window.location.replace("/login.html");
});
