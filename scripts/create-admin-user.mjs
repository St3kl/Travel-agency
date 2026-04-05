import { randomUUID, randomBytes, scryptSync } from "crypto";

import nextEnv from "@next/env";
import { createClient } from "@supabase/supabase-js";

const { loadEnvConfig } = nextEnv;

loadEnvConfig(process.cwd());

const [, , name, email, password] = process.argv;

if (!name || !email || !password) {
  console.error(
    'Usage: npm run admin:create-user -- "Full Name" "email@example.com" "StrongPassword"',
  );
  process.exit(1);
}

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    "Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY first.",
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const normalizedEmail = email.trim().toLowerCase();
const { data: existingUser, error: readError } = await supabase
  .from("admin_users")
  .select("id")
  .eq("email", normalizedEmail)
  .maybeSingle();

if (readError) {
  console.error(`Unable to verify existing admin users: ${readError.message}`);
  process.exit(1);
}

if (existingUser) {
  console.error(`Admin user ${normalizedEmail} already exists.`);
  process.exit(1);
}

const salt = randomBytes(16).toString("hex");
const passwordHash = `scrypt$${salt}$${scryptSync(password, salt, 64).toString("hex")}`;
const now = new Date().toISOString();

const { error: insertError } = await supabase.from("admin_users").insert({
  id: randomUUID(),
  name: name.trim(),
  email: normalizedEmail,
  password_hash: passwordHash,
  created_at: now,
  updated_at: now,
});

if (insertError) {
  console.error(`Unable to create admin user: ${insertError.message}`);
  process.exit(1);
}

console.log(`Admin user ${normalizedEmail} created successfully.`);
