import { CONTACT_EMAIL } from "@/lib/contact";

export const COMPANY_PAYMENT_DETAILS = {
  accountName: process.env.COMPANY_ACCOUNT_NAME ?? "Ekeon Group",
  bankName: process.env.COMPANY_BANK_NAME ?? "Company Bank",
  accountNumber: process.env.COMPANY_ACCOUNT_NUMBER ?? "Not configured",
  branchCode: process.env.COMPANY_BRANCH_CODE ?? "Not configured",
  swiftCode: process.env.COMPANY_SWIFT_CODE ?? "Not configured",
  paymentProofEmail: process.env.COMPANY_PAYMENT_PROOF_EMAIL ?? CONTACT_EMAIL,
};
