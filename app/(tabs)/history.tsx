import { ScrollView, StyleSheet, Text, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

export default function HistoryScreen() {
  const colors = useColors();
  return <ScreenContainer className="p-5"><ScrollView contentContainerStyle={styles.content}>
    <Text style={[styles.kicker, { color: colors.primary }]}>LOCAL HISTORY</Text><Text style={[styles.title, { color: colors.foreground }]}>Your readings.</Text>
    <View style={[styles.empty, { backgroundColor: colors.surface, borderColor: colors.border }]}><Text style={[styles.icon, { color: colors.primary }]}>◫</Text><Text style={[styles.emptyTitle, { color: colors.foreground }]}>No saved measurements yet</Text><Text style={[styles.emptyCopy, { color: colors.muted }]}>When you confirm a stable reading, it will appear here with its dimensions and quality status.</Text></View>
    <Text style={[styles.note, { color: colors.muted }]}>Measurements stay on this device. No account or cloud sync is required.</Text>
  </ScrollView></ScreenContainer>;
}
const styles = StyleSheet.create({ content: { gap: 14, paddingBottom: 30 }, kicker: { fontSize: 12, fontWeight: '800', letterSpacing: 2 }, title: { fontSize: 28, lineHeight: 34, fontWeight: '800', marginBottom: 8 }, empty: { minHeight: 250, borderRadius: 22, borderWidth: 1, alignItems: 'center', justifyContent: 'center', padding: 30, gap: 10 }, icon: { fontSize: 42, fontWeight: '300' }, emptyTitle: { fontSize: 18, fontWeight: '800', textAlign: 'center' }, emptyCopy: { fontSize: 13, lineHeight: 20, textAlign: 'center' }, note: { textAlign: 'center', fontSize: 12, lineHeight: 18, padding: 8 } });
