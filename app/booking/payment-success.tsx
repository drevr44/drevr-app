import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
  Alert,
  ScrollView
} from "react-native";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";

const GREEN = "#22C55E";
const ORANGE = "#FF9500";
const API = process.env.EXPO_PUBLIC_API_BASE_URL;

/* تحويل طريقة الدفع */
function paymentLabel(method: string) {
  switch (method) {
    case "APPLE_PAY": return "Apple Pay";
    case "CARD": return "بطاقة";
    case "TAMARA": return "تمارا";
    case "TABBY": return "تابي";
    default: return method;
  }
}

/* تجميع الأيام حسب الشهر */
function groupDaysByMonth(dailyLogs: any[]) {

  if (!dailyLogs) return [];

  const months: any = {};

  dailyLogs.forEach((log) => {

    const d = new Date(log.date);

    const key = `${d.getFullYear()}-${d.getMonth()}`;

    const label = `${d.getFullYear()} / ${d.getMonth() + 1}`;

    if (!months[key]) {
      months[key] = {
        label,
        days: []
      };
    }

    months[key].days.push(d.getDate());

  });

  return Object.values(months);
}

export default function PaymentSuccessScreen() {

  const { bookingId } = useLocalSearchParams();

  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const scaleAnim = useRef(new Animated.Value(0.6)).current;
  const cardAnim = useRef(new Animated.Value(40)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {

    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 120,
      useNativeDriver: true
    }).start();

    Animated.parallel([
      Animated.timing(cardAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true
      })
    ]).start();

    Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Success
    );

  }, []);

  useEffect(() => {

    const fetchInvoice = async () => {

      if (!bookingId) {
        setLoading(false);
        return;
      }

      try {

        const token = await AsyncStorage.getItem("token");

        const res = await fetch(`${API}/payments/${bookingId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) {
          throw new Error("فشل جلب الفاتورة");
        }

        const data = await res.json();

        if (data.booking?.driverChanged) {

          Alert.alert(
            "تم تغيير السائق",
            `السائق الجديد: ${data.booking?.driver?.name}`
          );

        }

        setInvoice(data);

      } catch (err) {
        console.log(err);
        Alert.alert("تعذر تحميل الفاتورة");
      } finally {
        setLoading(false);
      }

    };

    fetchInvoice();

  }, [bookingId]);

  const months = groupDaysByMonth(invoice?.booking?.dailyLogs);

  return (

    <View style={styles.screen}>
      <Stack.Screen options={{ headerRight: () => null }} />

      <ScrollView contentContainerStyle={styles.content}>

        <Animated.View
          style={[
            styles.successIcon,
            { transform: [{ scale: scaleAnim }] }
          ]}
        >
          <IconSymbol name="checkmark" size={38} color="#fff" />
        </Animated.View>

        <Text style={styles.title}>شكراً لك</Text>
        <Text style={styles.subtitle}>تم الدفع بنجاح 🎉</Text>

        {loading ? (

          <ActivityIndicator size="large" color={ORANGE} />

        ) : invoice ? (

          <Animated.View
            style={[
              styles.invoiceCard,
              {
                transform: [{ translateY: cardAnim }],
                opacity: opacityAnim
              }
            ]}
          >

            <Text style={styles.invoiceTitle}>
              🧾 الفاتورة
            </Text>

            <View style={styles.row}>
              <Text style={styles.label}>رقم الفاتورة</Text>
              <Text style={styles.value}>{invoice.invoiceNumber}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>المبلغ</Text>
              <Text style={[styles.value, { color: ORANGE }]}>
                {invoice.amount} ر.س
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>طريقة الدفع</Text>
              <Text style={styles.value}>
                {paymentLabel(invoice.payment?.method)}
              </Text>
            </View>

            <View style={styles.divider} />

            <Text style={styles.section}>معلومات العميل</Text>

            <View style={styles.row}>
              <Text style={styles.label}>الاسم</Text>
              <Text style={styles.value}>{invoice.booking?.user?.name || "-"}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>الجوال</Text>
              <Text style={styles.value}>{invoice.booking?.user?.phone || "-"}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>الإيميل</Text>
              <Text style={styles.value}>{invoice.booking?.user?.email || "-"}</Text>
            </View>

            <View style={styles.divider} />

            <Text style={styles.section}>تفاصيل الرحلة</Text>

            <View style={styles.row}>
              <Text style={styles.label}>السائق</Text>
              <Text style={styles.value}>{invoice.booking?.driver?.name}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>المسار</Text>
              <Text style={styles.value}>
                {invoice.booking?.from} → {invoice.booking?.to}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>نوع الرحلة</Text>
              <Text style={styles.value}>
                {invoice.booking?.tripType === "ROUND_TRIP" ? "ذهاب وعودة" : "ذهاب فقط"}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>عدد الأيام</Text>
              <Text style={styles.value}>{invoice.booking?.days}</Text>
            </View>

            <View style={styles.divider} />

            <Text style={styles.section}>أيام الرحلة</Text>

            {months.map((m: any, i: number) => (
              <View key={i} style={{ marginBottom: 8 }}>

                <Text style={styles.monthTitle}>
                  {m.label}
                </Text>

                <Text style={styles.days}>
                  {m.days.join(" • ")}
                </Text>

              </View>
            ))}

            <Text style={styles.invoiceDate}>
              {new Date(invoice.createdAt).toLocaleString()}
            </Text>

          </Animated.View>

        ) : (

          <Text style={{ marginTop: 20 }}>
            لا توجد فاتورة
          </Text>

        )}

      </ScrollView>

      <View style={styles.actions}>

        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => router.replace("/(tabs)/bookings")}
        >
          <Text style={styles.primaryText}>عرض حجوزاتي</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => router.replace("/(tabs)")}
        >
          <Text style={styles.secondaryText}>العودة للرئيسية</Text>
        </TouchableOpacity>

      </View>

    </View>

  );
}

const styles = StyleSheet.create({

  screen: { flex: 1, backgroundColor: "#F7F7F7" },

  content: {
    padding: 18,
    alignItems: "center"
  },

  successIcon: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16
  },

  title: {
    fontSize: 20,
    fontWeight: "900"
  },

  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10
  },

  invoiceCard: {
    marginTop: 20,
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 18,
    width: "100%",
    elevation: 3
  },

  invoiceTitle: {
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 12,
    textAlign: "right"
  },

  section: {
    fontSize: 15,
    fontWeight: "900",
    marginBottom: 6,
    marginTop: 6,
    textAlign: "right"
  },

  row: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    marginBottom: 6
  },

  label: {
    color: "#888",
    fontSize: 13,
    fontWeight: "700"
  },

  value: {
    fontSize: 14,
    fontWeight: "800",
    color: "#111"
  },

  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 10
  },

  monthTitle: {
    textAlign: "right",
    fontWeight: "800",
    fontSize: 14
  },

  days: {
    textAlign: "right",
    color: "#444",
    fontSize: 13
  },

  invoiceDate: {
    marginTop: 8,
    textAlign: "right",
    fontSize: 11,
    color: "#999"
  },

  actions: {
    padding: 16,
    paddingBottom: 26
  },

  primaryBtn: {
    backgroundColor: ORANGE,
    paddingVertical: 15,
    borderRadius: 18,
    alignItems: "center",
    marginBottom: 10
  },

  primaryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "900"
  },

  secondaryBtn: {
    backgroundColor: "#F2F2F2",
    paddingVertical: 13,
    borderRadius: 18,
    alignItems: "center"
  },

  secondaryText: {
    fontSize: 14,
    fontWeight: "900"
  }

});