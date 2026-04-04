 "use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import type { ReservationFormState } from "@/app/book/form-state";
import { sendReservationEmail } from "@/lib/mailer";
import { createReservation } from "@/lib/reservations";
import { sendReservationWhatsappNotification } from "@/lib/whatsapp";

const reservationSchema = z.object({
  destination: z.string().trim().min(1, "Please select a destination."),
  experience: z.string().trim().min(1, "Please select an experience."),
  travelDate: z.string().trim().min(1, "Please choose a travel date."),
  flexibleDates: z.enum(["Yes", "No"]),
  duration: z.string().trim().min(1, "Please enter the trip duration."),
  guestCount: z.coerce.number().int().min(1, "At least one guest is required."),
  fullName: z.string().trim().min(2, "Please enter the lead traveler name."),
  email: z.string().trim().email("Please enter a valid email address."),
  whatsapp: z.string().trim().min(8, "Please enter a valid WhatsApp number."),
  country: z.string().trim().min(2, "Please enter the country of residence."),
  budget: z.string().trim().min(1, "Please choose a budget range."),
  accommodation: z.string().trim().min(1, "Please choose an accommodation style."),
  specialOccasion: z.string().trim().optional(),
  notes: z.string().trim().optional(),
  preferredContact: z.enum(["Email", "WhatsApp"]),
});

export async function submitReservation(
  _prevState: ReservationFormState,
  formData: FormData,
): Promise<ReservationFormState> {
  const validatedFields = reservationSchema.safeParse({
    destination: formData.get("destination"),
    experience: formData.get("experience"),
    travelDate: formData.get("travelDate"),
    flexibleDates: formData.get("flexibleDates"),
    duration: formData.get("duration"),
    guestCount: formData.get("guestCount"),
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    whatsapp: formData.get("whatsapp"),
    country: formData.get("country"),
    budget: formData.get("budget"),
    accommodation: formData.get("accommodation"),
    specialOccasion: formData.get("specialOccasion"),
    notes: formData.get("notes"),
    preferredContact: formData.get("preferredContact"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Please review the highlighted fields before submitting.",
      fieldErrors: validatedFields.error.flatten().fieldErrors as Partial<
        Record<string, string[]>
      >,
    };
  }

  const reservation = await createReservation({
    ...validatedFields.data,
    specialOccasion: validatedFields.data.specialOccasion ?? "",
    notes: validatedFields.data.notes ?? "",
  });
  const emailResult = await sendReservationEmail(reservation);
  const whatsappResult = await sendReservationWhatsappNotification(reservation);

  revalidatePath("/admin/reservations");

  return {
    success: true,
    message: "Thank you for applying. Please check your email.",
    reservationId: reservation.id,
    emailMode: emailResult.mode,
    previewPath:
      emailResult.mode === "preview" ? emailResult.previewDirectory : undefined,
    whatsappMode: whatsappResult.mode,
  };
}

