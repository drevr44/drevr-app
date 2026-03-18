import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Platform, Image, View } from "react-native";
import { HapticTab } from "@/components/haptic-tab";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useColors } from "@/hooks/use-colors";

export default function TabLayout() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const bottomPadding =
    Platform.OS === "web" ? 12 : Math.max(insets.bottom, 8);

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerTitleAlign: "center",

        // 🎨 نفس لون الحساب
        headerStyle: {
          backgroundColor: "#F2F2F2",
          height: 90, // 🔥 نفس ارتفاع هيدر الحساب
        },

        // ❌ إزالة الظل الافتراضي
        headerShadowVisible: false,

        // 🔥 اللوقو بنفس المقاس والمكان
        headerTitle: () => (
          <Image
            source={require("../../assets/images/icon.png")}
            style={{ width: 165, height: 60 }}
            resizeMode="contain"
          />
        ),

        // 🔥 خط سفلي مثل الحساب
        headerBackground: () => (
          <View
            style={{
              flex: 1,
              backgroundColor: "#F2F2F2",
              borderBottomWidth: 1,
              borderBottomColor: "#E5E5E5",
            }}
          />
        ),

        tabBarButton: HapticTab,
        tabBarActiveTintColor: colors.primary,
        tabBarShowLabel: true,

        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopColor: "#EEE",
          borderTopWidth: 0.5,
          paddingBottom: bottomPadding,
          paddingTop: 6,
          height: 60 + bottomPadding,
        },
      }}
    >
      {/* الرئيسية */}
      <Tabs.Screen
        name="index"
        options={{
          title: "الرئيسية",
          tabBarIcon: ({ color }) => (
            <Ionicons size={26} name="home" color={color} />
          ),
        }}
      />

      {/* الحجوزات */}
      <Tabs.Screen
        name="bookings"
        options={{
          title: "الحجوزات",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              size={26}
              name="map-marker-path"
              color={color}
            />
          ),
        }}
      />

      {/* الحساب */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "الحساب",
          headerShown: false, // يستخدم ستاك الحساب
          tabBarIcon: ({ color }) => (
            <Ionicons size={26} name="person-outline" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}