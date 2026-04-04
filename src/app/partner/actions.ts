"use server";

import { randomUUID } from "crypto";

import { z } from "zod";

import type { PartnerInquiryFormState } from "@/app/partner/form-state";
import { sendPartnerInquiryEmail } from "@/lib/mailer";

const partnerInquirySchema = z.object({
  companyName: z.string().trim().min(2, "Please enter the company name."),
  contactPerson: z.string().trim().min(2, "Please enter the contact person."),
  email: z.string().trim().email("Please enter a valid work email."),
  primaryDestination: z
    .string()
    .trim()
    .min(2, "Please enter the primary destination."),
  whatsapp: z.string().trim().optional(),
  message: z
    .string()
    .trim()
    .min(10, "Please tell us a bit more about the partnership opportunity."),
});

function buildPartnerInquiryId() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  return `EKP-${date}-${randomUUID().slice(0, 8).toUpperCase()}`;
}

export async function submitPartnerInquiry(
  _prevState: PartnerInquiryFormState,
  formData: FormData,
): Promise<PartnerInquiryFormState> {
  const validatedFields = partnerInquirySchema.safeParse({
    companyName: formData.get("companyName"),
    contactPerson: formData.get("contactPerson"),
    email: formData.get("email"),
    primaryDestination: formData.get("primaryDestination"),
    whatsapp: formData.get("whatsapp"),
    message: formData.get("message"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message:
        "Please review the highlighted fields before sending your partnership inquiry.",
      fieldErrors: validatedFields.error.flatten().fieldErrors as Partial<
        Record<string, string[]>
      >,
    };
  }

  const inquiry = {
    id: buildPartnerInquiryId(),
    submittedAt: new Date().toISOString(),
    ...validatedFields.data,
  };

  const emailResult = await sendPartnerInquiryEmail(inquiry);

  return {
    success: true,
    message: "Thank you for your interest in partnering with us. Please check your email.",
    inquiryId: inquiry.id,
    emailMode: emailResult.mode,
    previewPath:
      emailResult.mode === "preview" ? emailResult.previewDirectory : undefined,
  };
}
