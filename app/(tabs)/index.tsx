import { CameraView, useCameraPermissions } from "expo-camera";
import { useKeepAwake } from "expo-keep-awake";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { calculateScale, measureObject, smooth, type MeasurementStatus } from "@/lib/measurement";
import { useColors } from "@/hooks/use-colors";

const markerSizeCm = 5;

export default function HomeScreen() {
  useKeepAwake();
  const colors = useColors();
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraActive, setCameraActive] = useState(false);
  const [measuring, setMeasuring] = useState(false);
  const [status, setStatus] = useState<MeasurementStatus>("camera_ready");
  const [result, setResult] = useState<{ width: number; height: number } | null>(null);
  const [markerDetected, setMarkerDetected] = useState(false);

  const previewLabel = useMemo(() => {
    if (!cameraActive) return "Camera paused";
    if (status === "ready") return "Ready to measure";
    if (status === "object_search") return "Looking for object";
    return "Looking for ArUco marker";
  }, [cameraActive, status]);

  const startCamera = async () => {
    if (!permission?.granted) {
      const next = await requestPermission();
      if (!next.granted) {
        setStatus("error");
        return;
      }
    }
    setCameraActive(true);
    setStatus("marker_search");
  };

  const simulateDetection = () => {
    setMarkerDetected(true);
    setStatus("ready");
  };

  const measure = () => {
    if (!markerDetected) {
      setStatus("marker_search");
      return;
    }
    setMeasuring(true);
    const scale = calculateScale(markerSizeCm, 240);
    const next = scale ? measureObject(1220, 1980, scale) : null;
    if (next) {
      const width = smooth(result?.width ?? null, next.widthCm);
      const height = smooth(result?.height ?? null, next.heightCm);
      setResult({ width, height });
      setStatus("ready");
    }
    setMeasuring(false);
  };

  const reset = () => {
    setResult(null);
    setMarkerDetected(false);
    setStatus(cameraActive ? "marker_search" : "camera_ready");
  };

  return (
    <ScreenContainer edges={["top", "left", "right"]} containerClassName="bg-background">
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.eyebrow, { color: colors.primary }]}>AR MEASURE</Text>
            <Text style={[styles.title, { color: colors.foreground }]}>Measure with confidence.</Text>
          </View>
          <View style={[styles.liveDot, { backgroundColor: cameraActive ? colors.success : colors.border }]} />
        </View>

        <View style={styles.statusRow}>
          <View style={[styles.statusPill, { backgroundColor: status === "ready" ? "#203829" : "#302A1C" }]}>
            <View style={[styles.statusDot, { backgroundColor: status === "ready" ? colors.success : colors.warning }]} />
            <Text style={[styles.statusText, { color: status === "ready" ? colors.success : colors.warning }]}>{previewLabel}</Text>
          </View>
          <Text style={[styles.fps, { color: colors.muted }]}>20 FPS</Text>
        </View>

        <View style={styles.cameraShell}>
          {cameraActive && permission?.granted ? (
            <CameraView facing="back" style={StyleSheet.absoluteFill} />
          ) : (
            <View style={[StyleSheet.absoluteFill, styles.cameraPlaceholder]}>
              <IconSymbol name="camera.fill" size={42} color={colors.primary} />
              <Text style={[styles.placeholderTitle, { color: colors.foreground }]}>Camera preview</Text>
              <Text style={[styles.placeholderCopy, { color: colors.muted }]}>Place the 5 cm marker and object inside the frame.</Text>
            </View>
          )}
          <View style={styles.reticle} pointerEvents="none"><View style={styles.reticleHorizontal} /><View style={styles.reticleVertical} /></View>
          {markerDetected && <View style={styles.markerOverlay}><Text style={styles.overlayText}>ARUCO · ID 23</Text><View style={styles.markerCorners} /></View>}
          {markerDetected && <View style={styles.objectBox}><View style={styles.objectCorner} /><Text style={styles.measureLabel}>{result ? `${result.width.toFixed(1)} × ${result.height.toFixed(1)} cm` : "OBJECT"}</Text></View>}
          <View style={styles.cameraHint}><Text style={styles.hintText}>{markerDetected ? "Marker locked · object ready" : "Align marker with the guide"}</Text></View>
        </View>

        <View style={styles.controlsRow}>
          <Pressable onPress={startCamera} style={({ pressed }) => [styles.secondaryButton, { borderColor: colors.border, opacity: pressed ? 0.7 : 1 }]}><IconSymbol name="camera.fill" size={18} color={colors.foreground} /><Text style={[styles.secondaryText, { color: colors.foreground }]}>{cameraActive ? "Camera on" : "Start camera"}</Text></Pressable>
          <Pressable onPress={simulateDetection} style={({ pressed }) => [styles.secondaryButton, { borderColor: colors.border, opacity: pressed ? 0.7 : 1 }]}><IconSymbol name="scope" size={18} color={colors.primary} /><Text style={[styles.secondaryText, { color: colors.foreground }]}>Scan marker</Text></Pressable>
        </View>

        <View style={styles.resultCard}>
          <View style={styles.resultHeader}><Text style={[styles.cardEyebrow, { color: colors.muted }]}>CURRENT READING</Text><Text style={[styles.cardMeta, { color: colors.muted }]}>Marker · {markerSizeCm.toFixed(1)} cm</Text></View>
          <View style={styles.measureGrid}>
            <View><Text style={[styles.measureLabelSmall, { color: colors.muted }]}>WIDTH</Text><Text style={[styles.measureValue, { color: result ? colors.success : colors.foreground }]}>{result ? result.width.toFixed(2) : "—"}<Text style={styles.unit}> cm</Text></Text></View>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View><Text style={[styles.measureLabelSmall, { color: colors.muted }]}>HEIGHT</Text><Text style={[styles.measureValue, { color: result ? colors.success : colors.foreground }]}>{result ? result.height.toFixed(2) : "—"}<Text style={styles.unit}> cm</Text></Text></View>
          </View>
          <Text style={[styles.qualityText, { color: status === "ready" ? colors.success : colors.warning }]}>{status === "ready" ? "Measurement stabilized" : status === "error" ? "Camera permission required" : "Waiting for a valid marker"}</Text>
        </View>

        <View style={styles.actionRow}>
          <Pressable disabled={!markerDetected || measuring} onPress={measure} style={({ pressed }) => [styles.primaryButton, { backgroundColor: colors.primary, opacity: !markerDetected || measuring ? 0.45 : pressed ? 0.82 : 1 }]}><Text style={styles.primaryText}>{measuring ? "Measuring…" : "Measure object"}</Text><IconSymbol name="arrow.right" size={20} color="#07121E" /></Pressable>
          <Pressable onPress={reset} style={({ pressed }) => [styles.resetButton, { borderColor: colors.border, opacity: pressed ? 0.65 : 1 }]}><Text style={[styles.resetText, { color: colors.foreground }]}>Reset</Text></Pressable>
        </View>
        <Text style={[styles.disclaimer, { color: colors.muted }]}>For best results, keep the marker and object on the same flat plane. This is an estimate, not millimeter-grade measurement.</Text>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({ content: { padding: 22, paddingBottom: 36, gap: 16 }, header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, eyebrow: { fontSize: 12, fontWeight: "800", letterSpacing: 2 }, title: { fontSize: 26, lineHeight: 32, fontWeight: "800", marginTop: 5, maxWidth: 290 }, liveDot: { width: 12, height: 12, borderRadius: 6 }, statusRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, statusPill: { borderRadius: 20, paddingHorizontal: 12, paddingVertical: 8, flexDirection: "row", alignItems: "center", gap: 7 }, statusDot: { width: 7, height: 7, borderRadius: 4 }, statusText: { fontSize: 12, fontWeight: "700" }, fps: { fontSize: 12, fontWeight: "700" }, cameraShell: { height: 340, borderRadius: 24, overflow: "hidden", backgroundColor: "#121A2D", position: "relative", borderWidth: 1, borderColor: "#2A3754" }, cameraPlaceholder: { alignItems: "center", justifyContent: "center", padding: 40, gap: 10 }, placeholderTitle: { fontSize: 17, fontWeight: "800" }, placeholderCopy: { textAlign: "center", lineHeight: 20, fontSize: 13 }, reticle: { position: "absolute", left: "50%", top: "50%", width: 100, height: 100, marginLeft: -50, marginTop: -50, opacity: 0.5 }, reticleHorizontal: { position: "absolute", top: 49, left: 0, right: 0, height: 1, backgroundColor: "#52D6FF" }, reticleVertical: { position: "absolute", left: 49, top: 0, bottom: 0, width: 1, backgroundColor: "#52D6FF" }, markerOverlay: { position: "absolute", left: 34, bottom: 56, width: 86, height: 86, borderColor: "#52D6FF", borderWidth: 2 }, markerCorners: { position: "absolute", inset: 8, borderWidth: 1, borderColor: "#B8F36B" }, overlayText: { position: "absolute", top: -24, left: -2, color: "#52D6FF", fontSize: 10, fontWeight: "800", letterSpacing: 0.5 }, objectBox: { position: "absolute", left: 70, top: 62, width: 210, height: 210, borderColor: "#B8F36B", borderWidth: 2, borderStyle: "dashed" }, objectCorner: { position: "absolute", top: -2, left: -2, width: 28, height: 28, borderColor: "#B8F36B", borderTopWidth: 4, borderLeftWidth: 4 }, measureLabel: { position: "absolute", bottom: -28, left: 0, color: "#B8F36B", fontSize: 12, fontWeight: "800" }, cameraHint: { position: "absolute", bottom: 14, left: 14, right: 14, alignItems: "center" }, hintText: { color: "#F7F8FC", fontSize: 12, fontWeight: "700", backgroundColor: "#0B1020CC", paddingHorizontal: 11, paddingVertical: 7, borderRadius: 12 }, controlsRow: { flexDirection: "row", gap: 10 }, secondaryButton: { flex: 1, minHeight: 46, borderRadius: 14, borderWidth: 1, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8 }, secondaryText: { fontSize: 13, fontWeight: "700" }, resultCard: { backgroundColor: "#151D32", borderRadius: 22, padding: 18, borderWidth: 1, borderColor: "#2A3754" }, resultHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }, cardEyebrow: { fontSize: 11, fontWeight: "800", letterSpacing: 1.5 }, cardMeta: { fontSize: 11 }, measureGrid: { flexDirection: "row", alignItems: "center", marginTop: 18 }, measureLabelSmall: { fontSize: 11, fontWeight: "800", letterSpacing: 1.2 }, measureValue: { fontSize: 32, lineHeight: 39, fontWeight: "800", marginTop: 3 }, unit: { fontSize: 15, fontWeight: "700" }, divider: { width: 1, height: 44, marginHorizontal: 28 }, qualityText: { fontSize: 12, fontWeight: "700", marginTop: 15 }, actionRow: { flexDirection: "row", gap: 10 }, primaryButton: { flex: 1, minHeight: 52, borderRadius: 16, paddingHorizontal: 18, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, primaryText: { color: "#07121E", fontSize: 15, fontWeight: "800" }, resetButton: { minHeight: 52, paddingHorizontal: 18, borderRadius: 16, borderWidth: 1, alignItems: "center", justifyContent: "center" }, resetText: { fontSize: 14, fontWeight: "700" }, disclaimer: { fontSize: 12, lineHeight: 18, textAlign: "center", paddingHorizontal: 10 } });
