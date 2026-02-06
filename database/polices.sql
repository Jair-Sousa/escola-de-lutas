-- =========================
-- PROFILES
-- =========================

-- Usuário pode ler o próprio perfil
create policy "profiles_select_own"
on profiles
for select
using (
  auth.uid() = id
);

-- Usuário pode atualizar o próprio perfil
create policy "profiles_update_own"
on profiles
for update
using (
  auth.uid() = id
);

-- =========================
-- PRESENCAS
-- =========================

-- Professor e Admin podem gerenciar presenças
create policy "presencas_manage_staff"
on presencas
for all
using (
  exists (
    select 1
    from profiles p
    where p.id = auth.uid()
    and p.role in ('professor', 'admin')
  )
);

-- Aluno pode ver suas próprias presenças
create policy "presencas_select_own"
on presencas
for select
using (
  aluno_id = auth.uid()
);
