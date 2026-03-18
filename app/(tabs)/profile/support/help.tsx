import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const FAQ = [
  {
    question: "كيف أحجز رحلة؟",
    answer:
      "يمكنك اختيار الموقع من الخريطة ثم تحديد الوقت ونوع المركبة وإرسال الطلب.",
  },
  {
    question: "كيف يمكنني الدفع؟",
    answer:
      "يمكنك الدفع عبر Apple Pay أو مدى أو تابي أو تمارا أو البطاقة البنكية.",
  },
  {
    question: "هل يمكن تغيير السائق؟",
    answer:
      "نعم، يمكنك طلب تغيير السائق من صفحة تفاصيل الحجز.",
  },
  {
    question: "كيف ألغي الحجز؟",
    answer:
      "يمكنك إلغاء الحجز قبل وصول السائق دون رسوم إضافية.",
  },
  {
    question: "متى يتم استرجاع المبلغ؟",
    answer:
      "يتم استرجاع المبلغ خلال 3 إلى 7 أيام عمل حسب البنك.",
  },
];

export default function HelpScreen() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>مركز المساعدة</Text>
        <Text style={styles.subtitle}>
          اختر السؤال لمعرفة التفاصيل
        </Text>
      </View>

      {/* FAQ */}
      {FAQ.map((item, index) => {
        const open = openIndex === index;

        return (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => toggle(index)}
            activeOpacity={0.85}
          >
            <View style={styles.row}>
              <Text style={styles.question}>{item.question}</Text>
              <Ionicons
                name={open ? "chevron-up" : "chevron-down"}
                size={20}
                color="#555"
              />
            </View>

            {open && (
              <Text style={styles.answer}>{item.answer}</Text>
            )}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
    backgroundColor: "#F7F7F7",
  },

  header: {
    alignItems: "center",
    marginBottom: 24,
  },

  title: {
    fontSize: 24,
    fontWeight: "900",
    textAlign: "center",
  },

  subtitle: {
    color: "#777",
    marginTop: 6,
    fontSize: 14,
    textAlign: "center",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },

  row: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },

  /* ✅ النص أقصى اليمين بدون تغيير مكان السهم */
  question: {
    fontWeight: "800",
    fontSize: 15,
    flex: 1,
    textAlign: "right",
    writingDirection: "rtl",
  },

  answer: {
    marginTop: 12,
    color: "#555",
    lineHeight: 20,
    fontSize: 14,
    textAlign: "right",
    writingDirection: "rtl",
  },
});