import { useAtom, useAtomValue } from "jotai";
import {
  ImageData,
  ImageVariant,
  imagesOutputAtom,
  previewAtom,
} from "../../atoms";
import { useClickOutside } from "../../hooks/useClickOutside";
import { ChevronLeft, ChevronRight, X } from "../Icons";

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

function ImageVariantButton({
  variant,
  image,
  isSelected,
  onClick,
}: {
  variant: ImageVariant;
  image: ImageData;
  isSelected: boolean;
  onClick: () => void;
}) {
  const imageData =
    variant === "converted"
      ? image.convertedFile
      : variant === "thumbnail"
      ? image.thumbnail
      : image.icon;

  if (!imageData) return null;

  const sizeText = `${imageData.width}×${imageData.height}px (${formatBytes(
    imageData.size
  )})`;
  const label =
    variant === "converted"
      ? "Full Size"
      : variant === "thumbnail"
      ? "Thumbnail"
      : "Icon";

  return (
    <div className="text-center">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
        {label}
        <span className="block text-xs opacity-75">{sizeText}</span>
      </p>
      <button
        onClick={onClick}
        className={`relative rounded-lg overflow-hidden transition-transform hover:scale-105 ${
          isSelected ? "ring-2 ring-blue-500" : ""
        }`}
      >
        <img
          src={imageData.url}
          alt={label}
          className="object-cover w-[36px] h-[36px] rounded-3xl"
        />
      </button>
    </div>
  );
}

export function Lightbox() {
  const [preview, setPreview] = useAtom(previewAtom);
  const images = useAtomValue(imagesOutputAtom);
  const currentImage = images[preview.currentIndex];

  const handleClose = () => {
    setPreview({
      isOpen: false,
      currentIndex: 0,
      selectedVariant: "converted",
    });
  };

  const handlePrevious = () => {
    setPreview((prev) => ({
      ...prev,
      currentIndex:
        prev.currentIndex > 0 ? prev.currentIndex - 1 : images.length - 1,
    }));
  };

  const handleNext = () => {
    setPreview((prev) => ({
      ...prev,
      currentIndex:
        prev.currentIndex < images.length - 1 ? prev.currentIndex + 1 : 0,
    }));
  };

  const handleSelectVariant = (variant: ImageVariant) => {
    setPreview((prev) => ({ ...prev, selectedVariant: variant }));
  };

  const ref = useClickOutside(handleClose);

  if (!preview.isOpen || !currentImage) return null;

  const selectedImage =
    preview.selectedVariant === "converted"
      ? currentImage.convertedFile
      : preview.selectedVariant === "thumbnail"
      ? currentImage.thumbnail
      : currentImage.icon;

  if (!selectedImage) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
      <div
        ref={ref}
        className="relative bg-white dark:bg-gray-900 p-4 rounded-lg max-w-[90vw] max-h-[90vh] flex flex-col"
      >
        <button
          onClick={handleClose}
          className="absolute top-0 right-0 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="relative flex-1 flex items-center justify-center min-h-[300px]">
          <button
            onClick={handlePrevious}
            className="absolute left-0 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="relative group min-w-[600px] min-h-[400px] flex items-center">
            <img
              src={selectedImage.url}
              alt={currentImage.originalFile.name}
              className="max-w-full max-h-[70vh] object-contain h-full m-auto"
            />
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50 text-white text-center text-sm opacity-0 group-hover:opacity-100 transition-opacity">
              {selectedImage.width}×{selectedImage.height}px (
              {formatBytes(selectedImage.size)})
            </div>
          </div>

          <button
            onClick={handleNext}
            className="absolute right-0 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        <div className="mt-4 flex justify-around gap-4">
          <ImageVariantButton
            variant="converted"
            image={currentImage}
            isSelected={preview.selectedVariant === "converted"}
            onClick={() => handleSelectVariant("converted")}
          />
          {currentImage.thumbnail && (
            <ImageVariantButton
              variant="thumbnail"
              image={currentImage}
              isSelected={preview.selectedVariant === "thumbnail"}
              onClick={() => handleSelectVariant("thumbnail")}
            />
          )}
          {currentImage.icon && (
            <ImageVariantButton
              variant="icon"
              image={currentImage}
              isSelected={preview.selectedVariant === "icon"}
              onClick={() => handleSelectVariant("icon")}
            />
          )}
        </div>
      </div>
    </div>
  );
}
