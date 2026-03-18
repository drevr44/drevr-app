import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ORANGE = "#FF9500";
const BG = "#F7F7F7";

export default function PaymentMethods() {
  const [selected, setSelected] = useState("apple");

  const MethodItem = ({ id, title, icon }: any) => (
    <TouchableOpacity
      style={[
        styles.item,
        selected === id && styles.selectedItem,
      ]}
      onPress={() => setSelected(id)}
    >
      <View style={styles.right}>
        <Text style={styles.title}>{title}</Text>
      </View>

      <Ionicons
        name={icon}
        size={24}
        color={selected === id ? ORANGE : "#999"}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>

      <MethodItem
        id="apple"
        title="Apple Pay"
        icon="logo-apple"
      />

      <MethodItem
        id="card"
        title="بطاقة مدى / فيزا / ماستركارد"
        icon="card-outline"
      />

      <MethodItem
        id="tamara"
        title="تمارا — ادفع لاحقاً"
        icon="time-outline"
      />

      <MethodItem
        id="tabby"
        title="تابي — ادفع لاحقاً"
        icon="time-outline"
      />

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: BG,
    paddingHorizontal: 16,
    paddingTop: 40,
  },

  item: {
    backgroundColor: "#fff",
    paddingVertical: 20,
    paddingHorizontal: 18,
    borderRadius: 18,
    marginBottom: 16,
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  selectedItem: {
    borderWidth: 2,
    borderColor: ORANGE,
  },

  right: {
    flexDirection: "row-reverse",
    alignItems: "center",
  },

  title: {
    fontSize: 17,
    fontWeight: "700",
  },

});