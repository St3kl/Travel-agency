import { randomUUID, randomBytes, scryptSync } from "crypto";
import { promises as fs } from "fs";
import path from "path";

const [, , name, email, password] = process.argv;

if (!name || !email || !password) {
  console.error(
    'Usage: npm run admin:create-user -- "Full Name" "email@example.com" "StrongPassword"',
  );
  process.exit(1);
}

const dataDir = path.join(process.cwd(), "data");
const adminUsersPath = path.join(dataDir, "admin-users.json");

await fs.mkdir(dataDir, { recursive: true });

let users = [];
try {
  users = JSON.parse(await fs.readFile(adminUsersPath, "utf8"));
} catch {
  users = [];
}

const normalizedEmail = email.trim().toLowerCase();
if (users.some((user) => user.email.toLowerCase() === normalizedEmail)) {
  console.error(`Admin user ${normalizedEmail} already exists.`);
  process.exit(1);
}

const salt = randomBytes(16).toString("hex");
const passwordHash = `scrypt$${salt}$${scryptSync(password, salt, 64).toString("hex")}`;
const now = new Date().toISOString();

users.push({
  id: randomUUID(),
  name: name.trim(),
  email: normalizedEmail,
  passwordHash,
  createdAt: now,
  updatedAt: now,
});

await fs.writeFile(adminUsersPath, `${JSON.stringify(users, null, 2)}\n`, "utf8");

console.log(`Admin user ${normalizedEmail} created successfully.`);
