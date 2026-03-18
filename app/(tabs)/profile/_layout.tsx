import { Stack, useRouter } from "expo-router";
import { Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

export default function ProfileLayout() {
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

        headerStyle: {
          backgroundColor: "#F2F2F2",
          elevation: 0,
          shadowColor: "transparent",
        },

        headerBackVisible: false,

        headerTitle: () => (
          <Image
            source={require("../../../assets/images/icon.png")}
            style={{ width: 165, height: 60 }}
            resizeMode="contain"
          />
        ),

        // 🔥 سهم رجوع دائري يمين مع اهتزاز قوي
        headerRight: () => (
          <TouchableOpacity
            onPress={handleBack}
            activeOpacity={0.8}
            style={{
              marginRight: 16,
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: "#FFFFFF",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="chevron-forward" size={22} color="#111" />
          </TouchableOpacity>
        ),
      }}
    >
      {/* الصفحة الرئيسية بدون سهم */}
      <Stack.Screen
        name="index"
        options={{
          headerRight: () => null,
        }}
      />

      <Stack.Screen name="edit" />
      <Stack.Screen name="wallet/balance" />
      <Stack.Screen name="wallet/payment-methods" />
      <Stack.Screen name="wallet/invoices" />
      <Stack.Screen name="support/help" />
      <Stack.Screen name="support/contact" />
      <Stack.Screen name="support/complaints" />
      <Stack.Screen name="settings/language" />
      <Stack.Screen name="settings/notifications" />
      <Stack.Screen name="legal/terms" />
      <Stack.Screen name="legal/privacy" />
    </Stack>
  );
}