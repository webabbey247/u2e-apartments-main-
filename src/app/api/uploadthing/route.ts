import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

// UploadThing route handler (reads UPLOADTHING_TOKEN from env).
export const { GET, POST } = createRouteHandler({ router: ourFileRouter });
