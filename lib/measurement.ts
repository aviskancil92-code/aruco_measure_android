export type MeasurementStatus =
  | "camera_ready"
  | "marker_search"
  | "object_search"
  | "ready"
  | "unstable"
  | "error";

export type MeasurementSnapshot = {
  status: MeasurementStatus;
  markerDetected: boolean;
  objectDetected: boolean;
  markerId: number | null;
  markerSizeCm: number;
  markerPixelSize: number | null;
  pixelScale: number | null;
  widthPx: number | null;
  heightPx: number | null;
  widthCm: number | null;
  heightCm: number | null;
  confidence: number;
  warning: string | null;
};

export function calculateScale(markerSizeCm: number, markerPixelSize: number) {
  if (markerSizeCm <= 0 || markerPixelSize <= 0) return null;
  return markerSizeCm / markerPixelSize;
}

export function measureObject(widthPx: number, heightPx: number, pixelScale: number) {
  if (widthPx <= 0 || heightPx <= 0 || pixelScale <= 0) return null;
  return { widthCm: widthPx * pixelScale, heightCm: heightPx * pixelScale };
}

export function smooth(previous: number | null, next: number, alpha = 0.22) {
  return previous == null ? next : previous + alpha * (next - previous);
}

export function validateSnapshot(input: Pick<MeasurementSnapshot, "markerDetected" | "objectDetected" | "markerPixelSize" | "confidence">) {
  if (!input.markerDetected) return { status: "marker_search" as const, warning: "Arahkan marker ArUco 5 cm ke kamera" };
  if ((input.markerPixelSize ?? 0) < 70) return { status: "unstable" as const, warning: "Marker terlalu kecil — dekatkan kamera" };
  if (!input.objectDetected) return { status: "object_search" as const, warning: "Objek belum terdeteksi" };
  if (input.confidence < 0.7) return { status: "unstable" as const, warning: "Pegang kamera lebih stabil" };
  return { status: "ready" as const, warning: null };
}
