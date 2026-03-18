import React, { useMemo, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import { useBookings } from "@/context/BookingsContext";

/* ✅ حل مشكلة التايم زون نهائياً */
function dateKey(d: Date) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function monthKey(d: Date) {
  return `${d.getFullYear()}-${d.getMonth()}`;
}

function monthLabelAr(d: Date) {
  const months = [
    "يناير","فبراير","مارس","أبريل","مايو","يونيو",
    "يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر",
  ];
  return `${months[d.getMonth()]} ${d.getFullYear()}`;
}

function formatTimeAr(date: Date) {
  let h = date.getHours();
  const m = date.getMinutes();
  const isPM = h >= 12;
  const hh12 = ((h + 11) % 12) + 1;
  return `${hh12}:${m.toString().padStart(2, "0")} ${isPM ? "م" : "ص"}`;
}

export default function BookingDate() {
  const { draft, updateDraft, setSelectedDates } = useBookings();
  const isRoundTrip = draft?.tripType === "round_trip";

  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);

  const allowedDays = useMemo(
    () =>
      Array.from({ length: 30 }).map((_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        return d;
      }),
    [today]
  );

  const monthGroups = useMemo(() => {
    const groups: any[] = [];
    for (const d of allowedDays) {
      const mk = monthKey(d);
      let g = groups.find((x) => x.key === mk);
      if (!g) {
        g = { key: mk, label: monthLabelAr(d), days: [] };
        groups.push(g);
      }
      g.days.push(d);
    }
    return groups;
  }, [allowedDays]);

  const [selectedDays, setSelectedDaysState] = useState<string[]>([]);

  /* ✅ مزامنة عند الرجوع للصفحة */
  useEffect(() => {
    if (draft?.selectedDates && Array.isArray(draft.selectedDates)) {
      setSelectedDaysState(draft.selectedDates);
    }
  }, [draft?.selectedDates]);

  /* ✅ ترتيب دائم تصاعدي */
  const toggleDay = (d: Date) => {
    const key = dateKey(d);

    setSelectedDaysState((prev) => {
      const updated = prev.includes(key)
        ? prev.filter((x) => x !== key)
        : [...prev, key];

      return updated.sort(
        (a, b) => new Date(a).getTime() - new Date(b).getTime()
      );
    });
  };

  const [departTime, setDepartTime] = useState(new Date());
  const [returnTime, setReturnTime] = useState(new Date());

  const [showDepartPicker, setShowDepartPicker] = useState(false);
  const [showReturnPicker, setShowReturnPicker] = useState(false);

  const daysCount = selectedDays.length;
  const price = daysCount * 50;

  const handleNext = () => {
    if (daysCount < 2) {
      Alert.alert("تنبيه", "الحد الأدنى للحجز يومين");
      return;
    }

    const sorted = [...selectedDays].sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );

    /* ✅ حفظ الأيام المختارة في الكونتكست */
    setSelectedDates(sorted);

    /* ✅ (مهم جداً) خزنها داخل draft أيضاً + خزن days */
    updateDraft({
      selectedDates: sorted,
      days: daysCount,
      departTime: formatTimeAr(departTime),
      returnTime: isRoundTrip ? formatTimeAr(returnTime) : undefined,
      price,
    });

    router.push("/booking/bidding");
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>اختر أيام الرحلة</Text>

          {monthGroups.map((g, idx) => (
            <View key={g.key} style={{ marginTop: idx ? 12 : 6 }}>
              {idx > 0 && <View style={styles.divider} />}
              <Text style={styles.monthLabel}>{g.label}</Text>

              <View style={styles.grid}>
                {g.days.map((d: Date) => {
                  const key = dateKey(d);
                  const selected = selectedDays.includes(key);

                  return (
                    <TouchableOpacity
                      key={key}
                      style={[styles.dayBtn, selected && styles.daySelected]}
                      onPress={() => toggleDay(d)}
                    >
                      <Text style={[styles.dayText, selected && styles.dayTextSelected]}>
                        {d.getDate()}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>وقت الذهاب</Text>

          <TouchableOpacity
            style={styles.timeBox}
            onPress={() => setShowDepartPicker(true)}
          >
            <Text style={styles.timeValue}>{formatTimeAr(departTime)}</Text>
          </TouchableOpacity>

          {showDepartPicker && (
            <DateTimePicker
              value={departTime}
              mode="time"
              display="spinner"
              onChange={(_, d) => {
                setShowDepartPicker(false);
                if (d) setDepartTime(d);
              }}
            />
          )}
        </View>

        {isRoundTrip && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>وقت العودة</Text>

            <TouchableOpacity
              style={styles.timeBox}
              onPress={() => setShowReturnPicker(true)}
            >
              <Text style={styles.timeValue}>{formatTimeAr(returnTime)}</Text>
            </TouchableOpacity>

            {showReturnPicker && (
              <DateTimePicker
                value={returnTime}
                mode="time"
                display="spinner"
                onChange={(_, d) => {
                  setShowReturnPicker(false);
                  if (d) setReturnTime(d);
                }}
              />
            )}
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.summaryTitle}>ملخص الحجز</Text>
          <Text style={styles.summaryValue}>
            {daysCount} أيام • {price} ر.س
          </Text>
        </View>

        <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
          <Text style={styles.nextText}>التالي</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const ORANGE = "#FF9500";

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F7F7F7" },
  container: { padding: 14, paddingBottom: 20 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 12,
    marginBottom: 10,
    elevation: 2,
  },

  cardTitle: {
    fontWeight: "900",
    textAlign: "right",
    fontSize: 16,
  },

  monthLabel: {
    fontWeight: "900",
    marginBottom: 6,
    textAlign: "right",
  },

  grid: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: 6,
  },

  dayBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#EEE",
    alignItems: "center",
    justifyContent: "center",
  },

  daySelected: { backgroundColor: ORANGE },

  dayText: { fontWeight: "900" },

  dayTextSelected: { color: "#fff" },

  timeBox: {
    backgroundColor: "#F2F2F2",
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: "center",
  },

  timeValue: {
    fontSize: 18,
    fontWeight: "900",
  },

  summaryTitle: {
    textAlign: "center",
    fontWeight: "900",
    fontSize: 16,
  },

  summaryValue: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "900",
    marginTop: 6,
  },

  divider: {
    height: 1,
    backgroundColor: "#EEE",
    marginVertical: 10,
  },

  nextBtn: {
    backgroundColor: ORANGE,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },

  nextText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 16,
  },
});