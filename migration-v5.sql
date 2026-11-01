-- Supabase SQL Editor'de bir kez çalıştır.
-- Tekrarlayan ödeme kaynaklı giderleri takip eder ve aynı ayda mükerrer eklemeyi engeller.
alter table public.transactions
  add column if not exists recurring_payment_id uuid references public.recurring_payments(id) on delete set null,
  add column if not exists recurring_month text;

create unique index if not exists transactions_recurring_payment_month_unique
  on public.transactions (user_id, recurring_payment_id, recurring_month)
  where recurring_payment_id is not null and recurring_month is not null;
