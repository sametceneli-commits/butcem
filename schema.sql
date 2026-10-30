-- Supabase SQL Editor'de bir kez çalıştır.
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('income','expense')),
  amount numeric(12,2) not null check (amount > 0),
  category text not null,
  occurred_on date not null,
  payment_method text not null default 'cash' check (payment_method in ('cash','card')),
  card_name text,
  description text,
  created_at timestamptz not null default now()
);
create table if not exists public.recurring_payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  amount numeric(12,2) not null check (amount > 0),
  day_of_month int not null check (day_of_month between 1 and 31),
  category text not null,
  created_at timestamptz not null default now()
);
alter table public.transactions enable row level security;
alter table public.recurring_payments enable row level security;
create policy "Users manage own transactions" on public.transactions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage own recurring payments" on public.recurring_payments
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
