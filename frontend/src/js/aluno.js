import '/src/js/authGuard.js';
import { requireRole } from '/src/js/authGuard.js';
import { supabase } from '/src/js/supabaseClient.js';

async function init() {
  const ok = await requireRole(['aluno']);

  if (!ok) {
    window.location.replace('/login.html');
    return;
  }

  console.log('ALUNO AUTORIZADO');

  const logoutBtn = document.getElementById('logoutBtn');

  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      await supabase.auth.signOut();
      // NÃO redireciona aqui
      // authGuard.onAuthStateChange tratará SIGNED_OUT
    });
  }
}

init();
