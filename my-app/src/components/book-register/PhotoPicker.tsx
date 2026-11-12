import { AppColors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import {
  Alert,
  Image,
  Pressable,
  Platform,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

type Props = {
  photos: string[];
  onChange: (photos: string[]) => void;
  max?: number;
  error?: string;
};

export function PhotoPicker({ photos, onChange, max = 8, error }: Props) {
  const { width } = useWindowDimensions();
  const size = (width - 20 * 2 - 12 * (3 - 1)) / 3;
  const remaining = max - photos.length;

  const addUris = (uris: string[]) =>
    onChange([...photos, ...uris].slice(0, max));

  const pickFromLibrary = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      selectionLimit: remaining,
      quality: 0.8,
    });
    if (!result.canceled) addUris(result.assets.map((a) => a.uri));
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Permissão necessária",
        "Permita o acesso à câmera para tirar fotos.",
      );
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    if (!result.canceled) addUris(result.assets.map((a) => a.uri));
  };

  const handleAdd = () => {
    if (Platform.OS === "web") {
      void pickFromLibrary();
      return;
    }

    Alert.alert("Adicionar fotos", undefined, [
      { text: "Tirar foto", onPress: takePhoto },
      { text: "Escolher da galeria", onPress: pickFromLibrary },
      { text: "Cancelar", style: "cancel" },
    ]);
  };

  const handleRemove = (uri: string) =>
    onChange(photos.filter((p) => p !== uri));

  const count =
    photos.length === 0
      ? "Nenhuma foto ainda"
      : `${photos.length} ${photos.length === 1 ? "foto adicionada" : "fotos adicionadas"}`;

  return (
    <View style={styles.wrapper}>
      <View style={styles.titleRow}>
        <Text accessibilityRole="header" style={styles.title}>
          Fotos do exemplar
        </Text>
        <Text style={styles.count}>{count}</Text>
      </View>
      <Text style={styles.description}>
        Mostre a capa, as páginas e os detalhes. Adicione quantas fotos
        precisar.
      </Text>

      <View style={styles.grid}>
        {photos.map((uri, index) => (
          <View key={uri} style={{ width: size, aspectRatio: 0.87 }}>
            <Image source={{ uri }} style={styles.photo} />

            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Remover foto ${index + 1}`}
              hitSlop={8}
              onPress={() => handleRemove(uri)}
              style={styles.remove}
            >
              <Ionicons name="close" size={16} color={AppColors.darkBlue} />
            </Pressable>

            {index === 0 && (
              <View style={styles.coverBadge}>
                <Text style={styles.coverText}>Capa</Text>
              </View>
            )}
          </View>
        ))}

        {remaining > 0 && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Adicionar fotos"
            onPress={handleAdd}
            style={[styles.addTile, { width: size, aspectRatio: 0.87 }]}
          >
            <Ionicons name="camera-outline" size={26} color={AppColors.blue} />
            <Text style={styles.addText}>
              {photos.length === 0 ? "Adicionar fotos" : "Adicionar mais fotos"}
            </Text>
          </Pressable>
        )}
      </View>

      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <Text style={styles.hint}>
          A primeira foto será a capa do seu anúncio.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 8 },
  titleRow: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  title: { fontSize: 20, fontWeight: "700", color: AppColors.bookTitleText },
  count: { fontSize: 12, color: AppColors.graySecondary },
  description: { fontSize: 14, lineHeight: 20, color: AppColors.categoryText },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: 4 },
  photo: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
    backgroundColor: AppColors.border,
  },
  remove: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: AppColors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  coverBadge: {
    position: "absolute",
    left: 8,
    bottom: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: AppColors.white,
  },
  coverText: { fontSize: 12, fontWeight: "700", color: AppColors.darkBlue },
  addTile: {
    borderRadius: 16,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: AppColors.blue,
    backgroundColor: AppColors.panel,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 8,
  },
  addText: {
    fontSize: 13,
    fontWeight: "700",
    color: AppColors.blue,
    textAlign: "center",
  },
  hint: { fontSize: 13, color: AppColors.graySecondary },
  error: { fontSize: 13, color: AppColors.danger },
});
