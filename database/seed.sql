-- =========================
-- SEED: ROLES NO AUTH
-- =========================

-- Define role ADMIN
update auth.users
set raw_user_meta_data = jsonb_set(
  coalesce(raw_user_meta_data, '{}'),
  '{role}',
  '"admin"',
  true
)
where email = 'admin@gmail.com';

-- Define role PROFESSOR
update auth.users
set raw_user_meta_data = jsonb_set(
  coalesce(raw_user_meta_data, '{}'),
  '{role}',
  '"professor"',
  true
)
where email = 'professor@gmail.com';

-- =========================
-- SEED: PERFIL DE ALUNO (EXEMPLO)
-- =========================
-- O usuário PRECISA existir em auth.users

insert into profiles (id, name, role)
select id, 'Aluno Teste', 'aluno'
from auth.users
where email = 'aluno@gmail.com';
