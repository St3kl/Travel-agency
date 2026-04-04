export type PartnerInquiryFormState = {
  success: boolean;
  message: string;
  inquiryId?: string;
  emailMode?: "smtp" | "preview";
  previewPath?: string;
  fieldErrors?: Partial<Record<string, string[]>>;
};

export const initialPartnerInquiryState: PartnerInquiryFormState = {
  success: false,
  message: "",
};
