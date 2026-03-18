import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useBookings } from "@/context/BookingsContext";

type TripType = "one_way" | "round_trip";
type VehicleCategory = "اقتصادي" | "سيدان" | "بريميوم";

export default function CreateBooking() {
  const { updateDraft } = useBookings();

  const [tripType, setTripType] = useState<TripType>("one_way");
  const [vehicleCategory, setVehicleCategory] =
    useState<VehicleCategory>("اقتصادي");

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    setIsLoading(true);

    updateDraft({
      tripType,
      vehicleCategory,
    });

    router.push("/booking/date");
    setIsLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#FAFAFA" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={title}>حجز جديد</Text>

        <View style={{ paddingHorizontal: 20 }}>
          {/* ===== نوع الرحلة ===== */}
          <View style={card}>
            <Text style={sectionTitle}>نوع الرحلة</Text>

            <View style={{ flexDirection: "row-reverse", gap: 10 }}>
              {[
                { key: "one_way", label: "ذهاب فقط" },
                { key: "round_trip", label: "ذهاب وعودة" },
              ].map((item) => (
                <TouchableOpacity
                  key={item.key}
                  onPress={() => setTripType(item.key as TripType)}
                  style={[
                    tripBtn,
                    tripType === item.key && tripActive,
                  ]}
                >
                  <Text
                    style={{
                      color: tripType === item.key ? "#fff" : "#111",
                      fontWeight: "900",
                    }}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* ===== نوع السيارة ===== */}
          <View style={card}>
            <Text style={sectionTitle}>نوع السيارة</Text>

            {[
              {
                key: "اقتصادي",
                label: "اقتصادي",
                sub: "سعر مناسب",
                icon: "car.fill",
              },
              {
                key: "سيدان",
                label: "سيدان",
                sub: "راحة يومية",
                icon: "car",
              },
              {
                key: "بريميوم",
                label: "بريميوم",
                sub: "تجربة فاخرة",
                icon: "sparkles",   // ⭐ رجعنا أيقونة البريميوم
              },
            ].map((c) => {
              const active = vehicleCategory === c.key;

              return (
                <TouchableOpacity
                  key={c.key}
                  onPress={() =>
                    setVehicleCategory(c.key as VehicleCategory)
                  }
                  style={[
                    carCard,
                    active && {
                      borderColor: "#FF9500",
                      backgroundColor: "#FFF7EC",
                    },
                  ]}
                >
                  <View
                    style={{
                      flexDirection: "row-reverse",
                      alignItems: "center",
                    }}
                  >
                    <IconSymbol
                      name={c.icon as any}
                      size={26}
                      color={active ? "#FF9500" : "#111"}
                    />

                    <View style={{ flex: 1, marginRight: 10 }}>
                      <Text
                        style={{
                          fontWeight: "900",
                          textAlign: "right",
                        }}
                      >
                        {c.label}
                      </Text>

                      <Text
                        style={{
                          color: "#777",
                          textAlign: "right",
                          marginTop: 2,
                        }}
                      >
                        {c.sub}
                      </Text>
                    </View>

                    {active && (
                      <View style={check}>
                        <Text
                          style={{ color: "#fff", fontWeight: "900" }}
                        >
                          ✓
                        </Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* ===== زر المتابعة ===== */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isLoading}
            style={confirmBtn}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={confirmText}>متابعة</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* styles */

const title = {
  fontSize: 24,
  fontWeight: "900" as const,
  textAlign: "center" as const,
  marginTop: 20,
  marginBottom: 20,
};

const card = {
  backgroundColor: "#fff",
  borderRadius: 18,
  padding: 16,
  marginBottom: 16,
  elevation: 2,
};

const sectionTitle = {
  fontWeight: "900" as const,
  marginBottom: 12,
  textAlign: "right" as const,
};

const tripBtn = {
  flex: 1,
  paddingVertical: 12,
  borderRadius: 14,
  borderWidth: 1,
  borderColor: "#E5E5E5",
  alignItems: "center" as const,
};

const tripActive = {
  backgroundColor: "#FF9500",
  borderColor: "#FF9500",
};

const carCard = {
  borderWidth: 1,
  borderColor: "#E5E5E5",
  borderRadius: 16,
  padding: 14,
  marginBottom: 10,
};

const check = {
  width: 24,
  height: 24,
  borderRadius: 12,
  backgroundColor: "#FF9500",
  alignItems: "center" as const,
  justifyContent: "center" as const,
};

const confirmBtn = {
  backgroundColor: "#FF9500",
  borderRadius: 18,
  paddingVertical: 16,
  alignItems: "center" as const,
  marginTop: 10,
  marginBottom: 30,
};

const confirmText = {
  color: "#fff",
  fontSize: 18,
  fontWeight: "900" as const,
};