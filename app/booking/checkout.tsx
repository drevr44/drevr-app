import React, { useState, useMemo, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useBookings } from "@/context/BookingsContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ORANGE = "#FF9500";
const DARK = "#111";
const API = process.env.EXPO_PUBLIC_API_BASE_URL;

type PaymentMethod =
  | "APPLE_PAY"
  | "CARD"
  | "TABBY"
  | "TAMARA"
  | null;

export default function CheckoutScreen() {
  const { draft } = useBookings();
  const [method, setMethod] = useState<PaymentMethod>(null);
  const [loading, setLoading] = useState(false);
  const submitLock = useRef(false);

  if (!draft) {
    return (
      <View style={styles.center}>
        <Text style={{ fontWeight: "900" }}>
          لا توجد بيانات للحجز
        </Text>
      </View>
    );
  }

  const {
    from,
    to,
    days,
    price,
    departTime,
    returnTime,
    driver,
    vehicleCategory,
    tripType,
    selectedDates,
  } = draft;

  const sortedDays = useMemo(() => {
    if (!selectedDates || selectedDates.length === 0) return [];
    return selectedDates
      .map((d: string) => new Date(d))
      .sort((a, b) => a.getTime() - b.getTime())
      .map((date) => date.getDate());
  }, [selectedDates]);

  const handlePay = async () => {
    if (submitLock.current) return;
    if (!method) return;

    submitLock.current = true;
    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        Alert.alert("يجب تسجيل الدخول أولاً");
        return;
      }

      if (!driver?.id) {
        Alert.alert("لم يتم اختيار سائق");
        return;
      }

      /* ===============================
         🚕 Create Booking
      ================================= */

      const bookingRes = await fetch(`${API}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          from,
          to,
          tripType,
          vehicleCategory,
          days,
          departTime,
          returnTime,
          price,
          pickupLat: 24.7136,
          pickupLng: 46.6753,
          dropoffLat: 24.774265,
          dropoffLng: 46.738586,
          driverId: driver.id,
          selectedDates: selectedDates || [],
        }),
      });

      if (!bookingRes.ok) {
        throw new Error("فشل إنشاء الحجز");
      }

      const bookingData = await bookingRes.json();
      const bookingId = bookingData.id;

      /* ===============================
         💳 Create Payment
      ================================= */

      const paymentRes = await fetch(`${API}/payments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bookingId,
          method,
          status: "PAID",
        }),
      });

      if (!paymentRes.ok) {
        throw new Error("فشل الدفع");
      }

      /* ===============================
         ✅ Success
      ================================= */

      router.replace({
        pathname: "/booking/payment-success",
        params: { bookingId },
      });

    } catch (err) {
      console.log(err);
      Alert.alert("حدث خطأ أثناء الدفع");
    } finally {
      setLoading(false);
      submitLock.current = false;
    }
  };

  const payments = [
    {
      key: "APPLE_PAY",
      label: "Apple Pay",
      icon: "logo-apple",
    },
    {
      key: "CARD",
      label: "بطاقة مدى / فيزا / ماستركارد",
      icon: "card",
    },
    {
      key: "TABBY",
      label: "تابي",
      icon: "cash-outline",
    },
    {
      key: "TAMARA",
      label: "تمارا",
      icon: "time-outline",
    },
  ];

  const onSelect = (key: PaymentMethod) => {
    setMethod(key);
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.priceBanner}>
          <Text style={styles.priceLabel}>الإجمالي</Text>
          <Text style={styles.priceValue}>{price} ر.س</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>اختر طريقة الدفع</Text>

          {payments.map((p) => {
            const selected = method === p.key;

            return (
              <TouchableOpacity
                key={p.key}
                style={[
                  styles.paymentCard,
                  selected && styles.paymentSelected,
                ]}
                onPress={() => onSelect(p.key as PaymentMethod)}
              >
                <Ionicons
                  name={p.icon as any}
                  size={20}
                  color={selected ? ORANGE : "#555"}
                />

                <Text
                  style={[
                    styles.paymentText,
                    selected && { color: ORANGE },
                  ]}
                >
                  {p.label}
                </Text>

                {selected && (
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color={ORANGE}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[
          styles.payBtn,
          (!method || loading) && { opacity: 0.4 },
        ]}
        disabled={!method || loading}
        onPress={handlePay}
      >
        <Text style={styles.payBtnText}>
          {loading ? "جاري المعالجة..." : "إتمام الدفع"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F6F6F6" },
  container: { padding: 16, paddingBottom: 140 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  priceBanner: {
    backgroundColor: ORANGE,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    alignItems: "center",
  },

  priceLabel: { color: "#fff", fontWeight: "700" },
  priceValue: { color: "#fff", fontWeight: "900", fontSize: 28 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
  },

  sectionTitle: {
    fontWeight: "900",
    fontSize: 16,
    marginBottom: 12,
    textAlign: "right",
    color: DARK,
  },

  paymentCard: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    borderRadius: 14,
    backgroundColor: "#F3F3F3",
    marginBottom: 10,
  },

  paymentSelected: {
    backgroundColor: "#FFF4E6",
    borderWidth: 1.5,
    borderColor: ORANGE,
  },

  paymentText: {
    fontWeight: "800",
    fontSize: 15,
    flex: 1,
    textAlign: "right",
    marginHorizontal: 10,
  },

  payBtn: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: ORANGE,
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: "center",
  },

  payBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "900",
  },
});