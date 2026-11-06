import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, type MapPressEvent, type Region } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppColors } from "@/constants/colors";
import { publishAddressSelection, type SelectedLocation } from "@/utils/address-selection";

const initialRegion: Region = {
  latitude: -23.5505,
  longitude: -46.6333,
  latitudeDelta: 0.35,
  longitudeDelta: 0.35,
};

export default function AddressPickerScreen() {
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation | null>(null);

  const handleMapPress = (event: MapPressEvent) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
  };

  const handleConfirm = () => {
    if (!selectedLocation) return;
    publishAddressSelection(selectedLocation);
    router.back();
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="Voltar" onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={AppColors.darkBlue} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.title}>Escolha o local</Text>
          <Text style={styles.subtitle}>Mova o mapa e toque no endereço.</Text>
        </View>
      </View>

      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={initialRegion}
        onPress={handleMapPress}
        showsUserLocation={false}
        toolbarEnabled={false}
      >
        {selectedLocation ? <Marker coordinate={selectedLocation} /> : null}
      </MapView>

      <View style={styles.footer}>
        {selectedLocation ? (
          <Text style={styles.coordinates}>
            {selectedLocation.latitude.toFixed(6)}, {selectedLocation.longitude.toFixed(6)}
          </Text>
        ) : (
          <Text style={styles.hint}>Nenhum local selecionado</Text>
        )}
        <TouchableOpacity
          accessibilityRole="button"
          disabled={!selectedLocation}
          onPress={handleConfirm}
          style={[styles.confirmButton, !selectedLocation && styles.confirmDisabled]}
        >
          <Text style={styles.confirmText}>Usar este local</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: AppColors.background },
  header: { minHeight: 64, flexDirection: "row", alignItems: "center", paddingHorizontal: 14, gap: 8 },
  backButton: { width: 40, height: 44, justifyContent: "center" },
  headerText: { flex: 1 },
  title: { color: AppColors.darkBlue, fontSize: 18, fontWeight: "700" },
  subtitle: { color: AppColors.graySecondary, fontSize: 13, marginTop: 2 },
  map: { flex: 1 },
  footer: { backgroundColor: AppColors.white, paddingHorizontal: 20, paddingTop: 12, paddingBottom: 14, gap: 10 },
  coordinates: { color: AppColors.darkBlue, fontSize: 13, textAlign: "center" },
  hint: { color: AppColors.graySecondary, fontSize: 13, textAlign: "center" },
  confirmButton: { alignItems: "center", justifyContent: "center", minHeight: 50, backgroundColor: AppColors.blue, borderRadius: 12 },
  confirmDisabled: { opacity: 0.5 },
  confirmText: { color: AppColors.white, fontSize: 16, fontWeight: "700" },
});
