create table if not exists public.admin_users (
  id text primary key,
  name text not null,
  email text not null unique,
  password_hash text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.reservations (
  id text primary key,
  destination text not null,
  experience text not null,
  travel_date text not null,
  flexible_dates text not null,
  duration text not null,
  guest_count integer not null,
  full_name text not null,
  email text not null,
  whatsapp text not null,
  country text not null,
  budget text not null,
  accommodation text not null,
  special_occasion text not null,
  notes text not null,
  preferred_contact text not null,
  status text not null default 'pending'
    check (status in ('pending', 'invoiced', 'paid', 'rejected')),
  submitted_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  archived_at timestamptz,
  archived_by_name text,
  archived_by_email text,
  status_note text,
  processed_by_name text,
  processed_by_email text,
  status_email_sent_at timestamptz,
  status_email_mode text
    check (status_email_mode in ('smtp', 'preview')),
  invoice_currency text,
  invoice_total numeric(12, 2),
  invoice_issued_at timestamptz,
  invoice_due_date text,
  invoice_items jsonb not null default '[]'::jsonb,
  invoice_note text,
  payment_confirmed_at timestamptz,
  payment_confirmed_by_name text,
  payment_confirmed_by_email text,
  payment_email_sent_at timestamptz,
  payment_email_mode text
    check (payment_email_mode in ('smtp', 'preview'))
);

create index if not exists reservations_submitted_at_idx
  on public.reservations (submitted_at desc);

create index if not exists reservations_status_idx
  on public.reservations (status);

create table if not exists public.monthly_visits (
  month_key text primary key,
  count integer not null default 0,
  updated_at timestamptz not null default timezone('utc', now())
);

create or replace function public.increment_monthly_visits(target_month_key text)
returns table (month_key text, count integer)
language plpgsql
as $$
begin
  insert into public.monthly_visits (month_key, count, updated_at)
  values (target_month_key, 1, timezone('utc', now()))
  on conflict (month_key)
  do update
    set count = public.monthly_visits.count + 1,
        updated_at = timezone('utc', now());

  return query
  select mv.month_key, mv.count
  from public.monthly_visits mv
  where mv.month_key = target_month_key;
end;
$$;
