import { ScrollView, StyleSheet, Text, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

export default function GuideScreen() {
  const colors = useColors();
  return <ScreenContainer className="p-5"><ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
    <Text style={[styles.kicker, { color: colors.primary }]}>QUICK GUIDE</Text>
    <Text style={[styles.title, { color: colors.foreground }]}>Set up a reliable reading.</Text>
    <Text style={[styles.lead, { color: colors.muted }]}>The marker is your physical reference. Without a known reference, a single camera image cannot provide absolute size.</Text>
    {[['01','Place the marker','Use a printed 5 × 5 cm ArUco marker on the same flat plane as the object.'],['02','Align the camera','Keep all four marker corners visible and avoid sharp tilt. Perspective correction helps, but a straight-on view is more stable.'],['03','Hold steady','Use even light, reduce reflections, and wait for the green “Ready” state before measuring.']].map(([n, h, copy]) => <View key={n} style={[styles.step, { borderColor: colors.border, backgroundColor: colors.surface }]}><Text style={[styles.number, { color: colors.primary }]}>{n}</Text><View style={styles.stepCopy}><Text style={[styles.stepTitle, { color: colors.foreground }]}>{h}</Text><Text style={[styles.stepBody, { color: colors.muted }]}>{copy}</Text></View></View>)}
    <View style={[styles.note, { backgroundColor: '#201D16', borderColor: '#5A4722' }]}><Text style={[styles.noteTitle, { color: colors.warning }]}>Accuracy note</Text><Text style={[styles.noteBody, { color: '#D9C69C' }]}>Results are centimeter estimates. Lens distortion, focal length, autofocus, blur, lighting, contour quality, marker placement, and object angle all affect accuracy.</Text></View>
  </ScrollView></ScreenContainer>;
}
const styles = StyleSheet.create({ content: { gap: 14, paddingBottom: 30 }, kicker: { fontSize: 12, fontWeight: '800', letterSpacing: 2 }, title: { fontSize: 28, lineHeight: 34, fontWeight: '800' }, lead: { fontSize: 15, lineHeight: 22, marginBottom: 6 }, step: { flexDirection: 'row', gap: 16, padding: 17, borderWidth: 1, borderRadius: 18 }, number: { fontSize: 16, fontWeight: '800' }, stepCopy: { flex: 1, gap: 5 }, stepTitle: { fontSize: 16, fontWeight: '800' }, stepBody: { fontSize: 13, lineHeight: 19 }, note: { borderWidth: 1, borderRadius: 18, padding: 17, gap: 6, marginTop: 4 }, noteTitle: { fontSize: 14, fontWeight: '800' }, noteBody: { fontSize: 13, lineHeight: 19 } });
