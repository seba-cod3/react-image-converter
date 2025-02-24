import { createPortal } from "react-dom";
import { UploadIcon } from "../Icons";
import { ALLOWED_FORMATS, DROPZONE_PORTAL_ID } from "./constants";

export default function InputPortal() {
  return createPortal(
    <section className="flex flex-col justify-between px-2 py-6 min-h-[238px] pointer-events-none">
      <UploadIcon />
      <div className="">
        <div className="m-auto mt-4 text-center font-bold">
          Drop your images here
        </div>
        <p className="mb-4 text-center text-sm dark:text-gray-400">
          or click to browse
        </p>
      </div>
      <div className="flex justify-center gap-2">
        {ALLOWED_FORMATS.map((format) => {
          return (
            <div
              key={`allowed_formats_${format}`}
              className=" text-sm border dark:border-none dark:bg-gray-800 rounded-xl py-1 px-2"
            >
              {format}
            </div>
          );
        })}
      </div>
    </section>,
    document.getElementById(DROPZONE_PORTAL_ID) as HTMLElement
  );
}
