export type ArchiveExportActionState = {
  success: boolean;
  message: string;
};

export const initialArchiveExportActionState: ArchiveExportActionState = {
  success: false,
  message: "",
};
