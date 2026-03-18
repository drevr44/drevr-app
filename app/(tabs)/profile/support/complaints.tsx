import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

const ORANGE = "#FF9500";
const BG = "#F7F7F7";

const TYPES = [
  "مشكلة مع السائق",
  "مشكلة في الدفع",
  "تأخير الرحلة",
  "تطبيق لا يعمل",
  "أخرى",
];

export default function ComplaintsScreen() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!selectedType || !message.trim()) {
      Alert.alert("تنبيه", "يرجى اختيار نوع الشكوى وكتابة التفاصيل");
      return;
    }

    Alert.alert("تم الإرسال ✅", "تم استلام شكواك وسيتم مراجعتها");

    setSelectedType(null);
    setMessage("");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
      >
        {/* ===== العنوان ===== */}
        <Text style={styles.title}>تقديم شكوى</Text>
        <Text style={styles.subtitle}>
          نحن هنا لمساعدتك، يرجى اختيار نوع المشكلة وكتابة التفاصيل
        </Text>

        {/* ===== نوع المشكلة ===== */}
        <Text style={styles.section}>نوع المشكلة</Text>

        {TYPES.map((type) => {
          const selected = selectedType === type;

          return (
            <TouchableOpacity
              key={type}
              style={[styles.typeBtn, selected && styles.typeSelected]}
              onPress={() => setSelectedType(type)}
              activeOpacity={0.85}
            >
              <Text
                style={[
                  styles.typeText,
                  selected && { color: ORANGE },
                ]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          );
        })}

        {/* ===== تفاصيل الشكوى ===== */}
        <Text style={styles.section}>تفاصيل الشكوى</Text>

        <TextInput
          style={styles.input}
          placeholder="اكتب تفاصيل المشكلة هنا..."
          multiline
          value={message}
          onChangeText={setMessage}
        />

        {/* ===== زر الإرسال ===== */}
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
          <Text style={styles.sendText}>إرسال الشكوى</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BG,
  },

  container: {
    padding: 16,
    paddingBottom: 140, // 🔥 مهم عشان ما يتغطى الزر مع الكيبورد
  },

  /* ===== العنوان بالمنتصف ===== */
  title: {
    fontSize: 22,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 6,
  },

  subtitle: {
    textAlign: "center",
    color: "#777",
    marginBottom: 20,
  },

  /* ===== المحتوى أقصى اليمين ===== */
  section: {
    fontWeight: "900",
    marginBottom: 8,
    textAlign: "right",
    alignSelf: "flex-end",
  },

  typeBtn: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#EEE",
  },

  typeSelected: {
    borderColor: ORANGE,
    backgroundColor: "#FFF7ED",
  },

  typeText: {
    fontWeight: "800",
    textAlign: "right",
  },

  input: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    minHeight: 120,
    textAlignVertical: "top",
    textAlign: "right",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#EEE",
  },

  sendBtn: {
    backgroundColor: ORANGE,
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
  },

  sendText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 16,
  },
});