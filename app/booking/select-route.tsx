import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  PanResponder,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useBookings } from "@/context/BookingsContext";

const { height } = Dimensions.get("window");

export default function SelectRoute() {
  const sheetY = useRef(new Animated.Value(0)).current;

  const { draft, startDraft, updateDraft } = useBookings();

  const [pickup, setPickup] = useState<string | null>(null);
  const [dropoff, setDropoff] = useState<string | null>(null);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        if (gesture.dy < 0) return;
        sheetY.setValue(gesture.dy);
      },
      onPanResponderRelease: (_, gesture) => {
        Animated.timing(sheetY, {
          toValue: gesture.dy > 120 ? height * 0.25 : 0,
          duration: 200,
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  const handleNext = () => {
    if (!pickup || !dropoff) return;

    // ✅ تأكد من وجود مسودة
    if (!draft) startDraft();

    // ✅ حفظ المواقع
    updateDraft({
      from: pickup,
      to: dropoff,
    });

    router.push("/booking/create");
  };

  return (
    <View style={styles.container}>
      {/* زر رجوع */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => router.back()}
        activeOpacity={0.9}
      >
        <Ionicons name="chevron-forward" size={22} color="#111" />
      </TouchableOpacity>

      <MapView
        style={StyleSheet.absoluteFillObject}
        initialRegion={{
          latitude: 26.326,
          longitude: 43.975,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {pickup && (
          <Marker
            coordinate={{ latitude: 26.326, longitude: 43.975 }}
            title="نقطة الانطلاق"
          />
        )}

        {dropoff && (
          <Marker
            coordinate={{ latitude: 26.33, longitude: 43.98 }}
            title="نقطة الوصول"
          />
        )}
      </MapView>

      <Animated.View
        style={[styles.sheet, { transform: [{ translateY: sheetY }] }]}
        {...panResponder.panHandlers}
      >
        <View style={styles.handle} />

        <Text style={styles.title}>إلى أين؟</Text>

        <TouchableOpacity
          style={styles.input}
          onPress={() => setPickup("موقعي الحالي")}
        >
          <Text style={styles.inputText}>
            {pickup ?? "اختر نقطة الانطلاق"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.input}
          onPress={() => setDropoff("وجهة مختارة")}
        >
          <Text style={styles.inputText}>
            {dropoff ?? "اختر نقطة الوصول"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.nextBtn,
            !(pickup && dropoff) && { opacity: 0.4 },
          ]}
          disabled={!(pickup && dropoff)}
          onPress={handleNext}
        >
          <Text style={styles.nextText}>
            الانتقال لإنشاء الحجز
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const ORANGE = "#FF9500";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  backBtn: {
    position: "absolute",
    top: 65,
    right: 8,
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#F2F2F2",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 50,
  },

  sheet: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: height * 0.55,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 16,
  },

  handle: {
    width: 40,
    height: 5,
    borderRadius: 10,
    backgroundColor: "#DDD",
    alignSelf: "center",
    marginBottom: 12,
  },

  title: {
    fontSize: 20,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 14,
  },

  input: {
    backgroundColor: "#F2F2F2",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },

  inputText: {
    fontSize: 15,
    fontWeight: "700",
  },

  nextBtn: {
    backgroundColor: ORANGE,
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
  },

  nextText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "900",
  },
});