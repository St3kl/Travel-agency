export type InquiryFormState = {
  success: boolean;
  message: string;
  inquiryId?: string;
  emailMode?: "smtp" | "preview";
  previewPath?: string;
  fieldErrors?: Partial<Record<string, string[]>>;
};

export const initialInquiryState: InquiryFormState = {
  success: false,
  message: "",
};
