import { describe, expect, it } from "vitest";
import { calculateScale, measureObject, smooth, validateSnapshot } from "../lib/measurement";

describe("measurement math", () => {
  it("converts marker pixels into centimeters per pixel", () => {
    expect(calculateScale(5, 250)).toBe(0.02);
  });

  it("converts object dimensions using the calibrated scale", () => {
    expect(measureObject(1350, 2200, 0.02)).toEqual({ widthCm: 27, heightCm: 44 });
  });

  it("smooths a new reading toward the previous stable reading", () => {
    expect(smooth(25, 27, 0.2)).toBeCloseTo(25.4);
  });

  it("requires a detected marker and object before becoming ready", () => {
    expect(validateSnapshot({ markerDetected: false, objectDetected: false, markerPixelSize: null, confidence: 0 })).toMatchObject({ status: "marker_search" });
    expect(validateSnapshot({ markerDetected: true, objectDetected: true, markerPixelSize: 240, confidence: 0.92 })).toMatchObject({ status: "ready" });
  });
});
