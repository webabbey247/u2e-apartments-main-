import { generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

// Headless helper so the booking modal keeps its own button styling.
export const { useUploadThing } = generateReactHelpers<OurFileRouter>();
