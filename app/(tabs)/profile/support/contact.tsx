import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Linking,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ORANGE = "#FF9500";
const BG = "#F7F7F7";

export default function ContactScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const sendMessage = () => {
    if (!message.trim()) {
      Alert.alert("تنبيه", "يرجى كتابة رسالتك");
      return;
    }

    Alert.alert("تم الإرسال ✅", "تم إرسال رسالتك بنجاح");
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* ===== Contact Methods ===== */}
      <View style={styles.card}>
        <Text style={styles.title}>طرق التواصل</Text>

        <TouchableOpacity
          style={styles.row}
          onPress={() => Linking.openURL("tel:0500000000")}
        >
          <Ionicons name="call-outline" size={22} color={ORANGE} />
          <Text style={styles.rowText}>اتصل بنا</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.row}
          onPress={() => Linking.openURL("https://wa.me/966500000000")}
        >
          <Ionicons name="logo-whatsapp" size={22} color={ORANGE} />
          <Text style={styles.rowText}>واتساب</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.row}
          onPress={() => Linking.openURL("mailto:support@app.com")}
        >
          <Ionicons name="mail-outline" size={22} color={ORANGE} />
          <Text style={styles.rowText}>البريد الإلكتروني</Text>
        </TouchableOpacity>
      </View>

      {/* ===== Send Message ===== */}
      <View style={styles.card}>
        <Text style={styles.title}>إرسال رسالة</Text>

        <TextInput
          placeholder="الاسم (اختياري)"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />

        <TextInput
          placeholder="البريد الإلكتروني (اختياري)"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          placeholder="اكتب رسالتك..."
          style={[styles.input, styles.textArea]}
          multiline
          value={message}
          onChangeText={setMessage}
        />

        <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
          <Text style={styles.sendText}>إرسال</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

/* ================= Styles ================= */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BG,
  },

  card: {
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 18,
    padding: 16,
  },

  title: {
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 14,
    textAlign: "right",
  },

  row: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#F1F1F1",
  },

  rowText: {
    fontWeight: "800",
    fontSize: 15,
  },

  input: {
    backgroundColor: "#F2F2F2",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },

  textArea: {
    height: 120,
    textAlignVertical: "top",
  },

  sendBtn: {
    backgroundColor: ORANGE,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 6,
  },

  sendText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 16,
  },
});