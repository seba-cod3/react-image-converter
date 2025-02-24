import { useAtom } from "jotai";
import { Suspense, lazy } from "react";
import {
  generateExtraSizesAtom,
  maxAssetSizeAtom,
  outputExtensionAtom,
} from "../../atoms";
import Dropzone from "./Dropzone";
const LazyInputPortal = lazy(() => import("./InputPortal"));

export const InputFile = () => {
  return (
    <div className="flex justify-between items-start gap-4">
      <div className="border rounded-2xl dark:border-gray-800 flex justify-center align-center w-min mx-auto">
        <Dropzone />
        <Suspense fallback={<div />}>
          <LazyInputPortal />
        </Suspense>
      </div>
      <div className="flex flex-col gap-4 min-w-[250px]">
        <FileOptions />
      </div>
    </div>
  );
};

function FileOptions() {
  const [maxAssetSize, setMaxAssetSize] = useAtom(maxAssetSizeAtom);
  const [generateExtraSizes, setGenerateExtraSizes] = useAtom(
    generateExtraSizesAtom
  );
  const [outputExtension, setOutputExtension] = useAtom(outputExtensionAtom);

  return (
    <div className="space-y-4 p-4 border rounded-xl dark:border-gray-800">
      <h3 className="font-medium text-lg">Output Options</h3>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Max Asset Size
        </label>
        <select
          value={maxAssetSize}
          onChange={(e) => setMaxAssetSize(e.target.value as any)}
          className="block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="1920x1080">1920 × 1080 px</option>
          <option value="1280x720">1280 × 720 px</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Output Format
        </label>
        <select
          value={outputExtension}
          onChange={(e) => setOutputExtension(e.target.value as any)}
          className="block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="webp">WebP</option>
          <option value="jpeg">JPEG</option>
        </select>
      </div>

      <div className="flex items-center">
        <input
          id="extra-sizes"
          type="checkbox"
          checked={generateExtraSizes}
          onChange={(e) => setGenerateExtraSizes(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label
          htmlFor="extra-sizes"
          className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
        >
          Generate thumbnail & icon sizes
        </label>
      </div>
    </div>
  );
}
