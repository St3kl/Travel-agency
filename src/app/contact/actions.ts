"use server";

import { randomUUID } from "crypto";
import { z } from "zod";

import type { InquiryFormState } from "@/app/contact/form-state";
import { sendInquiryEmail } from "@/lib/mailer";

const inquirySchema = z.object({
  firstName: z.string().trim().min(1, "Please enter your first name."),
  lastName: z.string().trim().min(1, "Please enter your last name."),
  email: z.string().trim().email("Please enter a valid email address."),
  interestedIn: z.string().trim().min(1, "Please select a service."),
  message: z.string().trim().min(10, "Please tell us a bit more about your inquiry."),
});

export async function submitInquiry(
  _prevState: InquiryFormState,
  formData: FormData,
): Promise<InquiryFormState> {
  try {
    const validatedFields = inquirySchema.safeParse({
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      interestedIn: formData.get("interestedIn"),
      message: formData.get("message"),
    });

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Please review the highlighted fields before sending your inquiry.",
        fieldErrors: validatedFields.error.flatten().fieldErrors as Partial<
          Record<string, string[]>
        >,
      };
    }

    const now = new Date().toISOString();
    const inquiry = {
      ...validatedFields.data,
      id: `EKI-${now.slice(0, 10).replace(/-/g, "")}-${randomUUID().slice(0, 8).toUpperCase()}`,
      fullName: `${validatedFields.data.firstName} ${validatedFields.data.lastName}`.trim(),
      status: "pending" as const,
      submittedAt: now,
      updatedAt: now,
    };
    const emailResult = await sendInquiryEmail(inquiry);

    return {
      success: true,
      message: "Thank you for contacting us. Please check your email.",
      inquiryId: inquiry.id,
      emailMode: emailResult.mode,
      previewPath:
        emailResult.mode === "preview" ? emailResult.previewDirectory : undefined,
    };
  } catch {
    return {
      success: false,
      message:
        "We could not send your inquiry right now. Please try again in a moment.",
    };
  }
}
