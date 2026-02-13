import { supabase } from "./supabaseClient.js";

console.log("🔥 authGuard carregado");


const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await supabase.auth.signOut();

    // 🚨 REDIRECIONA MANUALMENTE
    window.location.replace("/login");
  });
}
export async function requireAuth() {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    window.location.replace("/login");
    return null;
  }

  return user;
}

export async function requireAdmin() {
  const user = await requireAuth();
  if (!user) return false;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    window.location.replace("/login");
    return false;
  }

  return true;
}

// 🔐 LOGOUT GLOBAL
supabase.auth.onAuthStateChange((event) => {
  if (event === "SIGNED_OUT") {
    window.location.replace("/login");
  }
});
