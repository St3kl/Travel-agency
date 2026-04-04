import {
  randomUUID,
  randomBytes,
  scrypt as nodeScrypt,
  timingSafeEqual,
} from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { promisify } from "util";

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

const DATA_DIR = path.join(process.cwd(), "data");
const ADMIN_USERS_PATH = path.join(DATA_DIR, "admin-users.json");

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

async function ensureAdminUsersFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });

  try {
    await fs.access(ADMIN_USERS_PATH);
  } catch {
    await fs.writeFile(ADMIN_USERS_PATH, "[]\n", "utf8");
  }
}

async function writeAdminUsers(users: AdminUserRecord[]) {
  await ensureAdminUsersFile();
  await fs.writeFile(
    ADMIN_USERS_PATH,
    `${JSON.stringify(users, null, 2)}\n`,
    "utf8",
  );
}

export async function readAdminUsers(): Promise<AdminUserRecord[]> {
  await ensureAdminUsersFile();
  const raw = await fs.readFile(ADMIN_USERS_PATH, "utf8");
  const users = JSON.parse(raw) as AdminUserRecord[];

  return users.sort((a, b) => a.name.localeCompare(b.name));
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
  const users = await readAdminUsers();
  const normalizedEmail = normalizeEmail(email);
  return users.find((user) => normalizeEmail(user.email) === normalizedEmail) ?? null;
}

export async function findAdminUserById(id: string) {
  const users = await readAdminUsers();
  return users.find((user) => user.id === id) ?? null;
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
  const users = await readAdminUsers();
  const normalizedEmail = normalizeEmail(input.email);

  if (users.some((user) => normalizeEmail(user.email) === normalizedEmail)) {
    throw new Error(`An admin with email ${normalizedEmail} already exists.`);
  }

  const now = new Date().toISOString();
  const user: AdminUserRecord = {
    id: randomUUID(),
    name: input.name.trim(),
    email: normalizedEmail,
    passwordHash: await hashAdminPassword(input.password),
    createdAt: now,
    updatedAt: now,
  };

  users.push(user);
  await writeAdminUsers(users);

  return user;
}
