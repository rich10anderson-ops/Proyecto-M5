import { uploadProductImage } from "./upload";

export const uploadImage = async (file: File): Promise<string> => {
  return uploadProductImage(file);
};
