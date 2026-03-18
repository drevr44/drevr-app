import React from "react";
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

export default function HomeScreen() {
  const colors = useColors();

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* الترحيب */}
          <View style={styles.welcome}>
            <Text style={styles.title}>مرحباً بك في دريفر</Text>
            <Text style={styles.subtitle}>
              احجز رحلتك بسهولة واختر السائق المناسب
            </Text>
          </View>

          {/* زر الحجز */}
          <TouchableOpacity
            style={[styles.mainButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push("/booking/select-route")}
            activeOpacity={0.85}
          >
            <IconSymbol name="plus.circle.fill" size={28} color="#fff" />
            <Text style={styles.mainButtonText}>حجز رحلة جديدة</Text>
          </TouchableOpacity>

          {/* عنوان المميزات */}
          <Text style={styles.featuresTitle}>مميزات Drevr</Text>

          {/* البنرات */}
          <View style={styles.grid}>
            <Banner
              colors={["#2B2B2B", "#FF9500"]}
              icon="calendar"
              title="حجز مرن"
              sub="من يومين إلى 30 يوم"
            />
            <Banner
              colors={["#0E7490", "#0B3B45"]}
              icon="creditcard.fill"
              title="دفع مرن"
              sub="تابي • تمارا"
            />
            <Banner
              colors={["#2B2B2B", "#FF9500"]}
              icon="person.fill"
              title="سائق ثابت"
              sub="وتقدر تغيّره"
            />
            <Banner
              colors={["#0E7490", "#0B3B45"]}
              icon="arrow.left.and.right"
              title="ذهاب / عودة"
              sub="أنت تختار"
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function Banner({ colors, icon, title, sub }: any) {
  return (
    <LinearGradient colors={colors} style={styles.banner}>
      <View style={styles.bannerIcon}>
        <IconSymbol name={icon} size={22} color="#111" />
      </View>
      <Text style={styles.bannerTitle}>{title}</Text>
      <Text style={styles.bannerSub}>{sub}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },

  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },

  content: {
    marginTop: 40,
  },

  welcome: {
    alignItems: "center",
    marginBottom: 22,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111",
  },

  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 6,
    textAlign: "center",
  },

  mainButton: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },

  mainButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  featuresTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111",
    marginTop: 28,
    marginBottom: 10,
    textAlign: "right",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },

  banner: {
    width: "47%",
    borderRadius: 22,
    paddingVertical: 20,
    paddingHorizontal: 14,
    alignItems: "center",

    // ✨ لمسة احترافية
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  bannerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  bannerTitle: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 16,
  },

  bannerSub: {
    color: "#EAEAEA",
    fontSize: 13,
    marginTop: 4,
  },
});