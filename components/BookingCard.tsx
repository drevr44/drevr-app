import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";

const ORANGE = "#FF9500";
const GREEN = "#22C55E";

export default function BookingCard({ booking }: any) {
  const driver = booking.driver || {};
  const logs = booking.dailyLogs || [];

  /* ================= ترتيب الأيام ================= */

  const sortedLogs = useMemo(() => {
    return [...logs].sort(
      (a: any, b: any) =>
        new Date(a.date).getTime() -
        new Date(b.date).getTime()
    );
  }, [logs]);

  /* ================= الحساب ================= */

  const totalDays = sortedLogs.length;

  const completedDays = sortedLogs.filter(
    (d: any) => d.status === "COMPLETED"
  ).length;

  const progress =
    totalDays > 0
      ? (completedDays / totalDays) * 100
      : 0;

  const openBooking = () => {
    router.push(`/booking/${booking.id}`);
  };

  /* ================= استخراج رقم اليوم ================= */

  const extractDay = (date: string) => {
    if (!date) return "";
    return new Date(date).getDate();
  };

  /* ================= لون الحالة ================= */

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return ORANGE;
      case "NO_SHOW":
        return "#EF4444";
      case "CANCELLED":
        return "#999";
      default:
        return "#E5E7EB";
    }
  };

  /* ================= UI ================= */

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={openBooking}
      style={styles.card}
    >
      {/* السعر + السائق */}
      <View style={styles.headerRow}>
        <Text style={styles.price}>
          {booking.price} ر.س
        </Text>

        <View style={styles.driverBox}>
          <Text style={styles.driverName}>
            السائق {driver.name || "—"}
          </Text>

          <Image
            source={{
              uri:
                driver.avatar ||
                "https://i.pravatar.cc/100",
            }}
            style={styles.avatar}
          />
        </View>
      </View>

      {/* عدد الأيام */}
      <Text style={styles.daysText}>
        {completedDays} من {totalDays} أيام
      </Text>

      {/* الدوائر */}
      <View style={styles.daysRow}>
        {sortedLogs.map((day: any) => (
          <View
            key={day.id}
            style={[
              styles.dayCircle,
              {
                backgroundColor: getStatusColor(
                  day.status
                ),
              },
            ]}
          >
            <Text
              style={[
                styles.dayText,
                day.status !== "PENDING" &&
                  styles.dayTextActive,
              ]}
            >
              {extractDay(day.date)}
            </Text>
          </View>
        ))}
      </View>

      {/* شريط التقدم */}
      <View style={styles.progressBg}>
        <View
          style={[
            styles.progressFill,
            { width: `${progress}%` },
          ]}
        />
      </View>

      {/* الوقت */}
      <Text style={styles.timeText}>
        ذهاب: {booking.departTime || "—"}
      </Text>

      {booking.returnTime && (
        <Text style={styles.timeText}>
          عودة: {booking.returnTime}
        </Text>
      )}

      {/* السيارة */}
      <Text style={styles.carInfo}>
        {driver.car || "—"} • موديل{" "}
        {driver.model || "—"}
      </Text>

      {booking.vehicleCategory && (
        <Text style={styles.category}>
          الفئة: {booking.vehicleCategory}
        </Text>
      )}

      <Text style={styles.carInfo}>
        اللوحة: {driver.plate || "—"}
      </Text>

      <Text style={styles.rating}>
        ⭐ {driver.rating ?? "—"}
      </Text>

      {/* الحالة */}
      <View style={styles.activeBadge}>
        <Text style={styles.activeText}>
          نشطة
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: "#EEE",
  },

  headerRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },

  price: {
    color: ORANGE,
    fontSize: 22,
    fontWeight: "900",
  },

  driverBox: {
    flexDirection: "row-reverse",
    alignItems: "center",
  },

  driverName: {
    fontSize: 18,
    fontWeight: "900",
    marginLeft: 10,
  },

  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
  },

  daysText: {
    marginTop: 10,
    color: "#666",
    fontWeight: "700",
  },

  daysRow: {
    flexDirection: "row-reverse",
    marginTop: 10,
    flexWrap: "wrap",
  },

  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    margin: 4,
  },

  dayText: {
    fontSize: 12,
    fontWeight: "900",
    color: "#333",
  },

  dayTextActive: {
    color: "#fff",
  },

  progressBg: {
    height: 6,
    backgroundColor: "#EEE",
    borderRadius: 10,
    marginTop: 10,
    overflow: "hidden",
  },

  progressFill: {
    height: 6,
    backgroundColor: ORANGE,
  },

  timeText: {
    marginTop: 8,
    color: "#555",
    fontWeight: "600",
  },

  carInfo: {
    marginTop: 6,
    color: "#666",
    fontWeight: "600",
  },

  category: {
    marginTop: 4,
    color: ORANGE,
    fontWeight: "800",
  },

  rating: {
    marginTop: 6,
    fontWeight: "700",
  },

  activeBadge: {
    marginTop: 12,
    alignSelf: "flex-start",
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
  },

  activeText: {
    color: GREEN,
    fontWeight: "800",
  },
});