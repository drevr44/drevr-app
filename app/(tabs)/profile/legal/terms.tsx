import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function TermsScreen() {
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>الشروط والأحكام</Text>

        <Text style={styles.paragraph}>
          باستخدامك للتطبيق فإنك توافق على الالتزام بالشروط والأحكام
          التالية. يرجى قراءتها بعناية قبل استخدام الخدمة.
        </Text>

        <Text style={styles.section}>1. استخدام الخدمة</Text>
        <Text style={styles.paragraph}>
          يحق للمستخدم استخدام التطبيق لطلب خدمات النقل فقط، ويجب
          استخدام الخدمة بطريقة قانونية ومسؤولة.
        </Text>

        <Text style={styles.section}>2. حساب المستخدم</Text>
        <Text style={styles.paragraph}>
          أنت مسؤول عن صحة المعلومات المقدمة، والحفاظ على سرية بيانات
          حسابك وعدم مشاركتها مع الآخرين.
        </Text>

        <Text style={styles.section}>3. الدفع</Text>
        <Text style={styles.paragraph}>
          يتم احتساب رسوم الرحلات وفق الأسعار المعروضة داخل التطبيق،
          ويجب إتمام الدفع باستخدام وسائل الدفع المتاحة.
        </Text>

        <Text style={styles.section}>4. إلغاء الرحلات</Text>
        <Text style={styles.paragraph}>
          قد يتم فرض رسوم عند إلغاء الرحلة بعد قبول السائق للطلب أو بعد
          بدء الرحلة.
        </Text>

        <Text style={styles.section}>5. حدود المسؤولية</Text>
        <Text style={styles.paragraph}>
          التطبيق يعمل كوسيط تقني لربط المستخدمين بالسائقين، ولا يتحمل
          المسؤولية عن أي أضرار أو خسائر ناتجة عن سوء الاستخدام.
        </Text>

        <Text style={styles.section}>6. التعديلات</Text>
        <Text style={styles.paragraph}>
          نحتفظ بالحق في تعديل الشروط والأحكام في أي وقت، وسيتم نشر
          التحديثات داخل التطبيق.
        </Text>

        <Text style={styles.footer}>
          آخر تحديث: 2026
        </Text>
      </ScrollView>
    </View>
  );
}

/* ================= Styles ================= */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },

  container: {
    padding: 16,
    paddingBottom: 40,
  },

  title: {
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 16,
    textAlign: "right",
  },

  section: {
    fontSize: 16,
    fontWeight: "900",
    marginTop: 16,
    marginBottom: 6,
    textAlign: "right",
  },

  paragraph: {
    color: "#444",
    lineHeight: 22,
    textAlign: "right",
  },

  footer: {
    marginTop: 24,
    color: "#999",
    textAlign: "center",
    fontSize: 12,
  },
});