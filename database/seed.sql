-- =========================
-- PROMOÇÕES MANUAIS
-- =========================

-- Promover usuário a ADMIN
update profiles
set role = 'admin'
where id = (
  select id
  from auth.users
  where email = 'jairdomma@gmail.com'
);

-- Promover usuário a PROFESSOR
update profiles
set role = 'professor'
where id = (
  select id
  from auth.users
  where email = 'professor@gmail.com'
);
