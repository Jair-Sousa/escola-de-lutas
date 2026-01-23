drop policy if exists "Users can view own profile" on profiles;
drop policy if exists "Professor and Admin can view profiles" on profiles;

create policy "Profiles select access"
on profiles
for select
using (
  auth.jwt() ->> 'role' in ('professor', 'admin')
  OR auth.uid() = id
);
