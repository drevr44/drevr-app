import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API = process.env.EXPO_PUBLIC_API_BASE_URL;
const ORANGE = "#FF9500";

type Message = {
  id: string;
  text: string;
  sender: "user" | "driver";
  createdAt: string;
};

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList>(null);

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (id) {
      fetchBooking();
      fetchMessages();
    }
  }, [id]);

  const fetchBooking = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${API}/bookings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        setBooking(null);
        return;
      }

      const data = await res.json();
      setBooking(data);
    } catch (err) {
      console.log("Fetch booking error:", err);
      setBooking(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${API}/chat/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) return;

      const data = await res.json();

      const formatted = data.map((m: any) => ({
        id: String(m.id),
        text: m.text,
        sender: m.sender === "driver" ? "driver" : "user",
        createdAt: m.createdAt,
      }));

      setMessages(formatted);
    } catch (err) {
      console.log("Fetch messages error:", err);
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    const text = message;
    setMessage("");

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${API}/chat/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) return;

      const newMsg = await res.json();

      const formatted: Message = {
        id: String(newMsg.id),
        text: newMsg.text,
        sender: "user",
        createdAt: newMsg.createdAt,
      };

      setMessages((prev) => [...prev, formatted]);

      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    } catch (err) {
      console.log("Send message error:", err);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={ORANGE} />
      </View>
    );
  }

  if (!booking) {
    return (
      <View style={styles.center}>
        <Text style={{ fontWeight: "900" }}>المحادثة غير متوفرة</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={90}
    >
      {/* ===== Driver Info ===== */}
      <View style={styles.driverCard}>
        <Image
          source={{
            uri:
              booking.driver?.avatar ||
              booking.driver?.image ||
              "https://i.pravatar.cc/150",
          }}
          style={styles.avatar}
        />
        <Text style={styles.driverName}>
          {booking.driver?.name || "السائق"}
        </Text>
        <Text style={styles.driverStatus}>متصل الآن</Text>
      </View>

      {/* ===== Messages ===== */}
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messages}
        onContentSizeChange={() =>
          listRef.current?.scrollToEnd({ animated: true })
        }
        renderItem={({ item }) => {
          const isUser = item.sender === "user";

          return (
            <View
              style={[
                styles.messageBubble,
                isUser ? styles.userBubble : styles.driverBubble,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  isUser && { color: "#fff" },
                ]}
              >
                {item.text}
              </Text>
            </View>
          );
        }}
      />

      {/* ===== Input ===== */}
      <View style={[styles.inputRow, { paddingBottom: insets.bottom + 6 }]}>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="اكتب رسالتك..."
          style={styles.input}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
          <IconSymbol name="paperplane.fill" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  driverCard: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },

  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 6,
  },

  driverName: {
    fontWeight: "900",
    fontSize: 16,
  },

  driverStatus: {
    fontSize: 12,
    color: "#22C55E",
    marginTop: 2,
  },

  messages: {
    padding: 16,
    flexGrow: 1,
  },

  messageBubble: {
    maxWidth: "75%",
    padding: 12,
    borderRadius: 14,
    marginBottom: 10,
  },

  userBubble: {
    backgroundColor: ORANGE,
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4,
  },

  driverBubble: {
    backgroundColor: "#EDEDED",
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
  },

  messageText: {
    fontWeight: "700",
    color: "#111",
  },

  inputRow: {
    flexDirection: "row-reverse",
    padding: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#EEE",
    alignItems: "center",
    gap: 10,
  },

  input: {
    flex: 1,
    backgroundColor: "#F2F2F2",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  sendBtn: {
    backgroundColor: ORANGE,
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
});