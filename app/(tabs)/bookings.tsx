import { useState, useMemo, useCallback } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import BookingCard from "@/components/BookingCard";

/* FIX API */
const API = process.env.EXPO_PUBLIC_API_BASE_URL;

/* الحالات */
const COMPLETED_STATUS = "COMPLETED";
const CANCELLED_STATUS = "CANCELLED";

export default function BookingsScreen() {

  const colors = useColors();

  const [bookings, setBookings] = useState<any[]>([]);
  const [tab, setTab] =
    useState<"active" | "completed" | "cancelled">("active");

  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  /* ===============================
     🔥 Fetch Bookings From Server
  ================================ */

  const fetchBookings = async () => {

    try {

      const token = await AsyncStorage.getItem("token");

      if (!token) {

        setBookings([]);
        setLoading(false);
        return;

      }

      const response = await fetch(`${API}/bookings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {

        console.log("Bookings API error", response.status);
        setBookings([]);
        setLoading(false);
        return;

      }

      const data = await response.json();

      console.log("BOOKINGS DATA:", data);

      if (!Array.isArray(data)) {

        setBookings([]);
        setLoading(false);
        return;

      }

      const normalized = data.map((b: any) => ({
        ...b,
        status: String(b.status).toUpperCase(),
      }));

      setBookings(normalized);

    } catch (error) {

      console.log("Fetch bookings error:", error);
      setBookings([]);

    } finally {

      setLoading(false);

    }

  };

  /* 🔄 كل ما تفتح الشاشة */

  useFocusEffect(
    useCallback(() => {
      fetchBookings();
    }, [])
  );

  const onRefresh = async () => {

    setRefreshing(true);

    await fetchBookings();

    setRefreshing(false);

  };

  /* ===============================
     🔥 فلترة الحجوزات
  ================================ */

  const filteredBookings = useMemo(() => {

    if (tab === "active") {

      return bookings.filter(
        (b: any) =>
          b.status !== COMPLETED_STATUS &&
          b.status !== CANCELLED_STATUS
      );

    }

    if (tab === "completed") {

      return bookings.filter(
        (b: any) => b.status === COMPLETED_STATUS
      );

    }

    if (tab === "cancelled") {

      return bookings.filter(
        (b: any) => b.status === CANCELLED_STATUS
      );

    }

    return bookings;

  }, [bookings, tab]);

  const EmptyState = () => (

    <View style={styles.empty}>

      <Text style={styles.emptyTitle}>لا توجد حجوزات</Text>

      <Text style={styles.emptySub}>
        ابدأ بحجز رحلتك الأولى الآن
      </Text>

      <TouchableOpacity
        style={[
          styles.newBookingButton,
          { backgroundColor: colors.primary },
        ]}
        onPress={() => router.push("/booking/select-route")}
      >
        <Text style={styles.newBookingButtonText}>
          حجز جديد
        </Text>
      </TouchableOpacity>

    </View>

  );

  if (loading) {

    return (

      <View style={styles.loading}>

        <ActivityIndicator
          size="large"
          color={colors.primary}
        />

      </View>

    );

  }

  return (

    <ScreenContainer style={styles.container} edges={["bottom"]}>

      <View style={{ flex: 1 }}>

        <View style={styles.titleWrapper}>

          <Text style={styles.pageTitle}>
            حجوزاتي
          </Text>

        </View>

        <View style={styles.tabsContainer}>

          <Tab
            label="نشطة"
            active={tab === "active"}
            onPress={() => setTab("active")}
          />

          <Tab
            label="مكتملة"
            active={tab === "completed"}
            onPress={() => setTab("completed")}
          />

          <Tab
            label="ملغاة"
            active={tab === "cancelled"}
            onPress={() => setTab("cancelled")}
          />

        </View>

        <FlatList
          data={filteredBookings}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 16,
            paddingBottom: 30,
          }}
          ListEmptyComponent={EmptyState}
          ItemSeparatorComponent={() => (
            <View style={{ height: 14 }} />
          )}
          renderItem={({ item }) => (
            <BookingCard
              booking={item}
              onPress={() =>
                router.push(`/booking/${item.id}`)
              }
            />
          )}
        />

      </View>

    </ScreenContainer>

  );

}

function Tab({ label, active, onPress }: any) {

  return (

    <TouchableOpacity
      onPress={onPress}
      style={[styles.tab, active && styles.activeTab]}
    >

      <Text
        style={[
          styles.tabText,
          active && styles.activeTabText,
        ]}
      >

        {label}

      </Text>

    </TouchableOpacity>

  );

}

const styles = StyleSheet.create({

  container:{
    flex:1,
    backgroundColor:"#F5F5F7"
  },

  loading:{
    flex:1,
    justifyContent:"center",
    alignItems:"center"
  },

  titleWrapper:{
    alignItems:"center",
    marginTop:10,
    marginBottom:8
  },

  pageTitle:{
    fontSize:26,
    fontWeight:"900"
  },

  tabsContainer:{
    flexDirection:"row-reverse",
    marginHorizontal:16,
    marginBottom:14,
    backgroundColor:"#EFEFEF",
    borderRadius:14,
    padding:4
  },

  tab:{
    flex:1,
    alignItems:"center",
    paddingVertical:10,
    borderRadius:10
  },

  activeTab:{
    backgroundColor:"#fff"
  },

  tabText:{
    fontSize:14,
    color:"#777",
    fontWeight:"600"
  },

  activeTabText:{
    color:"#111",
    fontWeight:"800"
  },

  empty:{
    flex:1,
    alignItems:"center",
    justifyContent:"center",
    padding:24
  },

  emptyTitle:{
    fontSize:18,
    fontWeight:"900",
    marginTop:10
  },

  emptySub:{
    color:"#777",
    marginTop:6
  },

  newBookingButton:{
    paddingVertical:14,
    paddingHorizontal:24,
    borderRadius:14,
    marginTop:20,
    alignItems:"center"
  },

  newBookingButtonText:{
    color:"#fff",
    fontSize:15,
    fontWeight:"800"
  }

});