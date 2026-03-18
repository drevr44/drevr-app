import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
  Animated,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";

const API = process.env.EXPO_PUBLIC_API_URL;
const ORANGE = "#FF9500";

const REASONS = [
  "السائق متأخر",
  "أسلوب القيادة غير مريح",
  "أرغب بسائق آخر",
  "تغيير الخطة",
  "سبب آخر",
];

export default function DriverChangeScreen() {
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();

  const [booking, setBooking] = useState<any>(null);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loadingPage, setLoadingPage] = useState(true);
  const [loadingDrivers, setLoadingDrivers] = useState(true);

  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [showReasons, setShowReasons] = useState(false);
  const [otherReason, setOtherReason] = useState("");
  const [loading, setLoading] = useState(false);

  const scaleAnim = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    if (bookingId) fetchData();
  }, [bookingId]);

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const bookingRes = await fetch(`${API}/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!bookingRes.ok) return;

      const bookingData = await bookingRes.json();
      setBooking(bookingData);

      setLoadingDrivers(true);

      const driversRes = await fetch(
        `${API}/users/drivers?category=${bookingData.vehicleCategory}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!driversRes.ok) {
        setDrivers([]);
      } else {
        const driversData = await driversRes.json();
        const filtered = driversData.filter(
          (d: any) => d.id !== bookingData.driverId
        );
        setDrivers(filtered);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingPage(false);
      setLoadingDrivers(false);
    }
  };

  const confirmChange = async () => {
    if (!reason) {
      Alert.alert("اختر سبب التغيير");
      return;
    }

    if (!selectedDriver) {
      Alert.alert("لا يوجد سائق بديل حالياً");
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const finalReason =
        reason === "سبب آخر" ? otherReason : reason;

      const res = await fetch(
        `${API}/bookings/${bookingId}/driver-change`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            newDriverId: selectedDriver,
            reason: finalReason,
          }),
        }
      );

      if (!res.ok) throw new Error();

      Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success
      );

      setTimeout(() => router.back(), 800);
    } catch {
      Alert.alert("فشل تغيير السائق");
    } finally {
      setLoading(false);
    }
  };

  if (loadingPage) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={ORANGE} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.pageTitle}>تغيير السائق</Text>

        <Text style={styles.sectionTitleCenter}>سبب التغيير</Text>

        <TouchableOpacity
          style={styles.reasonSelector}
          onPress={() => setShowReasons(!showReasons)}
        >
          <Text style={{ fontWeight: "800", color: reason ? "#111" : "#999" }}>
            {reason || "اختر السبب"}
          </Text>
          <IconSymbol
            name={showReasons ? "chevron.up" : "chevron.down"}
            size={18}
            color="#666"
          />
        </TouchableOpacity>

        {showReasons && (
          <View style={styles.dropdown}>
            {REASONS.map((item) => (
              <TouchableOpacity
                key={item}
                style={styles.dropdownItem}
                onPress={() => {
                  setReason(item);
                  setShowReasons(false);
                }}
              >
                <Text>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {reason !== "" && (
          <>
            <View style={{ height: 30 }} />
            <Text style={styles.sectionTitleCenter}>
              البحث عن سائق بديل
            </Text>

            {loadingDrivers ? (
              <View style={styles.waitBox}>
                <ActivityIndicator color={ORANGE} />
                <Text style={styles.waitText}>
                  جاري البحث عن سائقين متاحين...
                </Text>
              </View>
            ) : drivers.length === 0 ? (
              <View style={styles.emptyBox}>
                <Text style={styles.emptyTitle}>
                  لا يوجد سائقين متاحين على فئتك حالياً
                </Text>
                <Text style={styles.emptySub}>
                  يمكنك المحاولة لاحقاً
                </Text>
              </View>
            ) : (
              drivers.map((driver) => {
                const active = selectedDriver === driver.id;

                return (
                  <TouchableOpacity
                    key={driver.id}
                    style={[
                      styles.driverCard,
                      active && styles.driverActive,
                    ]}
                    onPress={() => setSelectedDriver(driver.id)}
                  >
                    <Image
                      source={{ uri: driver.avatar }}
                      style={styles.avatar}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.driverName}>
                        {driver.name}
                      </Text>
                      <Text style={styles.driverMeta}>
                        ⭐ {driver.rating} • {driver.car} {driver.model}
                      </Text>
                    </View>

                    {active && (
                      <View style={styles.check}>
                        <IconSymbol
                          name="checkmark"
                          size={14}
                          color="#fff"
                        />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })
            )}
          </>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.confirmBtn,
            (!selectedDriver || drivers.length === 0) && {
              opacity: 0.5,
            },
          ]}
          onPress={confirmChange}
          disabled={!selectedDriver || drivers.length === 0}
        >
          <Text style={styles.confirmText}>
            تأكيد تغيير السائق
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F7F7F7" },
  container: { padding: 16, paddingBottom: 160 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },

  pageTitle: {
    fontSize: 26,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 24,
  },

  sectionTitleCenter: {
    fontWeight: "900",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 14,
  },

  reasonSelector: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EEE",
    flexDirection: "row-reverse",
    justifyContent: "space-between",
  },

  dropdown: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginTop: 6,
  },

  dropdownItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderColor: "#F2F2F2",
  },

  waitBox: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 20,
    alignItems: "center",
  },

  waitText: {
    marginTop: 12,
    fontWeight: "700",
    color: "#555",
  },

  emptyBox: {
    backgroundColor: "#fff",
    padding: 26,
    borderRadius: 20,
    alignItems: "center",
  },

  emptyTitle: {
    fontWeight: "900",
    fontSize: 15,
    textAlign: "center",
  },

  emptySub: {
    marginTop: 6,
    color: "#777",
    textAlign: "center",
  },

  driverCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    marginBottom: 12,
    flexDirection: "row-reverse",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EEE",
  },

  driverActive: {
    borderColor: ORANGE,
    backgroundColor: "#FFF7ED",
  },

  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    marginLeft: 14,
  },

  driverName: { fontWeight: "900", fontSize: 15 },
  driverMeta: { color: "#777", marginTop: 4 },

  check: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: ORANGE,
    alignItems: "center",
    justifyContent: "center",
  },

  footer: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    paddingTop: 10,
    backgroundColor: "#fff",
  },

  confirmBtn: {
    backgroundColor: ORANGE,
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: "center",
  },

  confirmText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 16,
  },
});