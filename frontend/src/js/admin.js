import { requireRole } from "./authGuard.js";
import { supabase } from "./supabaseClient.js";

document.addEventListener("DOMContentLoaded", async () => {
  await requireRole(["admin"]);

  const btnSair = document.getElementById("btnSair");
  if (btnSair) {
    btnSair.addEventListener("click", async () => {
      await supabase.auth.signOut();
      window.location.href = "/login.html";
    });
  }
});
