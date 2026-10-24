import { useState } from "react";
import type {
  EmailData,
  GeoData,
  QROptions,
  QRDataType,
  SMSData,
  VCardData,
  WiFiData,
} from "@qr-styled/node";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator } from "./ui/field";
import { Input } from "./ui/input";

export type { QROptions };
export interface QRFormProps {
  initialValues?: Partial<QROptions>;
  onChange?: (values: QROptions) => void;
  onSubmit?: (values: QROptions) => void;
  submitting?: boolean;
}

const DEFAULTS: QROptions = {
  url: "",
  type: "text",
  size: 600,
  margin: 4,
  padding: 40,
  foregroundColor: "#000000",
  backgroundColor: "#ffffff",
  cornerRadius: 60,
  rounded: true,
  moduleRadius: 0.35,
  gradient: false,
  gradientColors: "#FEDA75,#FA7E1E,#D62976,#962FBF,#4F5BD5",
  gradientAngle: 45,
  logo: "",
  logoSize: 120,
  logoPadding: 10,
  logoShape: "circle",
  logoBackgroundColor: "#ffffff",
  logoRadius: 20,
  errorCorrectionLevel: "H",
  eyeColor: "",
  eyeRadius: 0,
  eyeShape: "square",
};

const DATA_TYPES: QRDataType[] = ["url", "text", "vcard", "wifi", "email", "sms", "geo"];

const selectClassName =
  "h-7 w-full min-w-0 rounded-md border border-input bg-input/20 px-2 py-0.5 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 md:text-xs/relaxed";

const checkboxClassName = "h-4 w-4 shrink-0 accent-current";

export default function QRForm({ initialValues, onChange, onSubmit, submitting }: QRFormProps) {
  const [options, setOptions] = useState<QROptions>({ ...DEFAULTS, ...initialValues });
  // Icon preview is only committed on blur so typing does not spam image loads.
  const [previewIcon, setPreviewIcon] = useState<string>(initialValues?.logo ?? "");
  const [previewError, setPreviewError] = useState(false);

  function emit(next: QROptions) {
    setOptions(next);
    onChange?.(next);
  }

  function update<K extends keyof QROptions>(key: K, value: QROptions[K]) {
    emit({ ...options, [key]: value });
  }

  function updateData(patch: Record<string, string | number | boolean | undefined>) {
    const current = (options.data ?? {}) as Record<string, unknown>;
    emit({ ...options, data: { ...current, ...patch } as QROptions["data"] });
  }

  function handleTypeChange(type: QRDataType) {
    // Reset structured data when switching types so stale fields are not submitted.
    emit({
      ...options,
      type,
      data: undefined,
      url: type === "url" || type === "text" ? options.url : undefined,
    });
  }

  const data = options.data as
    | (VCardData & WiFiData & EmailData & SMSData & GeoData & Record<string, unknown>)
    | undefined;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>QR Details</CardTitle>
        <CardDescription>Use the settings to configure the generated QR Code</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit?.(options);
          }}
        >
          <FieldGroup>
            {/* Content */}
            <Field>
              <FieldLabel htmlFor="qr-type">Data type</FieldLabel>
              <select
                id="qr-type"
                className={selectClassName}
                value={options.type ?? "text"}
                onChange={(e) => handleTypeChange(e.target.value as QRDataType)}
              >
                {DATA_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </Field>

            {(options.type === "url" || options.type === "text" || options.type === undefined) && (
              <Field>
                <FieldLabel htmlFor="qrlink">URL</FieldLabel>
                <Input
                  id="qrlink"
                  value={options.url ?? ""}
                  onChange={(e) => update("url", e.target.value)}
                  placeholder="https://example.com"
                />
              </Field>
            )}

            {options.type === "vcard" && (
              <FieldGroup>
                <div className="grid grid-cols-2 gap-2">
                  <Field>
                    <FieldLabel htmlFor="vcard-first">First name</FieldLabel>
                    <Input
                      id="vcard-first"
                      value={data?.firstName ?? ""}
                      onChange={(e) => updateData({ firstName: e.target.value })}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="vcard-last">Last name</FieldLabel>
                    <Input
                      id="vcard-last"
                      value={data?.lastName ?? ""}
                      onChange={(e) => updateData({ lastName: e.target.value })}
                    />
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Field>
                    <FieldLabel htmlFor="vcard-org">Organization</FieldLabel>
                    <Input
                      id="vcard-org"
                      value={data?.organization ?? ""}
                      onChange={(e) => updateData({ organization: e.target.value })}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="vcard-title">Title</FieldLabel>
                    <Input
                      id="vcard-title"
                      value={data?.title ?? ""}
                      onChange={(e) => updateData({ title: e.target.value })}
                    />
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Field>
                    <FieldLabel htmlFor="vcard-phone">Phone</FieldLabel>
                    <Input
                      id="vcard-phone"
                      value={data?.phone ?? ""}
                      onChange={(e) => updateData({ phone: e.target.value })}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="vcard-email">Email</FieldLabel>
                    <Input
                      id="vcard-email"
                      type="email"
                      value={data?.email ?? ""}
                      onChange={(e) => updateData({ email: e.target.value })}
                    />
                  </Field>
                </div>
                <Field>
                  <FieldLabel htmlFor="vcard-url">URL</FieldLabel>
                  <Input
                    id="vcard-url"
                    value={data?.url ?? ""}
                    onChange={(e) => updateData({ url: e.target.value })}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="vcard-address">Address</FieldLabel>
                  <Input
                    id="vcard-address"
                    value={data?.address ?? ""}
                    onChange={(e) => updateData({ address: e.target.value })}
                  />
                </Field>
                <div className="grid grid-cols-2 gap-2">
                  <Field>
                    <FieldLabel htmlFor="vcard-city">City</FieldLabel>
                    <Input
                      id="vcard-city"
                      value={data?.city ?? ""}
                      onChange={(e) => updateData({ city: e.target.value })}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="vcard-state">State</FieldLabel>
                    <Input
                      id="vcard-state"
                      value={data?.state ?? ""}
                      onChange={(e) => updateData({ state: e.target.value })}
                    />
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Field>
                    <FieldLabel htmlFor="vcard-zip">ZIP</FieldLabel>
                    <Input
                      id="vcard-zip"
                      value={data?.zip ?? ""}
                      onChange={(e) => updateData({ zip: e.target.value })}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="vcard-country">Country</FieldLabel>
                    <Input
                      id="vcard-country"
                      value={data?.country ?? ""}
                      onChange={(e) => updateData({ country: e.target.value })}
                    />
                  </Field>
                </div>
              </FieldGroup>
            )}

            {options.type === "wifi" && (
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="wifi-ssid">SSID</FieldLabel>
                  <Input
                    id="wifi-ssid"
                    value={data?.ssid ?? ""}
                    onChange={(e) => updateData({ ssid: e.target.value })}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="wifi-password">Password</FieldLabel>
                  <Input
                    id="wifi-password"
                    type="password"
                    value={data?.password ?? ""}
                    onChange={(e) => updateData({ password: e.target.value })}
                  />
                </Field>
                <div className="grid grid-cols-2 gap-2">
                  <Field>
                    <FieldLabel htmlFor="wifi-encryption">Encryption</FieldLabel>
                    <select
                      id="wifi-encryption"
                      className={selectClassName}
                      value={data?.encryption ?? "WPA"}
                      onChange={(e) => updateData({ encryption: e.target.value })}
                    >
                      <option value="WPA">WPA</option>
                      <option value="WEP">WEP</option>
                      <option value="nopass">nopass</option>
                    </select>
                  </Field>
                  <Field orientation="horizontal" className="items-end pb-1">
                    <input
                      id="wifi-hidden"
                      type="checkbox"
                      className={checkboxClassName}
                      checked={Boolean(data?.hidden)}
                      onChange={(e) => updateData({ hidden: e.target.checked })}
                    />
                    <FieldLabel htmlFor="wifi-hidden">Hidden network</FieldLabel>
                  </Field>
                </div>
              </FieldGroup>
            )}

            {options.type === "email" && (
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="email-to">Email</FieldLabel>
                  <Input
                    id="email-to"
                    type="email"
                    value={data?.email ?? ""}
                    onChange={(e) => updateData({ email: e.target.value })}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="email-subject">Subject</FieldLabel>
                  <Input
                    id="email-subject"
                    value={data?.subject ?? ""}
                    onChange={(e) => updateData({ subject: e.target.value })}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="email-body">Body</FieldLabel>
                  <Input
                    id="email-body"
                    value={data?.body ?? ""}
                    onChange={(e) => updateData({ body: e.target.value })}
                  />
                </Field>
              </FieldGroup>
            )}

            {options.type === "sms" && (
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="sms-phone">Phone</FieldLabel>
                  <Input
                    id="sms-phone"
                    type="tel"
                    value={data?.phone ?? ""}
                    onChange={(e) => updateData({ phone: e.target.value })}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="sms-message">Message</FieldLabel>
                  <Input
                    id="sms-message"
                    value={data?.message ?? ""}
                    onChange={(e) => updateData({ message: e.target.value })}
                  />
                </Field>
              </FieldGroup>
            )}

            {options.type === "geo" && (
              <div className="grid grid-cols-2 gap-2">
                <Field>
                  <FieldLabel htmlFor="geo-lat">Latitude</FieldLabel>
                  <Input
                    id="geo-lat"
                    type="number"
                    step="any"
                    value={data?.latitude ?? ""}
                    onChange={(e) =>
                      updateData({
                        latitude: e.target.value === "" ? undefined : Number(e.target.value),
                      })
                    }
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="geo-lng">Longitude</FieldLabel>
                  <Input
                    id="geo-lng"
                    type="number"
                    step="any"
                    value={data?.longitude ?? ""}
                    onChange={(e) =>
                      updateData({
                        longitude: e.target.value === "" ? undefined : Number(e.target.value),
                      })
                    }
                  />
                </Field>
              </div>
            )}

            <FieldSeparator>Canvas</FieldSeparator>
            <div className="grid grid-cols-2 gap-2">
              <Field>
                <FieldLabel htmlFor="qr-size">Size (px)</FieldLabel>
                <Input
                  id="qr-size"
                  type="number"
                  min={64}
                  value={options.size ?? DEFAULTS.size}
                  onChange={(e) => update("size", Number(e.target.value))}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="qr-corner">Corner radius</FieldLabel>
                <Input
                  id="qr-corner"
                  type="number"
                  min={0}
                  value={options.cornerRadius ?? DEFAULTS.cornerRadius}
                  onChange={(e) => update("cornerRadius", Number(e.target.value))}
                />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Field>
                <FieldLabel htmlFor="qr-margin">Margin (modules)</FieldLabel>
                <Input
                  id="qr-margin"
                  type="number"
                  min={0}
                  value={options.margin ?? DEFAULTS.margin}
                  onChange={(e) => update("margin", Number(e.target.value))}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="qr-padding">Padding (px)</FieldLabel>
                <Input
                  id="qr-padding"
                  type="number"
                  min={0}
                  value={options.padding ?? DEFAULTS.padding}
                  onChange={(e) => update("padding", Number(e.target.value))}
                />
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="qr-ecc">Error correction</FieldLabel>
              <select
                id="qr-ecc"
                className={selectClassName}
                value={options.errorCorrectionLevel ?? "H"}
                onChange={(e) =>
                  update(
                    "errorCorrectionLevel",
                    e.target.value as QROptions["errorCorrectionLevel"],
                  )
                }
              >
                <option value="L">L (low)</option>
                <option value="M">M (medium)</option>
                <option value="Q">Q (quartile)</option>
                <option value="H">H (high)</option>
              </select>
            </Field>

            <FieldSeparator>Colors &amp; modules</FieldSeparator>
            <div className="grid grid-cols-2 gap-2">
              <Field>
                <FieldLabel htmlFor="bg-color">Background Color</FieldLabel>
                <Input
                  id="bg-color"
                  type="color"
                  value={options.backgroundColor ?? DEFAULTS.backgroundColor}
                  onChange={(e) => update("backgroundColor", e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="fg-color">Foreground Color</FieldLabel>
                <Input
                  id="fg-color"
                  type="color"
                  value={options.foregroundColor ?? DEFAULTS.foregroundColor}
                  onChange={(e) => update("foregroundColor", e.target.value)}
                />
              </Field>
            </div>
            <Field orientation="horizontal">
              <input
                id="qr-rounded"
                type="checkbox"
                className={checkboxClassName}
                checked={options.rounded ?? true}
                onChange={(e) => update("rounded", e.target.checked)}
              />
              <FieldLabel htmlFor="qr-rounded">Rounded modules</FieldLabel>
            </Field>
            <Field>
              <FieldLabel htmlFor="qr-module-radius">
                Module radius ({options.moduleRadius ?? 0.35})
              </FieldLabel>
              <Input
                id="qr-module-radius"
                type="range"
                min={0}
                max={0.5}
                step={0.05}
                value={options.moduleRadius ?? DEFAULTS.moduleRadius}
                onChange={(e) => update("moduleRadius", Number(e.target.value))}
              />
              <FieldDescription>Corner radius per module, 0.0 – 0.5.</FieldDescription>
            </Field>

            <FieldSeparator>Gradient</FieldSeparator>
            <Field orientation="horizontal">
              <input
                id="qr-gradient"
                type="checkbox"
                className={checkboxClassName}
                checked={options.gradient ?? false}
                onChange={(e) => update("gradient", e.target.checked)}
              />
              <FieldLabel htmlFor="qr-gradient">Enable gradient</FieldLabel>
            </Field>
            <Field>
              <FieldLabel htmlFor="qr-gradient-colors">Gradient colors</FieldLabel>
              <Input
                id="qr-gradient-colors"
                value={options.gradientColors ?? ""}
                onChange={(e) => update("gradientColors", e.target.value)}
                placeholder="#FEDA75,#FA7E1E,#D62976"
                disabled={!options.gradient}
              />
              <FieldDescription>Comma-separated colors.</FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="qr-gradient-angle">
                Gradient angle ({options.gradientAngle ?? 45}°)
              </FieldLabel>
              <Input
                id="qr-gradient-angle"
                type="number"
                min={0}
                max={360}
                value={options.gradientAngle ?? DEFAULTS.gradientAngle}
                onChange={(e) => update("gradientAngle", Number(e.target.value))}
                disabled={!options.gradient}
              />
            </Field>

            <FieldSeparator>Eyes</FieldSeparator>
            <div className="grid grid-cols-2 gap-2">
              <Field>
                <FieldLabel htmlFor="qr-eye-shape">Eye shape</FieldLabel>
                <select
                  id="qr-eye-shape"
                  className={selectClassName}
                  value={options.eyeShape ?? "square"}
                  onChange={(e) => update("eyeShape", e.target.value as QROptions["eyeShape"])}
                >
                  <option value="square">square</option>
                  <option value="rounded">rounded</option>
                  <option value="circle">circle</option>
                </select>
              </Field>
              <Field>
                <FieldLabel htmlFor="qr-eye-color">Eye color</FieldLabel>
                <Input
                  id="qr-eye-color"
                  type="color"
                  value={options.eyeColor || "#000000"}
                  onChange={(e) => update("eyeColor", e.target.value)}
                />
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="qr-eye-radius">Eye radius ({options.eyeRadius ?? 0})</FieldLabel>
              <Input
                id="qr-eye-radius"
                type="range"
                min={0}
                max={0.5}
                step={0.05}
                value={options.eyeRadius ?? 0}
                onChange={(e) => update("eyeRadius", Number(e.target.value))}
              />
            </Field>

            <FieldSeparator>Logo</FieldSeparator>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="icon-url">Logo Image URL</FieldLabel>
                    <Input
                      id="icon-url"
                      value={options.logo ?? ""}
                      onChange={(e) => {
                        setPreviewError(false);
                        update("logo", e.target.value);
                      }}
                      onBlur={(e) => {
                        const next = e.target.value.trim();
                        setPreviewError(false);
                        setPreviewIcon(next);
                      }}
                      placeholder="https://example.com/logo.png"
                    />
                    <FieldDescription>Preview loads on blur, to the right.</FieldDescription>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="logo-size">Logo size (px)</FieldLabel>
                    <Input
                      id="logo-size"
                      type="number"
                      min={0}
                      value={options.logoSize ?? DEFAULTS.logoSize}
                      onChange={(e) => update("logoSize", Number(e.target.value))}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="logo-padding">Logo padding (px)</FieldLabel>
                    <Input
                      id="logo-padding"
                      type="number"
                      min={0}
                      value={options.logoPadding ?? DEFAULTS.logoPadding}
                      onChange={(e) => update("logoPadding", Number(e.target.value))}
                    />
                  </Field>
                  <div className="grid grid-cols-2 gap-2">
                    <Field>
                      <FieldLabel htmlFor="logo-shape">Logo shape</FieldLabel>
                      <select
                        id="logo-shape"
                        className={selectClassName}
                        value={options.logoShape ?? "circle"}
                        onChange={(e) =>
                          update("logoShape", e.target.value as QROptions["logoShape"])
                        }
                      >
                        <option value="circle">circle</option>
                        <option value="square">square</option>
                      </select>
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="logo-bg">Logo background</FieldLabel>
                      <Input
                        id="logo-bg"
                        type="color"
                        value={options.logoBackgroundColor ?? DEFAULTS.logoBackgroundColor}
                        onChange={(e) => update("logoBackgroundColor", e.target.value)}
                      />
                    </Field>
                  </div>
                  <Field>
                    <FieldLabel htmlFor="logo-radius">Logo radius (square)</FieldLabel>
                    <Input
                      id="logo-radius"
                      type="number"
                      min={0}
                      value={options.logoRadius ?? DEFAULTS.logoRadius}
                      onChange={(e) => update("logoRadius", Number(e.target.value))}
                    />
                  </Field>
                </FieldGroup>
              </div>
              <div>
                {previewIcon ? (
                  <div className="flex h-full flex-col items-center justify-center gap-2 rounded-md border border-dashed p-2">
                    {previewError ? (
                      <p className="text-xs text-destructive">Could not load image.</p>
                    ) : (
                      <img
                        src={previewIcon}
                        alt="Logo preview"
                        className="max-h-32 max-w-full object-contain"
                        onError={() => setPreviewError(true)}
                      />
                    )}
                    <p className="max-w-full truncate text-xs text-muted-foreground">
                      {previewIcon}
                    </p>
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center rounded-md border border-dashed p-2 text-xs text-muted-foreground">
                    Image preview
                  </div>
                )}
              </div>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Button type="button" disabled={submitting} onClick={() => onSubmit?.(options)}>
          {submitting ? "Generating…" : "Generate QR code"}
        </Button>
      </CardFooter>
    </Card>
  );
}
