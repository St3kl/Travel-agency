"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdminUser } from "@/lib/admin-session";
import {
  sendReservationDecisionEmail,
  sendReservationInvoiceEmail,
  sendReservationPaidEmail,
} from "@/lib/mailer";
import {
  readReservations,
  type ReservationStatus,
  confirmReservationPayment,
  deleteArchivedReservation,
  saveReservationInvoice,
  setReservationArchived,
  type ReservationInvoiceItem,
  updateReservationStatus,
} from "@/lib/reservations";

const statusSchema = z.object({
  id: z.string().trim().min(1),
  status: z.enum(["pending", "rejected"]),
  statusNote: z.string().trim().optional(),
});

export async function updateReservationStatusAction(formData: FormData) {
  const currentUser = await requireAdminUser();
  const validatedFields = statusSchema.safeParse({
    id: formData.get("id"),
    status: formData.get("status"),
    statusNote: formData.get("statusNote"),
  });

  if (!validatedFields.success) {
    throw new Error("Invalid reservation update request.");
  }

  const nextStatus = validatedFields.data.status as ReservationStatus;
  const updatedReservation = await updateReservationStatus(
    validatedFields.data.id,
    nextStatus,
    {
      statusNote: validatedFields.data.statusNote ?? "",
      processedByName: currentUser.name,
      processedByEmail: currentUser.email,
    },
  );

  if (updatedReservation && nextStatus === "rejected") {
    const emailResult = await sendReservationDecisionEmail({
      reservation: updatedReservation,
      processedByName: currentUser.name,
      statusNote: validatedFields.data.statusNote ?? "",
    });

    await updateReservationStatus(validatedFields.data.id, nextStatus, {
      statusNote: validatedFields.data.statusNote ?? "",
      processedByName: currentUser.name,
      processedByEmail: currentUser.email,
      statusEmailSentAt: new Date().toISOString(),
      statusEmailMode: emailResult.mode,
    });
  }

  revalidatePath("/admin/reservations");
  revalidatePath("/admin/archive");
}

const invoiceSchema = z.object({
  id: z.string().trim().min(1),
  invoiceCurrency: z.string().trim().min(1, "Invoice currency is required."),
  invoiceDueDate: z.string().trim().min(1, "Invoice due date is required."),
  invoiceNote: z.string().trim().optional(),
});

function buildInvoiceItems(
  formData: FormData,
): ReservationInvoiceItem[] {
  const items: ReservationInvoiceItem[] = [];

  const descriptions = formData.getAll("itemDescription");
  const amounts = formData.getAll("itemAmount");
  const maxLength = Math.max(descriptions.length, amounts.length);

  for (let index = 0; index < maxLength; index += 1) {
    const description = descriptions[index];
    const amountRaw = amounts[index];

    const safeDescription =
      typeof description === "string" ? description.trim() : "";
    const safeAmountRaw = typeof amountRaw === "string" ? amountRaw.trim() : "";

    if (!safeDescription && !safeAmountRaw) {
      continue;
    }

    const amount = Number(safeAmountRaw);

    if (!safeDescription || Number.isNaN(amount) || amount <= 0) {
      throw new Error(
        `Invoice line ${index + 1} must include a description and a positive amount.`,
      );
    }

    items.push({
      description: safeDescription,
      amount,
    });
  }

  if (items.length === 0) {
    throw new Error("At least one invoice item is required before sending the proforma invoice.");
  }

  return items;
}

export async function sendReservationInvoiceAction(formData: FormData) {
  const currentUser = await requireAdminUser();
  const validatedFields = invoiceSchema.safeParse({
    id: formData.get("id"),
    invoiceCurrency: formData.get("invoiceCurrency"),
    invoiceDueDate: formData.get("invoiceDueDate"),
    invoiceNote: formData.get("invoiceNote"),
  });

  if (!validatedFields.success) {
    throw new Error("Invalid proforma invoice request.");
  }

  const items = buildInvoiceItems(formData);
  const computedTotal = items.reduce((sum, item) => sum + item.amount, 0);

  const reservationWithInvoiceDraft = await saveReservationInvoice(
    validatedFields.data.id,
    {
      currency: validatedFields.data.invoiceCurrency,
      total: computedTotal,
      dueDate: validatedFields.data.invoiceDueDate,
      items,
      note: validatedFields.data.invoiceNote ?? "",
      processedByName: currentUser.name,
      processedByEmail: currentUser.email,
      statusEmailMode: "preview",
    },
  );

  if (!reservationWithInvoiceDraft) {
    throw new Error("Reservation not found.");
  }

  const emailResult = await sendReservationInvoiceEmail({
    reservation: reservationWithInvoiceDraft,
    processedByName: currentUser.name,
  });

  await saveReservationInvoice(validatedFields.data.id, {
    currency: validatedFields.data.invoiceCurrency,
    total: computedTotal,
    dueDate: validatedFields.data.invoiceDueDate,
    items,
    note: validatedFields.data.invoiceNote ?? "",
    processedByName: currentUser.name,
    processedByEmail: currentUser.email,
    statusEmailMode: emailResult.mode,
  });

  revalidatePath("/admin/reservations");
  revalidatePath("/admin/archive");
}

const paymentSchema = z.object({
  id: z.string().trim().min(1),
});

export async function markReservationPaidAction(formData: FormData) {
  const currentUser = await requireAdminUser();
  const validatedFields = paymentSchema.safeParse({
    id: formData.get("id"),
  });

  if (!validatedFields.success) {
    throw new Error("Invalid payment confirmation request.");
  }

  const reservation = (await readReservations()).find(
    (item) => item.id === validatedFields.data.id,
  );

  if (!reservation) {
    throw new Error("Reservation not found.");
  }

  if (reservation.status !== "invoiced" || !reservation.invoiceTotal) {
    throw new Error(
      "A proforma invoice must be sent before the reservation can be marked as paid.",
    );
  }

  const updatedReservation = await updateReservationStatus(
    validatedFields.data.id,
    "paid",
    {
      processedByName: currentUser.name,
      processedByEmail: currentUser.email,
    },
  );

  if (!updatedReservation) {
    throw new Error("Reservation not found after payment confirmation.");
  }

  const paymentReadyReservation = await confirmReservationPayment(
    validatedFields.data.id,
    {
      paymentConfirmedByName: currentUser.name,
      paymentConfirmedByEmail: currentUser.email,
      paymentEmailMode: "preview",
    },
  );

  if (!paymentReadyReservation) {
    throw new Error("Reservation payment could not be prepared.");
  }

  const emailResult = await sendReservationPaidEmail({
    reservation: paymentReadyReservation,
    processedByName: currentUser.name,
  });

  await confirmReservationPayment(validatedFields.data.id, {
    paymentConfirmedByName: currentUser.name,
    paymentConfirmedByEmail: currentUser.email,
    paymentEmailMode: emailResult.mode,
  });

  revalidatePath("/admin/reservations");
  revalidatePath("/admin/archive");
}

const archiveSchema = z.object({
  id: z.string().trim().min(1),
  archived: z.enum(["true", "false"]),
});

export async function setReservationArchivedAction(formData: FormData) {
  const currentUser = await requireAdminUser();
  const validatedFields = archiveSchema.safeParse({
    id: formData.get("id"),
    archived: formData.get("archived"),
  });

  if (!validatedFields.success) {
    throw new Error("Invalid reservation archive request.");
  }

  await setReservationArchived(
    validatedFields.data.id,
    validatedFields.data.archived === "true",
    {
      archivedByName: currentUser.name,
      archivedByEmail: currentUser.email,
    },
  );

  revalidatePath("/admin/reservations");
  revalidatePath("/admin/archive");
}

const deleteArchivedSchema = z.object({
  id: z.string().trim().min(1),
});

export async function deleteArchivedReservationAction(formData: FormData) {
  await requireAdminUser();
  const validatedFields = deleteArchivedSchema.safeParse({
    id: formData.get("id"),
  });

  if (!validatedFields.success) {
    throw new Error("Invalid reservation delete request.");
  }

  await deleteArchivedReservation(validatedFields.data.id);

  revalidatePath("/admin/reservations");
  revalidatePath("/admin/archive");
}
