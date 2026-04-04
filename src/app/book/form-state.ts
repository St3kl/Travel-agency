export type ReservationFormState = {
  success: boolean;
  message: string;
  reservationId?: string;
  emailMode?: "smtp" | "preview";
  previewPath?: string;
  whatsappMode?: "webhook" | "preview";
  fieldErrors?: Partial<Record<string, string[]>>;
};

export const initialReservationState: ReservationFormState = {
  success: false,
  message: "",
};
