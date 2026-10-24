import { createServerFn } from "@tanstack/react-start";
import type { QROptions } from "@qr-styled/node";

export const generateQrCode = createServerFn({ method: "POST" })
  .validator((options: QROptions) => options)
  .handler(async ({ data }) => {
    const { QRGenerator } = await import("@qr-styled/node");
    const generator = new QRGenerator(data);
    return generator.generateToDataURL("png");
  });
