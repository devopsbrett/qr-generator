import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import QRForm, { type QROptions } from "#/components/QRForm";
import { generateQrCode } from "#/lib/qr-server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#/components/ui/card";
import { buttonVariants } from "#/components/ui/button";

export const Route = createFileRoute("/")({
  component: QRComponent,
});

function QRComponent() {
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleGenerate(values: QROptions) {
    setPending(true);
    setError(null);
    try {
      const dataUrl = await generateQrCode({ data: values });
      setResult(dataUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate QR code");
      setResult(null);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto w-7xl">
      <h1>QR Code Generator</h1>

      <div className="grid grid-cols-2 gap-4">
        <QRForm onSubmit={handleGenerate} submitting={pending}></QRForm>
        <Card className="sticky top-8 h-fit w-full">
          <CardHeader>
            <CardTitle>Result</CardTitle>
            <CardDescription>Your generated QR code will appear here</CardDescription>
          </CardHeader>
          <CardContent>
            {pending ? (
              <p className="text-sm text-muted-foreground">Generating…</p>
            ) : error ? (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            ) : result ? (
              <div className="flex flex-col items-center gap-4">
                <img src={result} alt="Generated QR code" className="max-w-full rounded-md" />
                <a
                  href={result}
                  download="qr-code.png"
                  className={buttonVariants({ variant: "outline" })}
                >
                  Download PNG
                </a>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Configure the settings and click Generate QR code.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
