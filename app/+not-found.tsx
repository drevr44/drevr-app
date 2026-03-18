import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";

export default function NotFoundScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>الصفحة غير موجودة</Text>
      <Text style={styles.subtitle}>المسار غير صحيح أو الصفحة غير متوفرة</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace("/(auth)")}
      >
        <Text style={styles.buttonText}>العودة لشاشة الدخول</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: { color: "#fff", fontSize: 22, fontWeight: "700", marginBottom: 10 },
  subtitle: {
    color: "#aaa",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
  },
  button: {
    backgroundColor: "#FF9500",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
