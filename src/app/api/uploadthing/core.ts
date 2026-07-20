import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

// Single route for payment receipts (image or PDF). The uploaded file URL is
// returned to the client and later persisted to the booking via the BFF.
export const ourFileRouter = {
  // Payment receipts — JPG/JPEG, PNG, or PDF only, 2MB max.
  receipt: f({
    "image/jpeg": { maxFileSize: "2MB", maxFileCount: 1 },
    "image/png": { maxFileSize: "2MB", maxFileCount: 1 },
    "application/pdf": { maxFileSize: "2MB", maxFileCount: 1 },
  }).onUploadComplete(async ({ file }) => {
    return { url: file.ufsUrl, name: file.name };
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
