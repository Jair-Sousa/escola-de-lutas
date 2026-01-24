import { requireRole } from "./authGuard.js";
import { supabase } from "./supabaseClient.js";
console.log("admin.js carregado");


document.addEventListener("DOMContentLoaded", async () => {
  await requireRole(["admin"]);

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      await supabase.auth.signOut();
      window.location.href = "/login.html";
    });
  }
});
