// import { createCanvas, Image } from "canvas";

// export function resizeImage(image: Image, width: number, height: number) {
//   const canvas = createCanvas(width, height);
//   const ctx = canvas.getContext("2d");
// }

import { ImageData, ImageSize, MaxAssetSize } from "../atoms";

interface CompressOptions {
  maxAssetSize: MaxAssetSize;
  outputExtension: "webp" | "jpeg";
  generateExtraSizes: boolean;
}

async function generateImageSize(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  width: number,
  height: number,
  extension: "webp" | "jpeg"
): Promise<ImageSize> {
  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(image, 0, 0, width, height);

  const mimeType = extension === "webp" ? "image/webp" : "image/jpeg";
  const dataUrl = canvas.toDataURL(mimeType, 0.8);
  const base64str = dataUrl.split(",")[1];
  const size = Math.round((base64str.length * 3) / 4);

  return {
    url: dataUrl,
    extension,
    size,
    width,
    height,
  };
}

export async function imageCompressor(
  image: ArrayBuffer,
  setCompressedImage: (imageData: ImageData) => void,
  options: CompressOptions
) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Failed to create canvas context");
  }

  // Create temporary image to get original dimensions
  const tempImage = new Image();
  await new Promise((resolve) => {
    tempImage.onload = resolve;
    tempImage.src = URL.createObjectURL(new Blob([image]));
  });

  // Get max dimensions from options
  const [MAX_WIDTH, MAX_HEIGHT] = options.maxAssetSize.split("x").map(Number);

  // Calculate dimensions maintaining aspect ratio
  let width = tempImage.width;
  let height = tempImage.height;
  if (width > MAX_WIDTH) {
    height = (MAX_WIDTH * height) / width;
    width = MAX_WIDTH;
  }
  if (height > MAX_HEIGHT) {
    width = (MAX_HEIGHT * width) / height;
    height = MAX_HEIGHT;
  }

  const imageElement = new Image();
  imageElement.onload = async () => {
    // Generate main converted file
    const convertedFile = await generateImageSize(
      canvas,
      ctx,
      imageElement,
      width,
      height,
      options.outputExtension
    );

    const imageData: ImageData = {
      originalFile: {
        name: "image", // This will be updated in the Dropzone component
        extension: "", // This will be updated in the Dropzone component
        size: image.byteLength,
        width: tempImage.width,
        height: tempImage.height,
        createdAt: new Date(),
      },
      convertedFile,
    };

    // Generate additional sizes if requested
    if (options.generateExtraSizes) {
      imageData.thumbnail = await generateImageSize(
        canvas,
        ctx,
        imageElement,
        150,
        150,
        options.outputExtension
      );

      imageData.icon = await generateImageSize(
        canvas,
        ctx,
        imageElement,
        50,
        50,
        options.outputExtension
      );
    }

    setCompressedImage(imageData);
  };

  imageElement.src = URL.createObjectURL(new Blob([image]));
}
