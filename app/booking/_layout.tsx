import { Stack, useRouter } from "expo-router";
import { Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

export default function BookingLayout() {
  const router = useRouter();

  // 🔥 رجوع + اهتزاز قوي
  const handleBack = async () => {
    await Haptics.selectionAsync();
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    router.back();
  };

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitleAlign: "center",

        // 🎨 نفس هيدر الحساب بالضبط
        headerStyle: {
          backgroundColor: "#F2F2F2",
          elevation: 0,
          shadowColor: "transparent",
        },

        headerShadowVisible: false,
        headerBackVisible: false,

        // 🔥 اللوقو في المنتصف بنفس المقاس
        headerTitle: () => (
          <Image
            source={require("../../assets/images/icon.png")}
            style={{ width: 165, height: 60 }}
            resizeMode="contain"
          />
        ),

        // 🔥 زر رجوع دائري + اهتزاز قوي
        headerRight: () => (
          <TouchableOpacity
            onPress={handleBack}
            activeOpacity={0.85}
            style={{
              marginRight: 16,
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: "#FFFFFF",
              alignItems: "center",
              justifyContent: "center",

              // ظل خفيف فاخر
              shadowColor: "#000",
              shadowOpacity: 0.08,
              shadowRadius: 4,
              shadowOffset: { width: 0, height: 2 },
              elevation: 3,
            }}
          >
            <Ionicons name="chevron-forward" size={22} color="#111" />
          </TouchableOpacity>
        ),
      }}
    >
      {/* 🚫 select-route بدون هيدر */}
      <Stack.Screen
        name="select-route"
        options={{
          headerShown: false,
        }}
      />

      {/* 🚫 payment-success بدون سهم */}
      <Stack.Screen
        name="payment-success"
        options={{
          headerRight: () => null,
        }}
      />

      {/* ✅ باقي الصفحات تستخدم نفس الهيدر */}
      <Stack.Screen name="create" />
      <Stack.Screen name="date" />
      <Stack.Screen name="bidding" />
      <Stack.Screen name="checkout" />
      <Stack.Screen name="[id]" />
      <Stack.Screen name="[id]/chat" />
      <Stack.Screen name="driver-change" />
    </Stack>
  );
}