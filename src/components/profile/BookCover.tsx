import { useState } from "react";
import { Image, StyleSheet, Text } from "react-native";

import { AppColors } from "@/constants/colors";

interface IBookCoverProps {
  uri: string;
}

const BookCover = (props: IBookCoverProps) => {
  const { uri } = props;
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <Text style={styles.imageFallback}>Falha ao carregar imagem</Text>
    );
  }

  return (
    <Image
      source={{ uri }}
      style={styles.bookImage}
      resizeMode="cover"
      onError={() => setFailed(true)}
      accessibilityLabel="Capa do livro"
    />
  );
};

export default BookCover;

const styles = StyleSheet.create({
  bookImage: { width: "100%", height: "100%" },
  imageFallback: {
    color: AppColors.categoryText,
    textAlign: "center",
    padding: 8,
    lineHeight: 20,
  },
});
