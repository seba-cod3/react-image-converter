import { atom } from "jotai";

export type ImageSize = {
  url: string;
  extension: string;
  size: number;
  width: number;
  height: number;
};

export interface ImageData {
  originalFile: {
    name: string;
    extension: string;
    size: number;
    width: number;
    height: number;
    createdAt: Date;
  };
  convertedFile: ImageSize;
  thumbnail?: ImageSize;
  icon?: ImageSize;
}

export type MaxAssetSize = "1920x1080" | "1280x720";

export const maxAssetSizeAtom = atom<MaxAssetSize>("1920x1080");
export const generateExtraSizesAtom = atom<boolean>(false);
export const outputExtensionAtom = atom<"webp" | "jpeg">("webp");
export const imagesOutputAtom = atom<ImageData[]>([]);
