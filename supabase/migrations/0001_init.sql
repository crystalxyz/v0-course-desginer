-- Course Designer schema. Paste into the Supabase SQL editor.
-- Run once after creating a fresh project. Idempotent (safe to re-run).

-- profiles is a 1:1 mirror of auth.users for easier joins / RLS policies.
create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  email text,
  display_name text,
  created_at timestamptz default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create table if not exists courses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  title text not null,
  level text,
  weeks int,
  hours_per_week int,
  student_background text,
  prerequisite_tags text[] default '{}',
  learning_outcomes text,
  assessment_style text,
  template_source text,                   -- 'calculus' | 'ml-systems' | null
  selected_path_id text,                  -- chosen optimizer path
  status text default 'draft',            -- draft | in-progress | finished
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_courses_user on courses(user_id);

create table if not exists course_materials (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references courses(id) on delete cascade,
  name text,
  size text,
  tag text,
  pinned_week int,
  extracted_concepts text[] default '{}',
  status text
);

create index if not exists idx_course_materials_course on course_materials(course_id);

create table if not exists course_plans (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references courses(id) on delete cascade,
  weeks_json jsonb,
  concept_graph_json jsonb,
  outcome_coverage_json jsonb,
  gap_warnings_json jsonb,
  learning_paths_json jsonb,
  generated_at timestamptz default now()
);

create index if not exists idx_course_plans_course on course_plans(course_id);

-- Row-level security: each user sees only their own data.
alter table profiles enable row level security;
alter table courses enable row level security;
alter table course_materials enable row level security;
alter table course_plans enable row level security;

drop policy if exists "own profile read" on profiles;
create policy "own profile read" on profiles for select using (auth.uid() = id);
drop policy if exists "own profile update" on profiles;
create policy "own profile update" on profiles for update using (auth.uid() = id);

drop policy if exists "own courses" on courses;
create policy "own courses" on courses for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own course materials" on course_materials;
create policy "own course materials" on course_materials for all using (
  exists (select 1 from courses c where c.id = course_id and c.user_id = auth.uid())
) with check (
  exists (select 1 from courses c where c.id = course_id and c.user_id = auth.uid())
);

drop policy if exists "own course plans" on course_plans;
create policy "own course plans" on course_plans for all using (
  exists (select 1 from courses c where c.id = course_id and c.user_id = auth.uid())
) with check (
  exists (select 1 from courses c where c.id = course_id and c.user_id = auth.uid())
);
