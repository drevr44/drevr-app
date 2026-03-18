import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

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

export default function InvoicesScreen() {

  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {

    try {

      const token = await AsyncStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      const res = await fetch(`${API}/payments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("فشل جلب الفواتير");
      }

      const data = await res.json();

      setInvoices(data);

    } catch (err) {

      console.log("Invoices fetch error:", err);

    } finally {

      setLoading(false);

    }

  };

  const renderItem = ({ item }: any) => (

    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push(`/profile/wallet/invoice/${item.bookingId}`)
      }
    >

      {/* المبلغ */}
      <View style={styles.topRow}>
        <Text style={styles.amount}>{item.amount} ر.س</Text>
        <Text style={styles.date}>
          {new Date(item.createdAt).toLocaleDateString("ar-SA")}
        </Text>
      </View>

      {/* طريقة الدفع */}
      <Text style={styles.method}>
        {paymentLabel(item.payment?.method)}
      </Text>

      {/* رقم الفاتورة */}
      <Text style={styles.invoiceNumber}>
        {item.invoiceNumber}
      </Text>

      {/* المسار */}
      <Text style={styles.route}>
        {item.booking?.from} → {item.booking?.to}
      </Text>

      {/* عدد الأيام */}
      <Text style={styles.days}>
        {item.booking?.days} أيام
      </Text>

      {/* الحالة */}
      <Text style={styles.status}>
        ✓ مدفوعة
      </Text>

    </TouchableOpacity>

  );

  return (

    <View style={styles.screen}>

      {loading ? (

        <ActivityIndicator
          size="large"
          color={ORANGE}
          style={{ marginTop: 40 }}
        />

      ) : (

        <FlatList
          data={invoices}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={
            <Text style={styles.empty}>
              لا توجد فواتير حتى الآن
            </Text>
          }
        />

      )}

    </View>

  );

}

const styles = StyleSheet.create({

  screen: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
  },

  topRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  amount: {
    fontSize: 18,
    fontWeight: "900",
    color: ORANGE,
  },

  date: {
    fontSize: 13,
    color: "#777",
    fontWeight: "600",
  },

  method: {
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 4,
  },

  invoiceNumber: {
    fontSize: 12,
    color: "#777",
    marginBottom: 6,
  },

  route: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },

  days: {
    fontSize: 13,
    color: "#555",
    marginBottom: 6,
  },

  status: {
    color: GREEN,
    fontWeight: "900",
  },

  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#777",
  },

});