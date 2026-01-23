import { supabase } from "./supabaseClient.js";

export async function requireRole(allowedRoles = []) {
  // 1️⃣ Aguarda o Supabase terminar de restaurar a sessão
  const user = await waitForInitialSession();

  if (!user) {
    window.location.replace("/login.html");
    return false;
  }

  // 2️⃣ Busca role
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (error || !allowedRoles.includes(profile.role)) {
    window.location.replace("/login.html");
    return false;
  }

  return true;
}

// 🔑 FUNÇÃO CRÍTICA
function waitForInitialSession() {
  return new Promise((resolve) => {
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "INITIAL_SESSION") {
        subscription.unsubscribe();
        resolve(session?.user ?? null);
      }
    });
  });
}
