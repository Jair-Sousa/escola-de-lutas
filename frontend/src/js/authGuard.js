// src/js/authGuard.js
import { supabase } from './supabaseClient.js';

console.log('🔥 authGuard carregado');

export async function requireRole(allowedRoles) {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session || !session.user) {
    return false;
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();

  if (error || !profile) {
    return false;
  }

  return allowedRoles.includes(profile.role);
}

// 🔐 listener GLOBAL de logout
supabase.auth.onAuthStateChange((event) => {
  console.log('🧠 AUTH EVENT:', event);

  if (event === 'SIGNED_OUT') {
    window.location.replace('/login.html');
  }
});
