import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Linking,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppColors } from "@/constants/colors";
import { publishAddressSelection } from "@/utils/address-selection";

export default function AddressPickerWebScreen() {
  const router = useRouter();
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [error, setError] = useState("");

  const handleConfirm = () => {
    const parsedLatitude = Number(latitude.replace(",", "."));
    const parsedLongitude = Number(longitude.replace(",", "."));
    if (
      !latitude.trim() ||
      !longitude.trim() ||
      !Number.isFinite(parsedLatitude) ||
      !Number.isFinite(parsedLongitude) ||
      parsedLatitude < -90 ||
      parsedLatitude > 90 ||
      parsedLongitude < -180 ||
      parsedLongitude > 180
    ) {
      setError("Informe uma latitude entre -90 e 90 e uma longitude entre -180 e 180.");
      return;
    }

    publishAddressSelection({ latitude: parsedLatitude, longitude: parsedLongitude });
    router.back();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={22} color={AppColors.darkBlue} />
        </TouchableOpacity>
        <Text style={styles.title}>Informar localização</Text>
      </View>

      <View style={styles.content}>
        <Ionicons name="map-outline" size={36} color={AppColors.blue} />
        <Text style={styles.description}>
          A seleção direta no mapa funciona no app para Android e iOS. No navegador, abra o Google Maps e cole aqui as coordenadas do local.
        </Text>
        <TouchableOpacity
          accessibilityRole="link"
          onPress={() => void Linking.openURL("https://maps.google.com")}
          style={styles.mapsLink}
        >
          <Text style={styles.mapsLinkText}>Abrir Google Maps</Text>
          <Ionicons name="open-outline" size={17} color={AppColors.blue} />
        </TouchableOpacity>

        <View style={styles.fields}>
          <View style={styles.field}>
            <Text style={styles.label}>Latitude</Text>
            <TextInput
              keyboardType="decimal-pad"
              onChangeText={setLatitude}
              placeholder="Ex.: -23.55052"
              placeholderTextColor={AppColors.graySecondary}
              style={styles.input}
              value={latitude}
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Longitude</Text>
            <TextInput
              keyboardType="decimal-pad"
              onChangeText={setLongitude}
              placeholder="Ex.: -46.63331"
              placeholderTextColor={AppColors.graySecondary}
              style={styles.input}
              value={longitude}
            />
          </View>
        </View>
        {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
        <TouchableOpacity accessibilityRole="button" onPress={handleConfirm} style={styles.confirmButton}>
          <Text style={styles.confirmText}>Usar estas coordenadas</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: AppColors.background },
  header: { minHeight: 56, flexDirection: "row", alignItems: "center", paddingHorizontal: 14, gap: 10 },
  backButton: { width: 40, height: 44, justifyContent: "center" },
  title: { color: AppColors.darkBlue, fontSize: 18, fontWeight: "700" },
  content: { width: "100%", maxWidth: 520, alignSelf: "center", padding: 24, alignItems: "center", gap: 16 },
  description: { color: AppColors.graySecondary, fontSize: 14, lineHeight: 21, textAlign: "center" },
  mapsLink: { flexDirection: "row", alignItems: "center", gap: 6, paddingVertical: 8 },
  mapsLinkText: { color: AppColors.blue, fontSize: 15, fontWeight: "700" },
  fields: { width: "100%", gap: 14, marginTop: 8 },
  field: { gap: 6 },
  label: { color: AppColors.darkBlue, fontSize: 14, fontWeight: "600" },
  input: { backgroundColor: AppColors.white, borderColor: AppColors.border, borderWidth: 1, borderRadius: 12, color: AppColors.darkBlue, fontSize: 15, paddingHorizontal: 14, paddingVertical: 13 },
  error: { color: "#B42318", fontSize: 13, lineHeight: 19, textAlign: "center" },
  confirmButton: { width: "100%", alignItems: "center", justifyContent: "center", minHeight: 50, backgroundColor: AppColors.blue, borderRadius: 12, marginTop: 4 },
  confirmText: { color: AppColors.white, fontSize: 16, fontWeight: "700" },
});
