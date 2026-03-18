import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useBookings } from "@/context/BookingsContext";

const API = process.env.EXPO_PUBLIC_API_BASE_URL;

type Captain = {
  id: string;
  name: string;
  rating: number;
  trips: number;
  car: string;
  model: string;
  plate: string;
  avatar: string;
  category: string;
};

export default function BiddingScreen() {
  const { draft, updateDraft } = useBookings();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [captains, setCaptains] = useState<Captain[]>([]);
  const [loading, setLoading] = useState(true);

  const selectedCategory = draft?.vehicleCategory;

  useEffect(() => {
    if (!selectedCategory) return;

    const fetchDrivers = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${API}/drivers?category=${selectedCategory}`
        );

        const data = await res.json();
        setCaptains(data);
      } catch (error) {
        console.error("Fetch drivers error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, [selectedCategory]);

  const selectedCaptain = captains.find(
    (c) => c.id === selectedId
  );

  const handleNext = () => {
    if (!selectedCaptain) return;

    updateDraft({
      driver: {
        id: selectedCaptain.id,
        name: selectedCaptain.name,
        rating: selectedCaptain.rating,
        car: selectedCaptain.car,
        model: selectedCaptain.model,
        plate: selectedCaptain.plate,
        avatar: selectedCaptain.avatar,
      },
    });

    router.push("/booking/checkout");
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>اختيار السائق</Text>
        <Text style={styles.subtitle}>
          السائقين المتاحين لفئة {selectedCategory}
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={ORANGE} />
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          {captains.map((c) => {
            const selected = selectedId === c.id;

            return (
              <TouchableOpacity
                key={c.id}
                activeOpacity={0.9}
                style={[styles.card, selected && styles.cardSelected]}
                onPress={() => setSelectedId(c.id)}
              >
                <Image source={{ uri: c.avatar }} style={styles.avatar} />

                <View style={styles.info}>
                  <Text style={styles.name}>{c.name}</Text>

                  <View style={styles.row}>
                    <IconSymbol name="star.fill" size={16} color="#FF9500" />
                    <Text style={styles.rating}>{c.rating}</Text>
                    <Text style={styles.trips}>• {c.trips} رحلة</Text>
                  </View>

                  <Text style={styles.car}>
                    {c.car} • موديل {c.model}
                  </Text>

                  <Text style={styles.category}>
                    الفئة: {c.category}
                  </Text>

                  <Text style={styles.plate}>
                    رقم اللوحة: {c.plate}
                  </Text>
                </View>

                {selected && (
                  <View style={styles.check}>
                    <IconSymbol name="checkmark" size={18} color="#fff" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}

          {captains.length === 0 && (
            <Text style={{ textAlign: "center", marginTop: 30 }}>
              لا يوجد سائقين لهذه الفئة حالياً
            </Text>
          )}
        </ScrollView>
      )}

      <TouchableOpacity
        style={[styles.nextBtn, !selectedId && { opacity: 0.4 }]}
        disabled={!selectedId}
        onPress={handleNext}
      >
        <Text style={styles.nextText}>المتابعة</Text>
      </TouchableOpacity>
    </View>
  );
}

const ORANGE = "#FF9500";

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F7F7F7" },

  header: {
    paddingTop: 16,
    paddingBottom: 6,
    alignItems: "center",
  },

  title: {
    fontSize: 22,
    fontWeight: "900",
  },

  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: "#666",
  },

  card: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#EEE",
  },

  cardSelected: {
    borderColor: ORANGE,
    backgroundColor: "#FFF7EC",
  },

  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginLeft: 12,
  },

  info: { flex: 1 },

  name: {
    fontSize: 16,
    fontWeight: "900",
  },

  row: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginTop: 4,
    gap: 4,
  },

  rating: { fontWeight: "800" },

  trips: {
    color: "#666",
    fontSize: 13,
  },

  car: {
    marginTop: 6,
    color: "#444",
    fontWeight: "700",
  },

  category: {
    marginTop: 2,
    color: "#FF9500",
    fontWeight: "800",
  },

  plate: {
    marginTop: 2,
    color: "#777",
    fontSize: 13,
  },

  check: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: ORANGE,
    alignItems: "center",
    justifyContent: "center",
  },

  nextBtn: {
    backgroundColor: ORANGE,
    margin: 16,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
  },

  nextText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "900",
  },
});