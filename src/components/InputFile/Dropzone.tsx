import { useAtomValue, useSetAtom } from "jotai";
import {
  ImageData,
  generateExtraSizesAtom,
  imagesOutputAtom,
  maxAssetSizeAtom,
  outputExtensionAtom,
} from "../../atoms";
import { imageCompressor } from "../../lib/imageCompressor";
import { DROPZONE_PORTAL_ID } from "./constants";

export default function Dropzone() {
  const setImagesOutput = useSetAtom(imagesOutputAtom);
  const maxAssetSize = useAtomValue(maxAssetSizeAtom);
  const generateExtraSizes = useAtomValue(generateExtraSizesAtom);
  const outputExtension = useAtomValue(outputExtensionAtom);

  function handleSelectFile() {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = (e) => {
      if (e.target) {
        const target = e.target as HTMLInputElement;
        const file = target.files && target.files[0];
        if (file) {
          processImageHandler(file);
        }
      }
    };
    fileInput.click();
  }

  function handleDragOver(e: React.DragEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
  }

  function handleDrop(e: React.DragEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file) {
      processImageHandler(file);
    }
  }

  function processImageHandler(file: File) {
    if (!file) {
      throw new Error("Something went wrong: DPZ_PIM_001");
    }
    const reader = new FileReader();
    reader.onload = async (e) => {
      const image = e.target?.result as ArrayBuffer;
      const setCompressedImage = (imageData: ImageData) => {
        imageData.originalFile.name = file.name.split(".")[0];
        imageData.originalFile.extension = file.name.split(".").pop() || "";
        setImagesOutput((prev) => [...prev, imageData]);
      };
      await imageCompressor(image, setCompressedImage, {
        maxAssetSize,
        generateExtraSizes,
        outputExtension,
      });
    };
    reader.readAsArrayBuffer(file);
  }

  return (
    <button
      onClick={handleSelectFile}
      className="w-full h-full border dark:border-red-200 m-2 rounded-xl max-w-[450px] min-h-[260px]"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <div id={DROPZONE_PORTAL_ID} />
    </button>
  );
}
