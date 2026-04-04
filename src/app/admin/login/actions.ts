"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import type { AdminLoginFormState } from "@/app/admin/login/form-state";
import { createAdminSession } from "@/lib/admin-session";
import { authenticateAdminUser } from "@/lib/admin-users";

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid admin email."),
  password: z.string().min(1, "Enter your password."),
});

export async function loginAdminAction(
  _prevState: AdminLoginFormState,
  formData: FormData,
): Promise<AdminLoginFormState> {
  const validatedFields = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Please enter a valid email and password.",
    };
  }

  const user = await authenticateAdminUser(
    validatedFields.data.email,
    validatedFields.data.password,
  );

  if (!user) {
    return {
      success: false,
      message: "The admin credentials are not valid.",
    };
  }

  await createAdminSession(user);
  redirect("/admin/reservations");
}
