import React, { useEffect, useState } from "react";
import {
View,
Text,
StyleSheet,
TouchableOpacity,
ScrollView,
Image,
Alert,
ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";

const ORANGE = "#FF9500";
const RED = "#FF3B30";
const BG = "#F7F7F7";

/* FIX API URL */
const API = process.env.EXPO_PUBLIC_API_BASE_URL;

export default function ProfileScreen() {

const [user,setUser] = useState<any>(null);
const [loading,setLoading] = useState(true);
const [avatar,setAvatar] = useState<string | null>(null);

useEffect(()=>{

const init = async ()=>{
await fetchProfile();

const saved = await AsyncStorage.getItem("avatar");
if(saved) setAvatar(saved);
};

init();

},[]);

/* =========================
   جلب بيانات المستخدم
========================= */

const fetchProfile = async ()=>{

try{

const token = await AsyncStorage.getItem("token");

if(!token){
router.replace("/(auth)");
return;
}

const response = await fetch(`${API}/users/me`,{
headers:{
Authorization:`Bearer ${token}`
}
});

if(response.status===401){

await AsyncStorage.removeItem("token");
router.replace("/(auth)");
return;

}

const data = await response.json();

/* DEBUG */
console.log("USER DATA:",data);

setUser(data);

}catch(e){

console.log("Profile Error",e);

}
finally{

setLoading(false);

}

};

/* =========================
   اختيار صورة
========================= */

const pickImage = async ()=>{

const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

if(!permission.granted){

Alert.alert("نحتاج إذن للوصول للصور");
return;

}

const result = await ImagePicker.launchImageLibraryAsync({
mediaTypes:ImagePicker.MediaTypeOptions.Images,
quality:0.7
});

if(!result.canceled){

const uri = result.assets[0].uri;

setAvatar(uri);

await AsyncStorage.setItem("avatar",uri);

}

};

/* حذف الصورة */

const removeImage = async ()=>{

await AsyncStorage.removeItem("avatar");
setAvatar(null);

};

/* الضغط على الصورة */

const handleAvatarPress = ()=>{

if(!avatar){

pickImage();
return;

}

Alert.alert(
"الصورة الشخصية",
"ماذا تريد أن تفعل؟",
[
{ text:"تغيير الصورة", onPress:pickImage },
{ text:"إزالة الصورة", style:"destructive", onPress:removeImage },
{ text:"إلغاء", style:"cancel" }
]
);

};

/* تسجيل الخروج */

const handleLogout = ()=>{

Alert.alert("تسجيل الخروج","هل أنت متأكد؟",[
{text:"إلغاء",style:"cancel"},
{
text:"تسجيل الخروج",
style:"destructive",
onPress:async()=>{
await AsyncStorage.removeItem("token");
router.replace("/(auth)");
}
}
]);

};

/* عنصر القائمة */

const MenuItem = ({icon,title,onPress}:any)=>(

<TouchableOpacity style={styles.menuItem} onPress={onPress}>

<View style={styles.menuRight}>
<Text style={styles.menuText}>{title}</Text>
</View>

<Ionicons name={icon} size={20} color={ORANGE}/>

</TouchableOpacity>

);

/* شاشة التحميل */

if(loading){

return(

<View style={styles.loader}>
<ActivityIndicator size="large" color={ORANGE}/>
</View>

);

}

/* =========================
   الشاشة
========================= */

return (

<View style={styles.screen}>

<ScrollView contentContainerStyle={{paddingBottom:40}}>

<View style={styles.profileCard}>

<View style={styles.avatarWrapper}>

<TouchableOpacity onPress={handleAvatarPress}>

{avatar ? (

<Image
source={{ uri: avatar }}
style={styles.avatar}
/>

) : (

<View style={styles.avatar}>
<Ionicons name="person" size={60} color="#999"/>
</View>

)}

</TouchableOpacity>

<TouchableOpacity style={styles.cameraBtn} onPress={pickImage}>
<Ionicons name="camera" size={18} color="#fff"/>
</TouchableOpacity>

</View>

<Text style={styles.mainName}>
{user?.name || "مستخدم"}
</Text>

<Text style={styles.email}>
{user?.email || ""}
</Text>

<Text style={styles.phone}>
{user?.phone || ""}
</Text>

<Text style={styles.phone}>
{user?.gender === "female" ? "أنثى" : "ذكر"}
</Text>

</View>

<View style={styles.card}>
<MenuItem icon="card-outline" title="طرق الدفع" onPress={()=>router.push("/(tabs)/profile/wallet/payment-methods")}/>
<MenuItem icon="receipt-outline" title="الفواتير" onPress={()=>router.push("/(tabs)/profile/wallet/invoices")}/>
</View>

<View style={styles.card}>
<MenuItem icon="help-circle-outline" title="مركز المساعدة" onPress={()=>router.push("/(tabs)/profile/support/help")}/>
<MenuItem icon="chatbubble-ellipses-outline" title="تواصل معنا" onPress={()=>router.push("/(tabs)/profile/support/contact")}/>
<MenuItem icon="warning-outline" title="الشكاوى" onPress={()=>router.push("/(tabs)/profile/support/complaints")}/>
</View>

<View style={styles.card}>
<MenuItem icon="document-text-outline" title="سياسة الخصوصية" onPress={()=>router.push("/(tabs)/profile/legal/privacy")}/>
<MenuItem icon="document-outline" title="الشروط والأحكام" onPress={()=>router.push("/(tabs)/profile/legal/terms")}/>
</View>

<TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
<Text style={styles.logoutText}>تسجيل الخروج</Text>
</TouchableOpacity>

</ScrollView>

</View>

);

}

/* =========================
   STYLES
========================= */

const styles = StyleSheet.create({

screen:{flex:1,backgroundColor:BG},

loader:{flex:1,justifyContent:"center",alignItems:"center"},

profileCard:{
backgroundColor:"#fff",
borderRadius:24,
margin:16,
paddingVertical:24,
paddingHorizontal:20,
alignItems:"center"
},

avatarWrapper:{
position:"relative",
marginBottom:14
},

avatar:{
width:120,
height:120,
borderRadius:60,
backgroundColor:"#EDEDED",
justifyContent:"center",
alignItems:"center"
},

cameraBtn:{
position:"absolute",
bottom:0,
right:0,
backgroundColor:ORANGE,
width:36,
height:36,
borderRadius:18,
justifyContent:"center",
alignItems:"center",
borderWidth:3,
borderColor:"#fff"
},

mainName:{
fontSize:24,
fontWeight:"900",
marginBottom:6
},

email:{
fontSize:16,
color:"#666",
marginBottom:4
},

phone:{
fontSize:16,
color:"#666"
},

card:{
backgroundColor:"#fff",
borderRadius:20,
marginHorizontal:16,
marginBottom:16,
overflow:"hidden"
},

menuItem:{
paddingVertical:16,
paddingHorizontal:16,
borderBottomWidth:1,
borderColor:"#F1F1F1",
flexDirection:"row-reverse",
justifyContent:"space-between",
alignItems:"center"
},

menuRight:{
flexDirection:"row-reverse",
alignItems:"center",
gap:10
},

menuText:{
fontWeight:"800",
fontSize:15
},

logoutBtn:{
backgroundColor:RED,
marginHorizontal:16,
paddingVertical:16,
borderRadius:20,
alignItems:"center"
},

logoutText:{
color:"#fff",
fontWeight:"900",
fontSize:16
}

});