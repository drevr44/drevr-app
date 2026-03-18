import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function PrivacyScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>سياسة الخصوصية</Text>

      <Text style={styles.paragraph}>
        نحن نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية. توضح هذه السياسة
        كيفية جمع المعلومات واستخدامها وحمايتها عند استخدامك للتطبيق.
      </Text>

      <Text style={styles.sectionTitle}>المعلومات التي نقوم بجمعها</Text>
      <Text style={styles.paragraph}>
        قد نقوم بجمع المعلومات التالية:
      </Text>
      <Text style={styles.listItem}>• الاسم ورقم الهاتف والبريد الإلكتروني</Text>
      <Text style={styles.listItem}>• معلومات الموقع لتحسين تجربة الخدمة</Text>
      <Text style={styles.listItem}>• بيانات الدفع لإتمام العمليات المالية</Text>

      <Text style={styles.sectionTitle}>كيفية استخدام المعلومات</Text>
      <Text style={styles.paragraph}>
        نستخدم معلوماتك من أجل:
      </Text>
      <Text style={styles.listItem}>• تقديم وتحسين الخدمات</Text>
      <Text style={styles.listItem}>• التواصل معك بخصوص الرحلات أو الدعم</Text>
      <Text style={styles.listItem}>• ضمان الأمان ومنع الاحتيال</Text>

      <Text style={styles.sectionTitle}>مشاركة المعلومات</Text>
      <Text style={styles.paragraph}>
        نحن لا نبيع أو نؤجر معلوماتك الشخصية. قد تتم مشاركة المعلومات فقط مع:
      </Text>
      <Text style={styles.listItem}>• مزودي خدمات الدفع</Text>
      <Text style={styles.listItem}>• الجهات التنظيمية عند الطلب القانوني</Text>

      <Text style={styles.sectionTitle}>حماية البيانات</Text>
      <Text style={styles.paragraph}>
        نستخدم تقنيات أمان متقدمة لحماية بياناتك من الوصول غير المصرح به.
      </Text>

      <Text style={styles.sectionTitle}>حقوقك</Text>
      <Text style={styles.paragraph}>
        يمكنك طلب تحديث أو حذف بياناتك الشخصية في أي وقت عبر التواصل مع الدعم.
      </Text>

      <Text style={styles.sectionTitle}>التعديلات على السياسة</Text>
      <Text style={styles.paragraph}>
        قد نقوم بتحديث سياسة الخصوصية من وقت لآخر. سيتم إشعارك بأي تغييرات
        مهمة عبر التطبيق.
      </Text>

      <Text style={styles.footer}>
        آخر تحديث: 2026
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },

  title: {
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 16,
    textAlign: "center",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "900",
    marginTop: 16,
    marginBottom: 6,
    textAlign: "right",
  },

  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    color: "#444",
    textAlign: "right",
  },

  listItem: {
    fontSize: 14,
    lineHeight: 22,
    color: "#444",
    textAlign: "right",
  },

  footer: {
    marginTop: 24,
    textAlign: "center",
    color: "#999",
  },
});