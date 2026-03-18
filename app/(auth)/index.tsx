import { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  Animated,
  Alert,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Step = "splash" | "login" | "register" | "otp";
type AuthMode = "login" | "register";

/* تم تعديل هذا السطر فقط ليتصل بالسيرفر من env */
const API = process.env.EXPO_PUBLIC_API_BASE_URL;

const translateError = (message: string) => {
  if (!message) return "حدث خطأ غير متوقع";
  if (message.includes("User not found"))
    return "هذا الرقم غير مسجل في النظام";
  if (message.includes("already exists"))
    return "هذا الرقم مسجل مسبقاً";
  if (message.includes("Invalid"))
    return "الرمز غير صحيح";
  return message;
};

export default function EntryFlow() {
  const [step, setStep] = useState<Step>("splash");
  const [mode, setMode] = useState<AuthMode>("login");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "">("");

  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [timer, setTimer] = useState(30);

  const inputs = useRef<TextInput[]>([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  const formatPhone = (value: string) => {
    let cleaned = value.replace(/\D/g, "");
    if (cleaned.startsWith("5")) cleaned = "0" + cleaned;
    return cleaned;
  };

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) router.replace("/(tabs)");
      else setLoading(false);
    };
    checkToken();
  }, []);

  useFocusEffect(
    useCallback(() => {
      setStep("splash");
      setMode("login");
      setFullName("");
      setPhone("");
      setEmail("");
      setGender("");
      setCode(Array(6).fill(""));
      setTimer(30);
    }, [])
  );

  useEffect(() => {
    if (step === "splash") {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.9);

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          useNativeDriver: true,
        }),
      ]).start();

      const t = setTimeout(() => setStep("login"), 1200);
      return () => clearTimeout(t);
    }
  }, [step]);

  useEffect(() => {
    if (step === "otp" && timer > 0) {
      const t = setTimeout(() => setTimer((v) => v - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [step, timer]);

  const handleOtpChange = (value: string, index: number) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value && index < 5) inputs.current[index + 1]?.focus();
  };

  const sendOtp = async () => {
    Keyboard.dismiss();
    const formattedPhone = formatPhone(phone);

    if (!formattedPhone || formattedPhone.length < 9) {
      Alert.alert("تنبيه", "أدخل رقم جوال صحيح");
      return;
    }

    if (mode === "register") {
      if (!fullName) return Alert.alert("تنبيه", "أدخل الاسم الكامل");
      if (!email.includes("@"))
        return Alert.alert("تنبيه", "أدخل بريد إلكتروني صحيح");
      if (!gender) return Alert.alert("تنبيه", "اختر الجنس");
    }

    try {
      setSending(true);

      const response = await fetch(`${API}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: formattedPhone,
          purpose: mode,
          name: mode === "register" ? fullName : undefined,
          email: mode === "register" ? email : undefined,
          gender: mode === "register" ? gender : undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok)
        return Alert.alert("خطأ", translateError(data.message));

      setPhone(formattedPhone);
      setCode(Array(6).fill(""));
      setTimer(30);
      setStep("otp");

      setTimeout(() => inputs.current[0]?.focus(), 200);
    } catch {
      Alert.alert("خطأ", "تعذر الاتصال بالسيرفر");
    } finally {
      setSending(false);
    }
  };

  const verifyOtp = async () => {
    Keyboard.dismiss();
    const finalCode = code.join("");

    if (finalCode.length !== 6)
      return Alert.alert("تنبيه", "أدخل الرمز كاملاً");

    try {
      const response = await fetch(`${API}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code: finalCode, purpose: mode }),
      });

      const data = await response.json();
      if (!response.ok)
        return Alert.alert("خطأ", translateError(data.message));

      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("user", JSON.stringify(data.user));

      router.replace("/(tabs)");
    } catch {
      Alert.alert("خطأ", "تعذر الاتصال بالسيرفر");
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#FF9500" />
      </View>
    );
  }

  return (
    <LinearGradient colors={["#FFD700", "#FF9500", "#FF3B30"]} style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            <Animated.Image
              source={require("../../assets/images/icon.png")}
              resizeMode="contain"
              style={[
                styles.logo,
                step === "splash" && {
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            />

            {step === "login" && (
              <>
                <Text style={styles.title}>تسجيل الدخول</Text>

                <TextInput
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                  style={styles.input}
                  textAlign="right"
                  placeholder="05xxxxxxxx"
                />

                <TouchableOpacity style={styles.button} onPress={sendOtp}>
                  {sending ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>إرسال رمز التحقق</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.linkBtn}
                  onPress={() => {
                    setMode("register");
                    setStep("register");
                  }}
                >
                  <Text style={styles.linkText}>إنشاء حساب جديد</Text>
                </TouchableOpacity>
              </>
            )}

            {step === "register" && (
              <>
                <Text style={styles.title}>إنشاء حساب جديد</Text>

                <TextInput
                  value={fullName}
                  onChangeText={setFullName}
                  style={styles.input}
                  textAlign="right"
                  placeholder="الاسم الكامل"
                />

                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  style={styles.input}
                  textAlign="right"
                  placeholder="البريد الإلكتروني"
                  keyboardType="email-address"
                />

                <View style={{ flexDirection: "row", gap: 10, marginBottom: 15 }}>
                  <TouchableOpacity
                    style={[
                      styles.genderBtn,
                      gender === "male" && styles.genderActive,
                    ]}
                    onPress={() => setGender("male")}
                  >
                    <Text>ذكر</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.genderBtn,
                      gender === "female" && styles.genderActive,
                    ]}
                    onPress={() => setGender("female")}
                  >
                    <Text>أنثى</Text>
                  </TouchableOpacity>
                </View>

                <TextInput
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                  style={styles.input}
                  textAlign="right"
                  placeholder="05xxxxxxxx"
                />

                <TouchableOpacity style={styles.button} onPress={sendOtp}>
                  {sending ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>إرسال رمز التحقق</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.linkBtn}
                  onPress={() => {
                    setMode("login");
                    setStep("login");
                  }}
                >
                  <Text style={styles.linkText}>رجوع</Text>
                </TouchableOpacity>
              </>
            )}

            {step === "otp" && (
              <>
                <Text style={styles.subtitle}>
                  أدخل رمز التحقق المرسل إلى جوالك
                </Text>

                <View style={styles.otpRow}>
                  {code.map((digit, index) => (
                    <TextInput
                      key={index}
                      ref={(ref) => {
                        if (ref) inputs.current[index] = ref;
                      }}
                      value={digit}
                      onChangeText={(val) =>
                        handleOtpChange(val.slice(-1), index)
                      }
                      keyboardType="number-pad"
                      maxLength={1}
                      style={styles.otpBox}
                      textAlign="center"
                    />
                  ))}
                </View>

                <TouchableOpacity style={styles.button} onPress={verifyOtp}>
                  <Text style={styles.buttonText}>تأكيد الدخول</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
  },
  logo: { width: 200, height: 120, marginBottom: 24 },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 10 },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 14,
    textAlign: "center",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 14,
    padding: 14,
    marginBottom: 15,
    color: "#000",
  },
  genderBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#F2F2F2",
    alignItems: "center",
  },
  genderActive: {
    backgroundColor: "#FFE0B2",
  },
  otpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  otpBox: {
    width: 45,
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    fontSize: 18,
    color: "#000",
  },
  button: {
    width: "100%",
    backgroundColor: "#FF9500",
    padding: 15,
    borderRadius: 14,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  linkBtn: { marginTop: 14 },
  linkText: { color: "#111", fontWeight: "700" },
});