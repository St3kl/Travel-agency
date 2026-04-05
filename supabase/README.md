# Supabase Setup

1. Create a Supabase project.
2. Open the SQL editor and run [`schema.sql`](./schema.sql).
3. Add these variables to `.env.local` and to Vercel:

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

4. Create the first admin user:

```bash
npm run admin:create-user -- "Your Name" "you@example.com" "StrongPassword123!"
```

## What moved to Supabase

- `admin_users`
- `reservations`
- `monthly_visits`

## Important

- `SUPABASE_SERVICE_ROLE_KEY` must stay server-side only.
- Do not expose it in client components or public environment variables.
