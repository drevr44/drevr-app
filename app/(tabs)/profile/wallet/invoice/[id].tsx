import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ORANGE = "#FF9500";
const GREEN = "#22C55E";
const API = process.env.EXPO_PUBLIC_API_BASE_URL;

/* تحويل طريقة الدفع */
function paymentLabel(method: string) {
  switch (method) {
    case "APPLE_PAY":
      return "Apple Pay";
    case "CARD":
      return "بطاقة";
    case "TAMARA":
      return "تمارا";
    case "TABBY":
      return "تابي";
    default:
      return method;
  }
}

/* تجميع أيام الرحلة حسب الشهر */
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
        days: [],
      };
    }

    months[key].days.push(d.getDate());

  });

  return Object.values(months);

}

export default function InvoiceDetailsScreen() {

  const { id } = useLocalSearchParams();

  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchInvoice = async () => {

      try {

        const token = await AsyncStorage.getItem("token");

        if (!token || !id) {
          setLoading(false);
          return;
        }

        const res = await fetch(`${API}/payments/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("فشل جلب الفاتورة");
        }

        const data = await res.json();

        setInvoice(data);

      } catch (err) {

        console.log("Invoice fetch error:", err);

      } finally {

        setLoading(false);

      }

    };

    fetchInvoice();

  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={ORANGE} />
      </View>
    );
  }

  if (!invoice) {
    return (
      <View style={styles.center}>
        <Text>لم يتم العثور على الفاتورة</Text>
      </View>
    );
  }

  const { booking, payment, amount, invoiceNumber, createdAt } = invoice;

  const months = groupDaysByMonth(booking?.dailyLogs);

  return (

    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ padding: 16 }}
    >

      <Stack.Screen options={{ title: "الفاتورة" }} />

      {/* ===== الفاتورة ===== */}

      <View style={styles.card}>

        <Text style={styles.sectionTitle}>🧾 الفاتورة</Text>

        <View style={styles.row}>
          <Text style={styles.label}>رقم الفاتورة</Text>
          <Text style={styles.value}>{invoiceNumber}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>المبلغ</Text>
          <Text style={[styles.value, { color: ORANGE }]}>
            {amount} ر.س
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>طريقة الدفع</Text>
          <Text style={styles.value}>
            {paymentLabel(payment?.method)}
          </Text>
        </View>

      </View>

      {/* ===== معلومات العميل ===== */}

      <View style={styles.card}>

        <Text style={styles.sectionTitle}>معلومات العميل</Text>

        <View style={styles.row}>
          <Text style={styles.label}>الاسم</Text>
          <Text style={styles.value}>
            {booking?.user?.name || "-"}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>الجوال</Text>
          <Text style={styles.value}>
            {booking?.user?.phone || "-"}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>الإيميل</Text>
          <Text style={styles.value}>
            {booking?.user?.email || "-"}
          </Text>
        </View>

      </View>

      {/* ===== تفاصيل الرحلة ===== */}

      <View style={styles.card}>

        <Text style={styles.sectionTitle}>تفاصيل الرحلة</Text>

        <View style={styles.row}>
          <Text style={styles.label}>السائق</Text>
          <Text style={styles.value}>
            {booking?.driver?.name || "غير محدد"}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>المسار</Text>
          <Text style={styles.value}>
            {booking?.from} → {booking?.to}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>نوع الرحلة</Text>
          <Text style={styles.value}>
            {booking?.tripType === "ROUND_TRIP"
              ? "ذهاب وعودة"
              : "ذهاب فقط"}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>عدد الأيام</Text>
          <Text style={styles.value}>
            {booking?.days || "-"}
          </Text>
        </View>

      </View>

      {/* ===== أيام الرحلة ===== */}

      {months.length > 0 && (

        <View style={styles.card}>

          <Text style={styles.sectionTitle}>أيام الرحلة</Text>

          {months.map((m: any, i: number) => (

            <View key={i} style={{ marginBottom: 10 }}>

              <Text style={styles.monthTitle}>
                {m.label}
              </Text>

              <Text style={styles.days}>
                {m.days.join(" • ")}
              </Text>

            </View>

          ))}

        </View>

      )}

      {/* ===== معلومات الدفع ===== */}

      <View style={styles.card}>

        <Text style={styles.sectionTitle}>معلومات الدفع</Text>

        <View style={styles.row}>
          <Text style={styles.label}>وقت الدفع</Text>
          <Text style={styles.value}>
            {new Date(createdAt).toLocaleString("ar-SA")}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>الحالة</Text>
          <Text style={[styles.value, { color: GREEN }]}>
            ✓ مدفوعة
          </Text>
        </View>

      </View>

    </ScrollView>

  );

}

const styles = StyleSheet.create({

  screen: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 18,
    marginBottom: 14,
  },

  sectionTitle: {
    fontWeight: "900",
    marginBottom: 10,
    fontSize: 16,
  },

  row: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  label: {
    color: "#777",
    fontWeight: "700",
  },

  value: {
    fontWeight: "900",
    color: "#111",
  },

  monthTitle: {
    textAlign: "right",
    fontWeight: "900",
    marginBottom: 4,
  },

  days: {
    textAlign: "right",
    color: "#333",
  },

});