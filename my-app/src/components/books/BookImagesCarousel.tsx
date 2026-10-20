import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

import { AppColors } from "@/constants/colors";
import { Book } from "@/types/book";

interface BookImagesCarouselProps {
  book: Book;
  bookImages: string[];
  selectedImage: string;
  onPress: (value: string) => void;
}

export function BookImagesCarousel({
  book,
  bookImages,
  selectedImage,
  onPress,
}: BookImagesCarouselProps) {
  const { id } = book;

  return (
    <View style={styles.carouselContainer}>
      {bookImages.map((image, index) => (
        <TouchableOpacity
          key={`${id}-${index}`}
          onPress={() => onPress(image)}
          activeOpacity={1}
        >
          <View
            style={[
              styles.imageContainer,
              selectedImage === image ? styles.selected : styles.unselected,
            ]}
          >
            <Image
              source={{ uri: image }}
              style={[styles.cover]}
              defaultSource={require("@/assets/images/icon.png")}
            />
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  carouselContainer: {
    flexDirection: "row",
    width: "100%",
    height: "auto",
    objectFit: "cover",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 24,
    gap: 10,
  },
  imageContainer: {
    borderRadius: 12,
    backgroundColor: AppColors.white,
  },
  cover: {
    width: 56,
    height: 58,
    borderRadius: 8,
  },
  unselected: {
    borderWidth: 1,
    padding: 3,
    borderColor: AppColors.actionborder,
  },
  selected: {
    borderWidth: 2,
    padding: 2,
    borderColor: AppColors.blue,
  },
});
