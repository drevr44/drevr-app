import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Linking,
  ScrollView,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useLocalSearchParams, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

/* FIX API */
const API = process.env.EXPO_PUBLIC_API_BASE_URL;

const ORANGE = "#FF9500";

export default function BookingDetailsScreen() {

  const { id } = useLocalSearchParams();

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooking();
  }, []);

  const fetchBooking = async () => {

    try {

      const token = await AsyncStorage.getItem("token");

      if (!token) return;

      const res = await fetch(`${API}/bookings/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.log("Booking fetch failed:", res.status);
        return;
      }

      const data = await res.json();

      console.log("BOOKING DETAILS:", data);

      setBooking(data);

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }

  };

  const callDriver = () => {

    if (!booking?.driver?.phone) return;

    Linking.openURL(`tel:${booking.driver.phone}`);

  };

  if (loading) {

    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={ORANGE} />
      </View>
    );

  }

  if (!booking) return null;

  return (

    <ScrollView style={styles.container}>

      <Text style={styles.sectionTitle}>
        مسار حجز الرحلة
      </Text>

      {booking.pickupLat && booking.pickupLng && (

        <View style={styles.mapCard}>

          <MapView
            style={styles.map}
            initialRegion={{
              latitude: booking.pickupLat,
              longitude: booking.pickupLng,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
            scrollEnabled={false}
            zoomEnabled={false}
            rotateEnabled={false}
            pitchEnabled={false}
          >

            <Marker
              coordinate={{
                latitude: booking.pickupLat,
                longitude: booking.pickupLng,
              }}
              title="نقطة الانطلاق"
            />

            {booking.dropLat && booking.dropLng && (

              <Marker
                coordinate={{
                  latitude: booking.dropLat,
                  longitude: booking.dropLng,
                }}
                pinColor="green"
                title="نقطة الوصول"
              />

            )}

          </MapView>

        </View>

      )}

      <View style={styles.driverCard}>

        {booking.driver ? (

          <View style={styles.driverTop}>

            <Image
              source={{
                uri:
                  booking.driver.avatar ||
                  "https://i.pravatar.cc/150",
              }}
              style={styles.driverImage}
            />

            <View style={{ flex: 1, marginRight: 14 }}>

              <View style={styles.nameRow}>

                <Text style={styles.driverName}>
                  السائق {booking.driver.name}
                </Text>

                <View style={styles.ratingBadge}>

                  <Text style={styles.ratingText}>
                    ⭐ {booking.driver.rating || "-"}
                  </Text>

                </View>

              </View>

              <Text style={styles.driverCar}>
                {booking.driver.car || "-"} • {booking.driver.model || "-"}
              </Text>

              <Text style={styles.categoryText}>
                الفئة: {booking.vehicleCategory || "-"}
              </Text>

              <Text style={styles.driverPlate}>
                اللوحة: {booking.driver.plate || "-"}
              </Text>

            </View>

          </View>

        ) : (

          <Text style={styles.noDriver}>
            لم يتم تعيين سائق بعد
          </Text>

        )}

        <View style={styles.buttonsRow}>

          <TouchableOpacity
            style={styles.callBtn}
            onPress={callDriver}
          >
            <Text style={styles.callText}>الاتصال</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.chatBtn}
            onPress={() =>
              router.push(`/booking/${id}/chat`)
            }
          >
            <Text style={styles.chatText}>المحادثة</Text>
          </TouchableOpacity>

        </View>

        <TouchableOpacity
          style={styles.changeBtn}
          onPress={() =>
            router.push({
              pathname: "/booking/driver-change",
              params: { bookingId: id },
            })
          }
        >
          <Text style={styles.changeText}>
            طلب تغيير السائق
          </Text>
        </TouchableOpacity>

      </View>

    </ScrollView>

  );

}

const styles = StyleSheet.create({

  container:{
    flex:1,
    backgroundColor:"#F5F5F7"
  },

  sectionTitle:{
    fontSize:20,
    fontWeight:"900",
    marginTop:20,
    marginBottom:10,
    textAlign:"center"
  },

  loader:{
    flex:1,
    justifyContent:"center",
    alignItems:"center"
  },

  mapCard:{
    marginHorizontal:16,
    marginBottom:20,
    borderRadius:20,
    overflow:"hidden"
  },

  map:{
    height:200,
    width:"100%"
  },

  driverCard:{
    backgroundColor:"#fff",
    marginHorizontal:16,
    marginBottom:30,
    padding:20,
    borderRadius:22
  },

  driverTop:{
    flexDirection:"row-reverse",
    alignItems:"center",
    marginBottom:16
  },

  driverImage:{
    width:78,
    height:78,
    borderRadius:40
  },

  nameRow:{
    flexDirection:"row-reverse",
    justifyContent:"space-between",
    alignItems:"center"
  },

  driverName:{
    fontSize:18,
    fontWeight:"900"
  },

  ratingBadge:{
    backgroundColor:"#F3F4F6",
    paddingHorizontal:10,
    paddingVertical:4,
    borderRadius:14
  },

  ratingText:{
    fontWeight:"700",
    color:"#444"
  },

  driverCar:{
    color:"#555",
    marginTop:6,
    fontWeight:"600"
  },

  categoryText:{
    marginTop:6,
    color:ORANGE,
    fontWeight:"800"
  },

  driverPlate:{
    marginTop:6,
    color:"#777"
  },

  buttonsRow:{
    flexDirection:"row-reverse",
    marginTop:14,
    gap:10
  },

  callBtn:{
    flex:1,
    backgroundColor:"#F3E8DC",
    padding:14,
    borderRadius:14,
    alignItems:"center"
  },

  chatBtn:{
    flex:1,
    backgroundColor:ORANGE,
    padding:14,
    borderRadius:14,
    alignItems:"center"
  },

  callText:{fontWeight:"800"},
  chatText:{color:"#fff",fontWeight:"800"},

  changeBtn:{
    marginTop:16,
    padding:14,
    borderRadius:14,
    backgroundColor:"#F2F2F2",
    alignItems:"center"
  },

  changeText:{fontWeight:"700"},

  noDriver:{
    fontWeight:"800",
    textAlign:"center"
  }

});