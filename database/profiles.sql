-- =========================
-- RLS: profiles
-- =========================

alter table profiles enable row level security;

-- Qualquer usuário autenticado pode ler profiles
create policy "profiles_select_authenticated"
on profiles
for select
using (
  auth.uid() is not null
);

-- =========================
-- RLS: presencas
-- =========================

alter table presencas enable row level security;

-- Professor e admin podem gerenciar presenças
create policy "presencas_manage_professor_admin"
on presencas
for all
using (
  auth.jwt() ->> 'role' in ('professor', 'admin')
);

-- Aluno pode ver apenas suas próprias presenças
create policy "presencas_select_aluno"
on presencas
for select
using (
  aluno_id = auth.uid()
);
