import { requireAuth } from "./authGuard.js";
import { supabase } from "./supabaseClient.js";

document.addEventListener("DOMContentLoaded", async () => {
  // 🔐 1. Garante apenas que está logado
  const user = await requireAuth();
  if (!user) return;

  // 👤 2. Busca profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("pessoa_id")
    .eq("id", user.id)
    .single();

  if (profileError || !profile?.pessoa_id) {
    window.location.replace("/login");
    return;
  }

  // 🎯 3. Busca pessoa (regra de negócio)
  const { data: pessoa } = await supabase
    .from("pessoas")
    .select("tipo")
    .eq("id", profile.pessoa_id)
    .single();

  if (pessoa?.tipo !== "aluno") {
    // ❌ Não é aluno → não pode ficar aqui
    window.location.replace("/login.html");
    return;
  }

  // ✅ A partir daqui: código NORMAL da página do aluno
  console.log("✅ Aluno autorizado");
});

