-- =========================
-- TABELA: presencas
-- =========================
create table if not exists presencas (
  id uuid primary key default gen_random_uuid(),
  aluno_id uuid not null references profiles(id) on delete cascade,
  data date not null,
  created_at timestamp with time zone default now(),
  unique (aluno_id, data)
);

alter table presencas enable row level security;
