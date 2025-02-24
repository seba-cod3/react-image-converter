import { useAtomValue } from "jotai";
import { imagesOutputAtom } from "../../atoms";

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

export const Output = () => {
  const imagesOutput = useAtomValue(imagesOutputAtom);

  return (
    <div className="output border rounded-2xl dark:border-gray-800 w-full p-4">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] gap-4 max-w-[900px] mx-auto">
        {imagesOutput.map((image, index) => (
          <div
            key={index}
            className="flex flex-col border dark:border-gray-700 rounded-lg overflow-hidden"
          >
            <div className="relative h-[200px]">
              <img
                src={image.convertedFile.url}
                className="w-full h-full object-cover"
                alt={image.originalFile.name}
              />
            </div>

            <div className="p-3 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <div
                  className="font-medium truncate"
                  title={image.originalFile.name}
                >
                  {image.originalFile.name}
                </div>
                <div className="text-gray-500">
                  {formatDate(image.originalFile.createdAt)}
                </div>
              </div>

              <div className="space-y-1 text-gray-600 dark:text-gray-400">
                <div className="flex justify-between">
                  <span>Original:</span>
                  <span>{image.originalFile.extension.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Size:</span>
                  <span>{formatBytes(image.originalFile.size)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Dimensions:</span>
                  <span>
                    {image.originalFile.width}×{image.originalFile.height}
                  </span>
                </div>
              </div>

              <div className="border-t dark:border-gray-700 my-2" />

              <div className="space-y-1 text-gray-600 dark:text-gray-400">
                <div className="flex justify-between">
                  <span>Converted:</span>
                  <span>{image.convertedFile.extension.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Size:</span>
                  <span>{formatBytes(image.convertedFile.size)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Dimensions:</span>
                  <span>
                    {image.convertedFile.width}×{image.convertedFile.height}
                  </span>
                </div>
              </div>

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
    </div>
  );
};
