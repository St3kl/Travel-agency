import {
  randomUUID,
  randomBytes,
  scrypt as nodeScrypt,
  timingSafeEqual,
} from "crypto";
import { promisify } from "util";

import { getSupabaseServerClient } from "@/lib/supabase";

const scrypt = promisify(nodeScrypt);

export type AdminUserRecord = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  updatedAt: string;
};

export type AdminSessionUser = Pick<AdminUserRecord, "id" | "name" | "email">;

type AdminUserRow = {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function mapAdminUser(row: AdminUserRow): AdminUserRecord {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    passwordHash: row.password_hash,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function readAdminUsers(): Promise<AdminUserRecord[]> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("admin_users")
    .select("id, name, email, password_hash, created_at, updated_at")
    .order("name", { ascending: true });

  if (error) {
    throw new Error(`Unable to read admin users from Supabase: ${error.message}`);
  }

  return (data ?? []).map(mapAdminUser);
}

export async function hashAdminPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  return `scrypt$${salt}$${derived.toString("hex")}`;
}

export async function verifyAdminPassword(
  password: string,
  storedHash: string,
) {
  const [algorithm, salt, expectedHash] = storedHash.split("$");

  if (algorithm !== "scrypt" || !salt || !expectedHash) {
    return false;
  }

  const derived = (await scrypt(password, salt, 64)) as Buffer;
  const expected = Buffer.from(expectedHash, "hex");

  if (derived.length !== expected.length) {
    return false;
  }

  return timingSafeEqual(derived, expected);
}

export async function findAdminUserByEmail(email: string) {
  const supabase = getSupabaseServerClient();
  const normalizedEmail = normalizeEmail(email);
  const { data, error } = await supabase
    .from("admin_users")
    .select("id, name, email, password_hash, created_at, updated_at")
    .eq("email", normalizedEmail)
    .maybeSingle<AdminUserRow>();

  if (error) {
    throw new Error(`Unable to find admin user by email: ${error.message}`);
  }

  return data ? mapAdminUser(data) : null;
}

export async function findAdminUserById(id: string) {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("admin_users")
    .select("id, name, email, password_hash, created_at, updated_at")
    .eq("id", id)
    .maybeSingle<AdminUserRow>();

  if (error) {
    throw new Error(`Unable to find admin user by id: ${error.message}`);
  }

  return data ? mapAdminUser(data) : null;
}

export async function authenticateAdminUser(
  email: string,
  password: string,
): Promise<AdminSessionUser | null> {
  const user = await findAdminUserByEmail(email);

  if (!user) {
    return null;
  }

  const isValid = await verifyAdminPassword(password, user.passwordHash);
  if (!isValid) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

export async function createAdminUser(input: {
  name: string;
  email: string;
  password: string;
}) {
  const normalizedEmail = normalizeEmail(input.email);
  const existingUser = await findAdminUserByEmail(normalizedEmail);

  if (existingUser) {
    throw new Error(`An admin with email ${normalizedEmail} already exists.`);
  }

  const now = new Date().toISOString();
  const payload = {
    id: randomUUID(),
    name: input.name.trim(),
    email: normalizedEmail,
    password_hash: await hashAdminPassword(input.password),
    created_at: now,
    updated_at: now,
  };

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("admin_users")
    .insert(payload)
    .select("id, name, email, password_hash, created_at, updated_at")
    .single<AdminUserRow>();

  if (error) {
    throw new Error(`Unable to create admin user in Supabase: ${error.message}`);
  }

  return mapAdminUser(data);
}
