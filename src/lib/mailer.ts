import { promises as fs } from "fs";
import os from "os";
import path from "path";

import nodemailer from "nodemailer";

import { COMPANY_PAYMENT_DETAILS } from "@/lib/company-payment";
import {
  buildReservationInvoicePdf,
  buildReservationPaidInvoicePdf,
  buildReservationPdf,
} from "@/lib/reservation-pdf";
import { CONTACT_EMAIL } from "@/lib/contact";
import type { ReservationRecord } from "@/lib/reservations";

type EmailResult =
  | { delivered: true; mode: "smtp" }
  | { delivered: false; mode: "preview"; previewDirectory: string };

type ReservationDecisionEmailInput = {
  reservation: ReservationRecord;
  processedByName: string;
  statusNote?: string;
};

type ReservationInvoiceEmailInput = {
  reservation: ReservationRecord;
  processedByName: string;
};

type ReservationPaymentEmailInput = {
  reservation: ReservationRecord;
  processedByName: string;
};

type PartnerInquiryEmailInput = {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  primaryDestination: string;
  whatsapp?: string;
  message: string;
  submittedAt: string;
};

type ContactInquiryEmailInput = {
  id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  interestedIn: string;
  message: string;
  status: "pending";
  submittedAt: string;
  updatedAt: string;
};

type ArchivedReservationsExportEmailInput = {
  csvContent: string;
  filename: string;
  totalRecords: number;
  requestedByName: string;
  requestedByEmail: string;
  search?: string;
  status?: string;
};

function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from =
    process.env.SMTP_FROM ?? process.env.SMTP_USER ?? "Ekeon Group <no-reply@ekeon.group>";

  return {
    host,
    port,
    user,
    pass,
    from,
    transporter:
      host && user && pass
        ? nodemailer.createTransport({
            host,
            port,
            secure: port === 465,
            auth: {
              user,
              pass,
            },
          })
        : null,
  };
}

function getPreviewRootDirectory() {
  return path.join(os.tmpdir(), "ekeon-previews");
}

function getPreviewDirectory(...segments: string[]) {
  return path.join(getPreviewRootDirectory(), ...segments);
}

function buildBusinessReservationEmail(reservation: ReservationRecord) {
  const lines = [
    "New reservation request received",
    "",
    `Reservation ID: ${reservation.id}`,
    `Status: ${reservation.status}`,
    `Submitted: ${reservation.submittedAt}`,
    "",
    "Trip details",
    `- Destination: ${reservation.destination}`,
    `- Experience: ${reservation.experience}`,
    `- Preferred travel date: ${reservation.travelDate}`,
    `- Flexible dates: ${reservation.flexibleDates}`,
    `- Duration: ${reservation.duration}`,
    `- Guests: ${reservation.guestCount}`,
    `- Budget: ${reservation.budget}`,
    `- Accommodation: ${reservation.accommodation}`,
    "",
    "Traveler details",
    `- Full name: ${reservation.fullName}`,
    `- Email: ${reservation.email}`,
    `- WhatsApp: ${reservation.whatsapp}`,
    `- Country of residence: ${reservation.country}`,
    `- Preferred contact method: ${reservation.preferredContact}`,
    `- Special occasion: ${reservation.specialOccasion || "Not specified"}`,
    "",
    "Additional notes",
    reservation.notes || "No additional notes provided.",
  ];

  return lines.join("\n");
}

function buildCustomerReservationEmail(reservation: ReservationRecord) {
  return [
    `Hello ${reservation.fullName},`,
    "",
    "Thank you for applying with Ekeon Group.",
    "Your reservation request is currently pending.",
    "Please check the attached PDF for the reservation details.",
    "We will contact you as soon as we finish processing your request.",
    "",
    `Reservation ID: ${reservation.id}`,
    `Destination: ${reservation.destination}`,
    `Experience: ${reservation.experience}`,
    `Travel date: ${reservation.travelDate}`,
    "",
    "Warm regards,",
    "Ekeon Group",
  ].join("\n");
}

async function savePreview(
  reservation: ReservationRecord,
  businessText: string,
  customerText: string,
  pdfBytes: Uint8Array,
) {
  const previewDirectory = getPreviewDirectory("mail-previews", reservation.id);
  await fs.mkdir(previewDirectory, { recursive: true });

  await fs.writeFile(
    path.join(previewDirectory, "internal-email.txt"),
    businessText,
    "utf8",
  );
  await fs.writeFile(
    path.join(previewDirectory, "customer-email.txt"),
    customerText,
    "utf8",
  );
  await fs.writeFile(
    path.join(previewDirectory, `${reservation.id}.pdf`),
    Buffer.from(pdfBytes),
  );

  return previewDirectory;
}

export async function sendReservationEmail(
  reservation: ReservationRecord,
): Promise<EmailResult> {
  const { host, user, pass, from, transporter } = createTransporter();

  const businessText = buildBusinessReservationEmail(reservation);
  const customerText = buildCustomerReservationEmail(reservation);
  const pdfBytes = await buildReservationPdf(reservation);
  const attachment = {
    filename: `${reservation.id}.pdf`,
    content: Buffer.from(pdfBytes),
    contentType: "application/pdf",
  };

  if (!host || !user || !pass || !transporter) {
    const previewDirectory = await savePreview(
      reservation,
      businessText,
      customerText,
      pdfBytes,
    );
    return {
      delivered: false,
      mode: "preview",
      previewDirectory,
    };
  }

  try {
    await transporter.sendMail({
      from,
      to: process.env.BOOKING_NOTIFICATION_EMAIL ?? CONTACT_EMAIL,
      replyTo: reservation.email,
      subject: `New reservation request ${reservation.id}`,
      text: businessText,
      attachments: [attachment],
    });

    await transporter.sendMail({
      from,
      to: reservation.email,
      subject: `Reservation received: ${reservation.id}`,
      text: customerText,
      attachments: [attachment],
    });
  } catch {
    const previewDirectory = await savePreview(
      reservation,
      businessText,
      customerText,
      pdfBytes,
    );
    return {
      delivered: false,
      mode: "preview",
      previewDirectory,
    };
  }

  return {
    delivered: true,
    mode: "smtp",
  };
}

function buildReservationDecisionEmail({
  reservation,
  processedByName,
  statusNote,
}: ReservationDecisionEmailInput) {
  const decisionLabel =
    reservation.status === "invoiced" ? "invoice sent" : "rejected";
  const intro =
    reservation.status === "invoiced"
      ? "We are pleased to let you know that your reservation request has been approved for the next step."
      : "We have finished reviewing your reservation request.";

  return [
    `Hello ${reservation.fullName},`,
    "",
    intro,
    `Current status: ${decisionLabel}.`,
    `Reservation ID: ${reservation.id}`,
    `Destination: ${reservation.destination}`,
    `Experience: ${reservation.experience}`,
    "",
    statusNote ? `Message from our team: ${statusNote}` : null,
    `Processed by: ${processedByName}`,
    "",
    "If you have any questions, reply to this email and our team will help you.",
    "",
    "Warm regards,",
    "Ekeon Group",
  ]
    .filter(Boolean)
    .join("\n");
}

export async function sendReservationDecisionEmail({
  reservation,
  processedByName,
  statusNote,
}: ReservationDecisionEmailInput): Promise<EmailResult> {
  const { host, user, pass, from, transporter } = createTransporter();

  const customerText = buildReservationDecisionEmail({
    reservation,
    processedByName,
    statusNote,
  });

  if (!host || !user || !pass || !transporter) {
    const previewDirectory = getPreviewDirectory("mail-previews", reservation.id);
    await fs.mkdir(previewDirectory, { recursive: true });
    await fs.writeFile(
      path.join(
        previewDirectory,
        `decision-${reservation.status}-customer-email.txt`,
      ),
      customerText,
      "utf8",
    );

    return {
      delivered: false,
      mode: "preview",
      previewDirectory,
    };
  }

  try {
    await transporter.sendMail({
      from,
      to: reservation.email,
      subject: `Reservation ${reservation.status}: ${reservation.id}`,
      text: customerText,
    });
  } catch {
    const previewDirectory = getPreviewDirectory("mail-previews", reservation.id);
    await fs.mkdir(previewDirectory, { recursive: true });
    await fs.writeFile(
      path.join(
        previewDirectory,
        `decision-${reservation.status}-customer-email.txt`,
      ),
      customerText,
      "utf8",
    );

    return {
      delivered: false,
      mode: "preview",
      previewDirectory,
    };
  }

  return {
    delivered: true,
    mode: "smtp",
  };
}

function buildReservationInvoiceEmail({
  reservation,
  processedByName,
}: ReservationInvoiceEmailInput) {
  return [
    `Hello ${reservation.fullName},`,
    "",
    "Your reservation request has been approved for payment processing.",
    "Please find the attached proforma invoice with the itemized charges and total amount due.",
    `Reservation ID: ${reservation.id}`,
    `Invoice total: ${reservation.invoiceCurrency ?? "USD"} ${(
      reservation.invoiceTotal ?? 0
    ).toFixed(2)}`,
    reservation.invoiceDueDate
      ? `Due date: ${new Date(reservation.invoiceDueDate).toLocaleDateString()}`
      : null,
    "",
    "Please make payment to the company account shown in the proforma invoice.",
    `Once payment has been made, reply to this email with your proof of payment at ${COMPANY_PAYMENT_DETAILS.paymentProofEmail}.`,
    "",
    reservation.invoiceNote
      ? `Finance note: ${reservation.invoiceNote}`
      : null,
    `Processed by: ${processedByName}`,
    "",
    "Warm regards,",
    "Ekeon Group",
  ]
    .filter(Boolean)
    .join("\n");
}

export async function sendReservationInvoiceEmail({
  reservation,
  processedByName,
}: ReservationInvoiceEmailInput): Promise<EmailResult> {
  const { host, user, pass, from, transporter } = createTransporter();

  const customerText = buildReservationInvoiceEmail({
    reservation,
    processedByName,
  });
  const pdfBytes = await buildReservationInvoicePdf(reservation);
  const attachment = {
    filename: `${reservation.id}-proforma-invoice.pdf`,
    content: Buffer.from(pdfBytes),
    contentType: "application/pdf",
  };

  if (!host || !user || !pass || !transporter) {
    const previewDirectory = getPreviewDirectory("mail-previews", reservation.id);
    await fs.mkdir(previewDirectory, { recursive: true });
    await fs.writeFile(
      path.join(previewDirectory, "invoice-customer-email.txt"),
      customerText,
      "utf8",
    );
    await fs.writeFile(
      path.join(previewDirectory, `${reservation.id}-proforma-invoice.pdf`),
      Buffer.from(pdfBytes),
    );

    return {
      delivered: false,
      mode: "preview",
      previewDirectory,
    };
  }

  try {
    await transporter.sendMail({
      from,
      to: reservation.email,
      subject: `Proforma invoice: ${reservation.id}`,
      text: customerText,
      attachments: [attachment],
    });
  } catch {
    const previewDirectory = getPreviewDirectory("mail-previews", reservation.id);
    await fs.mkdir(previewDirectory, { recursive: true });
    await fs.writeFile(
      path.join(previewDirectory, "invoice-customer-email.txt"),
      customerText,
      "utf8",
    );
    await fs.writeFile(
      path.join(previewDirectory, `${reservation.id}-proforma-invoice.pdf`),
      Buffer.from(pdfBytes),
    );

    return {
      delivered: false,
      mode: "preview",
      previewDirectory,
    };
  }

  return {
    delivered: true,
    mode: "smtp",
  };
}

function buildReservationPaidEmail({
  reservation,
  processedByName,
}: ReservationPaymentEmailInput) {
  return [
    `Hello ${reservation.fullName},`,
    "",
    "We confirm that your payment has been received successfully.",
    "Attached you will find your paid invoice PDF for your records.",
    `Reservation ID: ${reservation.id}`,
    `Amount received: ${reservation.invoiceCurrency ?? "USD"} ${(
      reservation.invoiceTotal ?? 0
    ).toFixed(2)}`,
    "",
    "Our team will now proceed to the next step of your booking.",
    "Please stay attentive to your email, as we will contact you with the next instructions shortly.",
    "",
    `Confirmed by: ${processedByName}`,
    "",
    "Warm regards,",
    "Ekeon Group",
  ].join("\n");
}

export async function sendReservationPaidEmail({
  reservation,
  processedByName,
}: ReservationPaymentEmailInput): Promise<EmailResult> {
  const { host, user, pass, from, transporter } = createTransporter();
  const customerText = buildReservationPaidEmail({
    reservation,
    processedByName,
  });
  const pdfBytes = await buildReservationPaidInvoicePdf(reservation);
  const attachment = {
    filename: `${reservation.id}-paid-invoice.pdf`,
    content: Buffer.from(pdfBytes),
    contentType: "application/pdf",
  };

  if (!host || !user || !pass || !transporter) {
    const previewDirectory = getPreviewDirectory("mail-previews", reservation.id);
    await fs.mkdir(previewDirectory, { recursive: true });
    await fs.writeFile(
      path.join(previewDirectory, "payment-confirmation-customer-email.txt"),
      customerText,
      "utf8",
    );
    await fs.writeFile(
      path.join(previewDirectory, `${reservation.id}-paid-invoice.pdf`),
      Buffer.from(pdfBytes),
    );

    return {
      delivered: false,
      mode: "preview",
      previewDirectory,
    };
  }

  try {
    await transporter.sendMail({
      from,
      to: reservation.email,
      subject: `Payment received: ${reservation.id}`,
      text: customerText,
      attachments: [attachment],
    });
  } catch {
    const previewDirectory = getPreviewDirectory("mail-previews", reservation.id);
    await fs.mkdir(previewDirectory, { recursive: true });
    await fs.writeFile(
      path.join(previewDirectory, "payment-confirmation-customer-email.txt"),
      customerText,
      "utf8",
    );
    await fs.writeFile(
      path.join(previewDirectory, `${reservation.id}-paid-invoice.pdf`),
      Buffer.from(pdfBytes),
    );

    return {
      delivered: false,
      mode: "preview",
      previewDirectory,
    };
  }

  return {
    delivered: true,
    mode: "smtp",
  };
}

function buildBusinessInquiryEmail(inquiry: ContactInquiryEmailInput) {
  return [
    "New inquiry received",
    "",
    `Inquiry ID: ${inquiry.id}`,
    `Status: ${inquiry.status}`,
    `Submitted: ${inquiry.submittedAt}`,
    "",
    `Name: ${inquiry.fullName}`,
    `Email: ${inquiry.email}`,
    `Interested in: ${inquiry.interestedIn}`,
    "",
    "Message",
    inquiry.message,
  ].join("\n");
}

function buildCustomerInquiryEmail(inquiry: ContactInquiryEmailInput) {
  return [
    `Hello ${inquiry.firstName},`,
    "",
    "Thank you for contacting Ekeon Group.",
    "Your inquiry has been received and is currently pending review.",
    "We will get in touch as soon as we finish processing your request.",
    "",
    `Inquiry ID: ${inquiry.id}`,
    `Topic: ${inquiry.interestedIn}`,
    "",
    "Warm regards,",
    "Ekeon Group",
  ].join("\n");
}

export async function sendInquiryEmail(
  inquiry: ContactInquiryEmailInput,
): Promise<EmailResult> {
  const { host, user, pass, from, transporter } = createTransporter();

  const businessText = buildBusinessInquiryEmail(inquiry);
  const customerText = buildCustomerInquiryEmail(inquiry);

  if (!host || !user || !pass || !transporter) {
    const previewDirectory = getPreviewDirectory(
      "inquiry-mail-previews",
      inquiry.id,
    );
    await fs.mkdir(previewDirectory, { recursive: true });
    await fs.writeFile(
      path.join(previewDirectory, "internal-email.txt"),
      businessText,
      "utf8",
    );
    await fs.writeFile(
      path.join(previewDirectory, "customer-email.txt"),
      customerText,
      "utf8",
    );

    return {
      delivered: false,
      mode: "preview",
      previewDirectory,
    };
  }

  try {
    await transporter.sendMail({
      from,
      to: process.env.BOOKING_NOTIFICATION_EMAIL ?? CONTACT_EMAIL,
      replyTo: inquiry.email,
      subject: `New inquiry ${inquiry.id}`,
      text: businessText,
    });

    await transporter.sendMail({
      from,
      to: inquiry.email,
      subject: `Inquiry received: ${inquiry.id}`,
      text: customerText,
    });
  } catch {
    const previewDirectory = getPreviewDirectory(
      "inquiry-mail-previews",
      inquiry.id,
    );
    await fs.mkdir(previewDirectory, { recursive: true });
    await fs.writeFile(
      path.join(previewDirectory, "internal-email.txt"),
      businessText,
      "utf8",
    );
    await fs.writeFile(
      path.join(previewDirectory, "customer-email.txt"),
      customerText,
      "utf8",
    );

    return {
      delivered: false,
      mode: "preview",
      previewDirectory,
    };
  }

  return {
    delivered: true,
    mode: "smtp",
  };
}

function buildBusinessPartnerInquiryEmail(inquiry: PartnerInquiryEmailInput) {
  return [
    "New partnership inquiry received",
    "",
    `Inquiry ID: ${inquiry.id}`,
    `Submitted: ${inquiry.submittedAt}`,
    "",
    `Company name: ${inquiry.companyName}`,
    `Contact person: ${inquiry.contactPerson}`,
    `Work email: ${inquiry.email}`,
    `Primary destination: ${inquiry.primaryDestination}`,
    `WhatsApp: ${inquiry.whatsapp || "Not provided"}`,
    "",
    "Message",
    inquiry.message,
  ].join("\n");
}

function buildCustomerPartnerInquiryEmail(inquiry: PartnerInquiryEmailInput) {
  return [
    `Hello ${inquiry.contactPerson},`,
    "",
    "Thank you for your interest in partnering with Ekeon Group.",
    "Your partnership inquiry has been received successfully.",
    "Our partnership development team will review your details and contact you by email soon.",
    "",
    `Inquiry ID: ${inquiry.id}`,
    `Company: ${inquiry.companyName}`,
    `Primary destination: ${inquiry.primaryDestination}`,
    "",
    "Warm regards,",
    "Ekeon Group",
  ].join("\n");
}

export async function sendPartnerInquiryEmail(
  inquiry: PartnerInquiryEmailInput,
): Promise<EmailResult> {
  const { host, user, pass, from, transporter } = createTransporter();
  const businessText = buildBusinessPartnerInquiryEmail(inquiry);
  const customerText = buildCustomerPartnerInquiryEmail(inquiry);

  if (!host || !user || !pass || !transporter) {
    const previewDirectory = getPreviewDirectory(
      "partner-mail-previews",
      inquiry.id,
    );
    await fs.mkdir(previewDirectory, { recursive: true });
    await fs.writeFile(
      path.join(previewDirectory, "internal-email.txt"),
      businessText,
      "utf8",
    );
    await fs.writeFile(
      path.join(previewDirectory, "partner-email.txt"),
      customerText,
      "utf8",
    );

    return {
      delivered: false,
      mode: "preview",
      previewDirectory,
    };
  }

  try {
    await transporter.sendMail({
      from,
      to: process.env.BOOKING_NOTIFICATION_EMAIL ?? CONTACT_EMAIL,
      replyTo: inquiry.email,
      subject: `New partnership inquiry ${inquiry.id}`,
      text: businessText,
    });

    await transporter.sendMail({
      from,
      to: inquiry.email,
      subject: `Partnership inquiry received: ${inquiry.id}`,
      text: customerText,
    });
  } catch {
    const previewDirectory = getPreviewDirectory(
      "partner-mail-previews",
      inquiry.id,
    );
    await fs.mkdir(previewDirectory, { recursive: true });
    await fs.writeFile(
      path.join(previewDirectory, "internal-email.txt"),
      businessText,
      "utf8",
    );
    await fs.writeFile(
      path.join(previewDirectory, "partner-email.txt"),
      customerText,
      "utf8",
    );

    return {
      delivered: false,
      mode: "preview",
      previewDirectory,
    };
  }

  return {
    delivered: true,
    mode: "smtp",
  };
}

function buildArchivedReservationsExportEmail(
  input: ArchivedReservationsExportEmailInput,
) {
  return [
    "Archived reservations export ready",
    "",
    `Requested by: ${input.requestedByName} (${input.requestedByEmail})`,
    `Records exported: ${input.totalRecords}`,
    `Status filter: ${input.status || "all"}`,
    `Search filter: ${input.search?.trim() || "none"}`,
    "",
    "The CSV export is attached to this email.",
  ].join("\n");
}

export async function sendArchivedReservationsExportEmail(
  input: ArchivedReservationsExportEmailInput,
): Promise<EmailResult> {
  const { host, user, pass, from, transporter } = createTransporter();
  const businessText = buildArchivedReservationsExportEmail(input);
  const attachment = {
    filename: input.filename,
    content: Buffer.from(`\uFEFF${input.csvContent}`, "utf8"),
    contentType: "text/csv; charset=utf-8",
  };

  if (!host || !user || !pass || !transporter) {
    const previewDirectory = getPreviewDirectory(
      "mail-previews",
      "archive-exports",
      input.filename.replace(/\.csv$/i, ""),
    );
    await fs.mkdir(previewDirectory, { recursive: true });
    await fs.writeFile(
      path.join(previewDirectory, "internal-email.txt"),
      businessText,
      "utf8",
    );
    await fs.writeFile(
      path.join(previewDirectory, input.filename),
      `\uFEFF${input.csvContent}`,
      "utf8",
    );

    return {
      delivered: false,
      mode: "preview",
      previewDirectory,
    };
  }

  try {
    await transporter.sendMail({
      from,
      to: process.env.BOOKING_NOTIFICATION_EMAIL ?? CONTACT_EMAIL,
      replyTo: input.requestedByEmail,
      subject: `Archived reservations export - ${input.totalRecords} record(s)`,
      text: businessText,
      attachments: [attachment],
    });
  } catch {
    const previewDirectory = getPreviewDirectory(
      "mail-previews",
      "archive-exports",
      input.filename.replace(/\.csv$/i, ""),
    );
    await fs.mkdir(previewDirectory, { recursive: true });
    await fs.writeFile(
      path.join(previewDirectory, "internal-email.txt"),
      businessText,
      "utf8",
    );
    await fs.writeFile(
      path.join(previewDirectory, input.filename),
      `\uFEFF${input.csvContent}`,
      "utf8",
    );

    return {
      delivered: false,
      mode: "preview",
      previewDirectory,
    };
  }

  return {
    delivered: true,
    mode: "smtp",
  };
}
