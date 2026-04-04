import type { Metadata } from "next";

import ContactInquiryForm from "@/app/contact/InquiryForm";

export const metadata: Metadata = {
  title: "Contact Ekeon Group | Travel Inquiries",
  description:
    "Send an inquiry to Ekeon Group and our team will get back to you after reviewing your request.",
};

export default function ContactPage() {
  return <ContactInquiryForm />;
}
