create table if not exists public.snippets (
  id text primary key,
  title text not null check (char_length(title) between 1 and 90),
  language text not null,
  code text not null,
  upvotes integer not null default 0 check (upvotes >= 0),
  "createdAt" timestamptz not null default now()
);

alter table public.snippets enable row level security;

drop policy if exists "Snippets are readable by everyone" on public.snippets;
create policy "Snippets are readable by everyone"
on public.snippets
for select
to anon, authenticated
using (true);

drop policy if exists "Anyone can create snippets" on public.snippets;
create policy "Anyone can create snippets"
on public.snippets
for insert
to anon, authenticated
with check (
  char_length(title) between 1 and 90
  and char_length(code) > 0
  and upvotes = 0
);

create or replace function public.increment_snippet_upvotes(snippet_id text)
returns public.snippets
language plpgsql
security definer
set search_path = public
as $$
declare
  updated_snippet public.snippets;
begin
  update public.snippets
  set upvotes = upvotes + 1
  where id = snippet_id
  returning * into updated_snippet;

  return updated_snippet;
end;
$$;

grant execute on function public.increment_snippet_upvotes(text) to anon, authenticated;

create index if not exists snippets_upvotes_created_idx
on public.snippets (upvotes desc, "createdAt" desc);

alter publication supabase_realtime add table public.snippets;
