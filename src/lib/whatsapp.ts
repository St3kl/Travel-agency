import { promises as fs } from "fs";
import path from "path";

import { CONTACT_WHATSAPP, CONTACT_WHATSAPP_URL } from "@/lib/contact";
import type { ReservationRecord } from "@/lib/reservations";

export type WhatsappNotificationResult =
  | { delivered: true; mode: "webhook" }
  | {
      delivered: false;
      mode: "preview";
      previewPath: string;
      manualUrl: string;
    };

function buildReservationWhatsappText(reservation: ReservationRecord) {
  return [
    "New Ekeon Group reservation request",
    `Reservation ID: ${reservation.id}`,
    `Status: ${reservation.status}`,
    `Traveler: ${reservation.fullName}`,
    `Destination: ${reservation.destination}`,
    `Experience: ${reservation.experience}`,
    `Travel date: ${reservation.travelDate}`,
    `Guests: ${reservation.guestCount}`,
    `Email: ${reservation.email}`,
    `WhatsApp: ${reservation.whatsapp}`,
  ].join("\n");
}

export function buildBusinessWhatsappUrl(reservation: ReservationRecord) {
  return `${CONTACT_WHATSAPP_URL}?text=${encodeURIComponent(
    buildReservationWhatsappText(reservation),
  )}`;
}

export async function sendReservationWhatsappNotification(
  reservation: ReservationRecord,
): Promise<WhatsappNotificationResult> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_FROM;
  const webhookUrl = process.env.WHATSAPP_WEBHOOK_URL;
  const message = buildReservationWhatsappText(reservation);

  if (accountSid && authToken && from) {
    const body = new URLSearchParams({
      From: from,
      To: `whatsapp:${process.env.WHATSAPP_NOTIFICATION_TO ?? CONTACT_WHATSAPP}`,
      Body: message,
    });

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
      },
    );

    if (!response.ok) {
      throw new Error("Twilio WhatsApp notification failed.");
    }

    return {
      delivered: true,
      mode: "webhook",
    };
  }

  if (!webhookUrl) {
    const dir = path.join(process.cwd(), "data", "whatsapp-previews");
    await fs.mkdir(dir, { recursive: true });

    const previewPath = path.join(dir, `${reservation.id}.txt`);
    await fs.writeFile(
      previewPath,
      `To: ${CONTACT_WHATSAPP}\n\n${message}`,
      "utf8",
    );

    return {
      delivered: false,
      mode: "preview",
      previewPath,
      manualUrl: buildBusinessWhatsappUrl(reservation),
    };
  }

  await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to: process.env.WHATSAPP_NOTIFICATION_TO ?? CONTACT_WHATSAPP,
      message,
      reservationId: reservation.id,
    }),
  });

  return {
    delivered: true,
    mode: "webhook",
  };
}
