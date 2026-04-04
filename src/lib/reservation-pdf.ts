import {
  PDFDocument,
  StandardFonts,
  degrees,
  rgb,
  type PDFFont,
  type PDFPage,
} from "pdf-lib";

import { COMPANY_PAYMENT_DETAILS } from "@/lib/company-payment";
import type { ReservationRecord } from "@/lib/reservations";

const PAGE_WIDTH = 595;
const PAGE_HEIGHT = 842;
const PAGE_MARGIN = 42;
const HEADER_HEIGHT = 112;
const FOOTER_HEIGHT = 34;
const CONTENT_TOP = PAGE_HEIGHT - HEADER_HEIGHT - 28;
const CONTENT_BOTTOM = PAGE_MARGIN + FOOTER_HEIGHT + 12;

const BRAND_NAVY = rgb(0.06, 0.12, 0.19);
const BRAND_GOLD = rgb(0.77, 0.63, 0.23);
const BRAND_SAND = rgb(0.97, 0.95, 0.9);
const BRAND_BORDER = rgb(0.85, 0.82, 0.75);
const TEXT_PRIMARY = rgb(0.12, 0.16, 0.23);
const TEXT_MUTED = rgb(0.4, 0.44, 0.51);
const SUCCESS_GREEN = rgb(0.16, 0.46, 0.33);
const WARNING_AMBER = rgb(0.57, 0.39, 0.04);

type InvoiceVariant = "proforma" | "paid";

type InvoicePdfContext = {
  pdf: PDFDocument;
  page: PDFPage;
  regular: PDFFont;
  bold: PDFFont;
  y: number;
  variant: InvoiceVariant;
  reservation: ReservationRecord;
  pageNumber: number;
};

type TextOptions = {
  x: number;
  y: number;
  size?: number;
  font?: PDFFont;
  color?: ReturnType<typeof rgb>;
  align?: "left" | "right" | "center";
  maxWidth?: number;
  opacity?: number;
  rotateDegrees?: number;
};

function formatDate(value?: string) {
  if (!value) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function formatDateTime(value?: string) {
  if (!value) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatCurrency(currency: string | undefined, amount: number | undefined) {
  return `${currency ?? "USD"} ${(amount ?? 0).toFixed(2)}`;
}

function wrapText(
  text: string,
  font: PDFFont,
  size: number,
  maxWidth: number,
) {
  if (!text.trim()) {
    return [""];
  }

  const paragraphs = text.split("\n");
  const lines: string[] = [];

  for (const paragraph of paragraphs) {
    const words = paragraph.trim().split(/\s+/).filter(Boolean);

    if (words.length === 0) {
      lines.push("");
      continue;
    }

    let currentLine = words[0];

    for (let index = 1; index < words.length; index += 1) {
      const candidate = `${currentLine} ${words[index]}`;
      if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
        currentLine = candidate;
        continue;
      }

      lines.push(currentLine);
      currentLine = words[index];
    }

    lines.push(currentLine);
  }

  return lines;
}

function drawTextLine(
  page: PDFPage,
  text: string,
  {
    x,
    y,
    size = 10,
    font,
    color = TEXT_PRIMARY,
    align = "left",
    opacity = 1,
    rotateDegrees,
  }: TextOptions,
) {
  const selectedFont = font;

  if (!selectedFont) {
    throw new Error("Font is required when drawing PDF text.");
  }

  const width = selectedFont.widthOfTextAtSize(text, size);
  const drawX =
    align === "right"
      ? x - width
      : align === "center"
        ? x - width / 2
        : x;

  page.drawText(text, {
    x: drawX,
    y,
    size,
    font: selectedFont,
    color,
    opacity,
    rotate: rotateDegrees ? degrees(rotateDegrees) : undefined,
  });
}

function drawWrappedText(
  page: PDFPage,
  text: string,
  options: TextOptions & { lineHeight?: number },
) {
  const {
    x,
    y,
    size = 10,
    font,
    maxWidth = PAGE_WIDTH - PAGE_MARGIN * 2,
    lineHeight = size + 4,
    color = TEXT_PRIMARY,
  } = options;

  const selectedFont = font;

  if (!selectedFont) {
    throw new Error("Font is required when drawing wrapped PDF text.");
  }

  const lines = wrapText(text, selectedFont, size, maxWidth);
  let nextY = y;

  for (const line of lines) {
    drawTextLine(page, line, {
      x,
      y: nextY,
      size,
      font: selectedFont,
      color,
      maxWidth,
    });
    nextY -= lineHeight;
  }

  return nextY;
}

async function createPdfCanvas(title: string, subtitle: string) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  let y = PAGE_HEIGHT - 52;

  const draw = (
    text: string,
    size = 11,
    isBold = false,
    color = TEXT_PRIMARY,
  ) => {
    page.drawText(text, {
      x: 48,
      y,
      size,
      font: isBold ? bold : font,
      color,
    });
    y -= size + 7;
  };

  draw(title, 22, true, BRAND_NAVY);
  draw(subtitle, 12, true, BRAND_GOLD);
  y -= 8;

  return { pdf, draw };
}

function drawPageChrome(context: InvoicePdfContext, title: string, subtitle: string) {
  const { page, regular, bold, variant, pageNumber } = context;
  const statusLabel = variant === "paid" ? "PAID" : "PROFORMA";
  const statusFill = variant === "paid" ? SUCCESS_GREEN : WARNING_AMBER;
  const watermark = variant === "paid" ? "PAID" : "PROFORMA";

  page.drawRectangle({
    x: 0,
    y: 0,
    width: PAGE_WIDTH,
    height: PAGE_HEIGHT,
    color: rgb(1, 1, 1),
  });

  page.drawRectangle({
    x: 0,
    y: PAGE_HEIGHT - HEADER_HEIGHT,
    width: PAGE_WIDTH,
    height: HEADER_HEIGHT,
    color: BRAND_NAVY,
  });

  page.drawRectangle({
    x: PAGE_MARGIN,
    y: PAGE_HEIGHT - HEADER_HEIGHT,
    width: 120,
    height: 6,
    color: BRAND_GOLD,
  });

  page.drawRectangle({
    x: PAGE_MARGIN,
    y: PAGE_MARGIN + FOOTER_HEIGHT,
    width: PAGE_WIDTH - PAGE_MARGIN * 2,
    height: 1,
    color: BRAND_BORDER,
  });

  page.drawText("EKEON GROUP", {
    x: PAGE_MARGIN,
    y: PAGE_HEIGHT - 48,
    size: 22,
    font: bold,
    color: rgb(1, 1, 1),
  });
  page.drawText("Curated global journeys and private travel design", {
    x: PAGE_MARGIN,
    y: PAGE_HEIGHT - 68,
    size: 10,
    font: regular,
    color: rgb(0.9, 0.92, 0.95),
  });
  page.drawText(title, {
    x: PAGE_MARGIN,
    y: PAGE_HEIGHT - 95,
    size: 18,
    font: bold,
    color: rgb(1, 1, 1),
  });
  page.drawText(subtitle, {
    x: PAGE_MARGIN,
    y: PAGE_HEIGHT - 114,
    size: 9,
    font: regular,
    color: rgb(0.88, 0.9, 0.93),
  });

  const pillWidth = 88;
  const pillHeight = 24;
  const pillX = PAGE_WIDTH - PAGE_MARGIN - pillWidth;
  const pillY = PAGE_HEIGHT - 58;
  page.drawRectangle({
    x: pillX,
    y: pillY,
    width: pillWidth,
    height: pillHeight,
    color: statusFill,
    borderColor: rgb(1, 1, 1),
    borderWidth: 0.5,
  });
  drawTextLine(page, statusLabel, {
    x: pillX + pillWidth / 2,
    y: pillY + 7,
    size: 10,
    font: bold,
    color: rgb(1, 1, 1),
    align: "center",
  });

  drawTextLine(page, watermark, {
    x: PAGE_WIDTH / 2,
    y: PAGE_HEIGHT / 2 - 40,
    size: 72,
    font: bold,
    color: variant === "paid" ? SUCCESS_GREEN : BRAND_GOLD,
    align: "center",
    opacity: 0.08,
    rotateDegrees: 34,
  });

  page.drawText(`Generated by Ekeon Group | Page ${pageNumber}`, {
    x: PAGE_MARGIN,
    y: PAGE_MARGIN + 12,
    size: 8,
    font: regular,
    color: TEXT_MUTED,
  });
}

function addInvoicePage(context: InvoicePdfContext, title: string, subtitle: string) {
  context.page = context.pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  context.pageNumber += 1;
  context.y = CONTENT_TOP;
  drawPageChrome(context, title, subtitle);
}

function ensureSpace(
  context: InvoicePdfContext,
  neededHeight: number,
  title: string,
  subtitle: string,
) {
  if (context.y - neededHeight >= CONTENT_BOTTOM) {
    return;
  }

  addInvoicePage(context, title, subtitle);
}

function drawCard(
  context: InvoicePdfContext,
  options: {
    x: number;
    y: number;
    width: number;
    height: number;
    title: string;
    rows: Array<{ label: string; value: string }>;
  },
) {
  const { page, regular, bold } = context;
  const { x, y, width, height, title, rows } = options;

  page.drawRectangle({
    x,
    y: y - height,
    width,
    height,
    color: rgb(1, 1, 1),
    borderColor: BRAND_BORDER,
    borderWidth: 1,
  });

  page.drawRectangle({
    x,
    y: y - 26,
    width,
    height: 26,
    color: BRAND_SAND,
  });

  drawTextLine(page, title.toUpperCase(), {
    x: x + 14,
    y: y - 17,
    size: 9,
    font: bold,
    color: BRAND_NAVY,
  });

  let lineY = y - 42;

  for (const row of rows) {
    drawTextLine(page, row.label, {
      x: x + 14,
      y: lineY,
      size: 8,
      font: bold,
      color: TEXT_MUTED,
    });

    const nextY = drawWrappedText(page, row.value, {
      x: x + 14,
      y: lineY - 12,
      size: 10,
      font: regular,
      color: TEXT_PRIMARY,
      maxWidth: width - 28,
      lineHeight: 12,
    });

    lineY = nextY - 6;
  }
}

function drawTableHeader(context: InvoicePdfContext) {
  const { page, bold } = context;

  page.drawRectangle({
    x: PAGE_MARGIN,
    y: context.y - 20,
    width: PAGE_WIDTH - PAGE_MARGIN * 2,
    height: 22,
    color: BRAND_NAVY,
  });

  drawTextLine(page, "DESCRIPTION", {
    x: PAGE_MARGIN + 14,
    y: context.y - 13,
    size: 9,
    font: bold,
    color: rgb(1, 1, 1),
  });

  drawTextLine(page, "AMOUNT", {
    x: PAGE_WIDTH - PAGE_MARGIN - 14,
    y: context.y - 13,
    size: 9,
    font: bold,
    color: rgb(1, 1, 1),
    align: "right",
  });

  context.y -= 30;
}

function drawInvoiceRow(
  context: InvoicePdfContext,
  description: string,
  amount: string,
  rowIndex: number,
  title: string,
  subtitle: string,
) {
  ensureSpace(context, 38, title, subtitle);

  const { page, regular, bold } = context;
  const lineHeight = 12;
  const descriptionLines = wrapText(description, regular, 10, 340);
  const rowHeight = Math.max(28, descriptionLines.length * lineHeight + 10);

  ensureSpace(context, rowHeight + 10, title, subtitle);

  const background = rowIndex % 2 === 0 ? rgb(0.985, 0.985, 0.985) : rgb(1, 1, 1);
  page.drawRectangle({
    x: PAGE_MARGIN,
    y: context.y - rowHeight + 4,
    width: PAGE_WIDTH - PAGE_MARGIN * 2,
    height: rowHeight,
    color: background,
    borderColor: BRAND_BORDER,
    borderWidth: 0.4,
  });

  let textY = context.y - 12;
  for (const line of descriptionLines) {
    drawTextLine(page, line, {
      x: PAGE_MARGIN + 14,
      y: textY,
      size: 10,
      font: regular,
      color: TEXT_PRIMARY,
    });
    textY -= lineHeight;
  }

  drawTextLine(page, amount, {
    x: PAGE_WIDTH - PAGE_MARGIN - 14,
    y: context.y - 12,
    size: 10,
    font: bold,
    color: TEXT_PRIMARY,
    align: "right",
  });

  context.y -= rowHeight + 6;
}

async function buildStyledInvoicePdf(
  reservation: ReservationRecord,
  variant: InvoiceVariant,
) {
  const pdf = await PDFDocument.create();
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const title =
    variant === "paid" ? "Paid Invoice Confirmation" : "Proforma Invoice";
  const subtitle = `Reservation ${reservation.id}`;
  const context: InvoicePdfContext = {
    pdf,
    page: pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]),
    regular,
    bold,
    y: CONTENT_TOP,
    variant,
    reservation,
    pageNumber: 1,
  };

  drawPageChrome(context, title, subtitle);

  drawCard(context, {
    x: PAGE_MARGIN,
    y: context.y,
    width: 244,
    height: 130,
    title: "Billed to",
    rows: [
      { label: "Lead traveler", value: reservation.fullName },
      { label: "Email", value: reservation.email },
      { label: "WhatsApp", value: reservation.whatsapp },
      { label: "Country", value: reservation.country },
    ],
  });

  drawCard(context, {
    x: PAGE_WIDTH - PAGE_MARGIN - 244,
    y: context.y,
    width: 244,
    height: 130,
    title: "Invoice details",
    rows: [
      { label: "Invoice status", value: variant === "paid" ? "Paid" : "Pending payment" },
      { label: "Currency", value: reservation.invoiceCurrency ?? "USD" },
      {
        label: "Invoice date",
        value: formatDate(reservation.invoiceIssuedAt ?? reservation.updatedAt),
      },
      {
        label: variant === "paid" ? "Payment confirmed" : "Payment due",
        value:
          variant === "paid"
            ? formatDateTime(reservation.paymentConfirmedAt ?? reservation.updatedAt)
            : formatDate(reservation.invoiceDueDate),
      },
    ],
  });

  context.y -= 152;

  drawCard(context, {
    x: PAGE_MARGIN,
    y: context.y,
    width: PAGE_WIDTH - PAGE_MARGIN * 2,
    height: 100,
    title: "Travel overview",
    rows: [
      {
        label: "Reservation summary",
        value: `${reservation.destination} | ${reservation.experience}`,
      },
      {
        label: "Travel window",
        value: `${reservation.travelDate} | ${reservation.duration} | ${reservation.guestCount} guest(s)`,
      },
      {
        label: "Accommodation and budget",
        value: `${reservation.accommodation} | ${reservation.budget}`,
      },
    ],
  });

  context.y -= 132;

  drawTextLine(context.page, "Invoice breakdown", {
    x: PAGE_MARGIN,
    y: context.y,
    size: 14,
    font: bold,
    color: BRAND_NAVY,
  });
  context.y -= 20;
  drawTableHeader(context);

  for (const [index, item] of (reservation.invoiceItems ?? []).entries()) {
    drawInvoiceRow(
      context,
      item.description,
      formatCurrency(reservation.invoiceCurrency, item.amount),
      index,
      title,
      subtitle,
    );
  }

  context.y -= 12;
  ensureSpace(context, 120, title, subtitle);

  const totalsBoxWidth = 180;
  const totalsBoxHeight = 82;
  const totalsX = PAGE_WIDTH - PAGE_MARGIN - totalsBoxWidth;
  const totalsY = context.y - 12;
  context.page.drawRectangle({
    x: totalsX,
    y: totalsY - totalsBoxHeight,
    width: totalsBoxWidth,
    height: totalsBoxHeight,
    color: BRAND_SAND,
    borderColor: BRAND_BORDER,
    borderWidth: 1,
  });

  drawTextLine(context.page, "TOTAL DUE", {
    x: totalsX + 16,
    y: totalsY - 20,
    size: 9,
    font: bold,
    color: TEXT_MUTED,
  });

  drawTextLine(
    context.page,
    formatCurrency(reservation.invoiceCurrency, reservation.invoiceTotal),
    {
      x: totalsX + totalsBoxWidth - 16,
      y: totalsY - 48,
      size: 18,
      font: bold,
      color: variant === "paid" ? SUCCESS_GREEN : BRAND_NAVY,
      align: "right",
    },
  );

  context.y -= totalsBoxHeight + 18;

  ensureSpace(context, 170, title, subtitle);

  const noteBoxHeight = variant === "paid" ? 126 : 156;
  context.page.drawRectangle({
    x: PAGE_MARGIN,
    y: context.y - noteBoxHeight,
    width: PAGE_WIDTH - PAGE_MARGIN * 2,
    height: noteBoxHeight,
    color: rgb(1, 1, 1),
    borderColor: BRAND_BORDER,
    borderWidth: 1,
  });

  drawTextLine(context.page, variant === "paid" ? "Payment confirmation" : "Payment instructions", {
    x: PAGE_MARGIN + 14,
    y: context.y - 18,
    size: 11,
    font: bold,
    color: BRAND_NAVY,
  });

  let bodyY = context.y - 38;

  if (variant === "paid") {
    bodyY = drawWrappedText(
      context.page,
      "This invoice has been marked as paid in full. We have successfully received and verified your payment proof, and our operations team will now continue with the next booking steps.",
      {
        x: PAGE_MARGIN + 14,
        y: bodyY,
        size: 10,
        font: regular,
        color: TEXT_PRIMARY,
        maxWidth: PAGE_WIDTH - PAGE_MARGIN * 2 - 28,
        lineHeight: 14,
      },
    );

    bodyY -= 4;
    drawTextLine(context.page, "Verified by", {
      x: PAGE_MARGIN + 14,
      y: bodyY,
      size: 8,
      font: bold,
      color: TEXT_MUTED,
    });
    drawTextLine(context.page, reservation.paymentConfirmedByName ?? reservation.processedByName ?? "Ekeon Group Finance Team", {
      x: PAGE_MARGIN + 14,
      y: bodyY - 14,
      size: 10,
      font: regular,
      color: TEXT_PRIMARY,
    });

    drawTextLine(context.page, "Verification date", {
      x: PAGE_MARGIN + 250,
      y: bodyY,
      size: 8,
      font: bold,
      color: TEXT_MUTED,
    });
    drawTextLine(context.page, formatDateTime(reservation.paymentConfirmedAt ?? reservation.updatedAt), {
      x: PAGE_MARGIN + 250,
      y: bodyY - 14,
      size: 10,
      font: regular,
      color: TEXT_PRIMARY,
    });
  } else {
    bodyY = drawWrappedText(
      context.page,
      "Please transfer the total amount to the company account below and reply to our email with your proof of payment. Once your payment has been verified, we will confirm receipt and proceed with the next stage of your booking.",
      {
        x: PAGE_MARGIN + 14,
        y: bodyY,
        size: 10,
        font: regular,
        color: TEXT_PRIMARY,
        maxWidth: PAGE_WIDTH - PAGE_MARGIN * 2 - 28,
        lineHeight: 14,
      },
    );

    bodyY -= 6;
    const details = [
      `Account name: ${COMPANY_PAYMENT_DETAILS.accountName}`,
      `Bank name: ${COMPANY_PAYMENT_DETAILS.bankName}`,
      `Account number: ${COMPANY_PAYMENT_DETAILS.accountNumber}`,
      `Branch code: ${COMPANY_PAYMENT_DETAILS.branchCode}`,
      `SWIFT code: ${COMPANY_PAYMENT_DETAILS.swiftCode}`,
      `Proof of payment email: ${COMPANY_PAYMENT_DETAILS.paymentProofEmail}`,
    ];

    for (const detail of details) {
      drawTextLine(context.page, detail, {
        x: PAGE_MARGIN + 14,
        y: bodyY,
        size: 9,
        font: regular,
        color: TEXT_PRIMARY,
      });
      bodyY -= 13;
    }
  }

  if (reservation.invoiceNote) {
    ensureSpace(context, 92, title, subtitle);
    context.y = Math.min(context.y, bodyY - 12);
    context.page.drawRectangle({
      x: PAGE_MARGIN,
      y: context.y - 74,
      width: PAGE_WIDTH - PAGE_MARGIN * 2,
      height: 74,
      color: BRAND_SAND,
      borderColor: BRAND_BORDER,
      borderWidth: 1,
    });

    drawTextLine(context.page, "Finance note", {
      x: PAGE_MARGIN + 14,
      y: context.y - 18,
      size: 10,
      font: bold,
      color: BRAND_NAVY,
    });

    drawWrappedText(context.page, reservation.invoiceNote, {
      x: PAGE_MARGIN + 14,
      y: context.y - 36,
      size: 10,
      font: regular,
      color: TEXT_PRIMARY,
      maxWidth: PAGE_WIDTH - PAGE_MARGIN * 2 - 28,
      lineHeight: 13,
    });
  }

  return pdf.save();
}

export async function buildReservationPdf(
  reservation: ReservationRecord,
): Promise<Uint8Array> {
  const { pdf, draw } = await createPdfCanvas(
    "Ekeon Group Reservation Summary",
    `Reservation ID: ${reservation.id}`,
  );

  const rows = [
    `Status: ${reservation.status}`,
    `Submitted: ${formatDateTime(reservation.submittedAt)}`,
    "",
    "Trip Details",
    `Destination: ${reservation.destination}`,
    `Experience: ${reservation.experience}`,
    `Travel date: ${reservation.travelDate}`,
    `Flexible dates: ${reservation.flexibleDates}`,
    `Duration: ${reservation.duration}`,
    `Guests: ${reservation.guestCount}`,
    `Budget: ${reservation.budget}`,
    `Accommodation: ${reservation.accommodation}`,
    "",
    "Traveler Details",
    `Lead traveler: ${reservation.fullName}`,
    `Email: ${reservation.email}`,
    `WhatsApp: ${reservation.whatsapp}`,
    `Country: ${reservation.country}`,
    `Preferred contact: ${reservation.preferredContact}`,
    `Special occasion: ${reservation.specialOccasion || "Not specified"}`,
    "",
    "Additional Notes",
    reservation.notes || "No additional notes provided.",
    "",
    "Your reservation is currently pending.",
    "We will contact you as soon as we finish processing your request.",
  ];

  for (const row of rows) {
    if (!row) {
      draw("", 1);
      continue;
    }

    const isHeader =
      row === "Trip Details" ||
      row === "Traveler Details" ||
      row === "Additional Notes";

    draw(row, isHeader ? 13 : 11, isHeader, BRAND_NAVY);
  }

  return pdf.save();
}

export async function buildReservationInvoicePdf(
  reservation: ReservationRecord,
): Promise<Uint8Array> {
  return buildStyledInvoicePdf(reservation, "proforma");
}

export async function buildReservationPaidInvoicePdf(
  reservation: ReservationRecord,
): Promise<Uint8Array> {
  return buildStyledInvoicePdf(reservation, "paid");
}
