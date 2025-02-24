import { useAtomValue, useSetAtom } from "jotai";
import { imagesOutputAtom, previewAtom } from "../../atoms";
import { Lightbox } from "../Lightbox/Lightbox";

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getCompressedPercent = (originalSize: number, convertedSize: number) => {
  const floatingValue = ((originalSize - convertedSize) / originalSize) * 100;
  return floatingValue.toFixed(2);
};

const getDimensionOffset = (
  originalWidth: number,
  originalHeight: number,
  convertedWidth: number,
  convertedHeight: number
) => {
  // only 2 digits
  return {
    width: Number((originalWidth - convertedWidth).toFixed(2)),
    height: Number((originalHeight - convertedHeight).toFixed(2)),
  };
};

export const Output = () => {
  const imagesOutput = useAtomValue(imagesOutputAtom);
  const setPreview = useSetAtom(previewAtom);

  const handlePreview = (index: number) => {
    setPreview({
      isOpen: true,
      currentIndex: index,
      selectedVariant: "converted",
    });
  };

  return (
    <div className="output border rounded-2xl dark:border-gray-800 w-full p-4">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] gap-4 max-w-[900px] mx-auto">
        {imagesOutput.map((image, index) => (
          <div
            key={index}
            className="flex flex-col border dark:border-gray-700 rounded-lg overflow-hidden"
          >
            <button
              onClick={() => handlePreview(index)}
              className="relative h-[200px] overflow-hidden group"
            >
              <img
                src={image.convertedFile.url}
                className="w-full h-full object-cover transition-transform group-hover:scale-110"
                alt={image.originalFile.name}
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white">Preview</span>
              </div>
            </button>

            <div className="p-3 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <div
                  className="font-medium truncate max-w-[200px]"
                  title={image.originalFile.name}
                >
                  {image.originalFile.name}
                </div>
                <div className="text-gray-500 min-w-max">
                  {formatDate(image.originalFile.createdAt)}
                </div>
              </div>

              <FileInfo
                size={image.originalFile.size}
                dimension={`${image.originalFile.width}×${image.originalFile.height}`}
                extension={image.originalFile.extension.toUpperCase()}
              />

              <div className="border-t dark:border-gray-700 my-2" />
              <FileInfo
                size={image.convertedFile.size}
                getDimensionOffset={getDimensionOffset(
                  image.originalFile.width,
                  image.originalFile.height,
                  image.convertedFile.width,
                  image.convertedFile.height
                )}
                dimension={`${image.convertedFile.width}×${image.convertedFile.height}`}
                extension={image.convertedFile.extension.toUpperCase()}
                isCompressed
                compressedPercent={getCompressedPercent(
                  image.originalFile.size,
                  image.convertedFile.size
                )}
              />

              {(image.thumbnail || image.icon) && (
                <>
                  <div className="border-t dark:border-gray-700 my-2" />
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <div className="space-y-1">
                      <div className="text-xs">150×150 px</div>
                      {image.thumbnail && (
                        <div>{formatBytes(image.thumbnail.size)}</div>
                      )}
                    </div>
                    <div className="space-y-1 text-right">
                      <div className="text-xs">50×50 px</div>
                      {image.icon && <div>{formatBytes(image.icon.size)}</div>}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      <Lightbox />
    </div>
  );
};

const getReducedColor = (compressedPercent: string) => {
  const colorScale = [
    "dark:text-red-600",
    "dark:text-orange-600",
    "dark:text-yellow-600",
    "dark:text-green-600",
    "dark:text-violet-600",
  ];
  const index = Math.round(Number(compressedPercent) / 20);
  return colorScale[index - 1] ? colorScale[index - 1] : colorScale[0];
};

function FileInfo({
  size,
  dimension,
  extension,
  isCompressed,
  compressedPercent,
  getDimensionOffset,
}: {
  size: number;
  dimension: string;
  extension: string;
  isCompressed?: boolean;
  compressedPercent?: string;
  getDimensionOffset?: {
    width: number;
    height: number;
  };
}) {
  return (
    <div className="flex justify-between">
      <div className="space-y-1 text-gray-600 dark:text-gray-400 text-right">
        <div className="text-xs text-left">
          {isCompressed ? "" : "original size"}
          {compressedPercent && (
            <>
              <span className={getReducedColor(compressedPercent)}>
                {compressedPercent}%
              </span>
              {isCompressed ? " reduction" : ""}
            </>
          )}
        </div>
        <div className="text text-left">{extension}</div>
      </div>

      <div className="space-y-1 text-gray-600 dark:text-gray-400 text-right">
        <div className="text-xs">
          {!getDimensionOffset ? (
            dimension
          ) : !getDimensionOffset.width && !getDimensionOffset.height ? (
            <span className="text-gray-400 dark:text-gray-600">
              Original size
            </span>
          ) : (
            `${getDimensionOffset.width}×${getDimensionOffset.height} px`
          )}
        </div>
        {size && <div>{formatBytes(size)}</div>}
      </div>
    </div>
  );
}

{
  /* <span className="text-gray-400 dark:text-green-600"> */
}
