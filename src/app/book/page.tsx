import type { Metadata } from "next";

import ReservationForm from "@/app/book/ReservationForm";

export const metadata: Metadata = {
  title: "Reserve Your Experience | Ekeon Group",
  description:
    "Submit a reservation request for your next Ekeon Group journey. Requests are reviewed and confirmed manually by our team.",
};

export default function BookPage() {
  return <ReservationForm />;
}
