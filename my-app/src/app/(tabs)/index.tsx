import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BookCard } from "@/components/book-details/BookCard";
import { HomeHeader } from "@/components/home/HomeHeader";
import { AppColors } from "@/constants/colors";
import { useBooks } from "@/contexts/books-context";
import { useProfile } from "@/hooks/use-profile";
import { Book } from "@/types/book";

export default function HomeScreen() {
  const router = useRouter();
  const {
    books: nearbyBooks = [],
    setSelectedBook,
    loading: booksLoading,
    error: booksError,
    retry: retryBooks,
  } = useBooks();
  const { profile, user } = useProfile();
  const [favoriteOverrides, setFavoriteOverrides] = useState<Record<string, boolean>>({});
  const books = nearbyBooks.map((book) => ({
    ...book, isFavorite: favoriteOverrides[book.id] ?? book.isFavorite,
  }));

  const toggleFavorite = (id: string) => {
    const book = books.find((item) => item.id === id);
    if (book) setFavoriteOverrides((previous) => ({ ...previous, [id]: !book.isFavorite }));
  };

  const handlePress = (book: Book) => {
    setSelectedBook?.(book);
    router.push({
      pathname: "/book/[id]",
      params: { id: book.id },
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <HomeHeader />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Localização */}
        <View style={styles.locationRow}>
          <Ionicons name="location-sharp" size={14} color={AppColors.blue} />
          <Text style={styles.locationText}>
            {profile?.address?.city
              ? `Livros perto de ${[profile.address.neighborhood, profile.address.city].filter(Boolean).join(', ')}`
              : "Selecione sua localização em Meu perfil"}
          </Text>
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>
            Que história vamos{"\n"}compartilhar hoje?
          </Text>
          <Text style={styles.heroSubtitle}>
            Descubra livros da sua vizinhança e faça novas histórias circularem.
          </Text>
        </View>

        {/* Banner */}
        <View style={styles.banner}>
          <View style={styles.bannerBadge}>
            <Text style={styles.bannerBadgeText}>COMUNIDADE LIVROEI</Text>
          </View>
          <Text style={styles.bannerTitle}>
            Dê espaço na estante.{"\n"}Ganhe uma nova conversa.
          </Text>
          <TouchableOpacity
            style={styles.bannerBtn}
            activeOpacity={0.8}
            onPress={() => router.push("/book-register")}
          >
            <Text style={styles.bannerBtnText}>Cadastrar um livro</Text>
            <Ionicons name="arrow-forward" size={14} color={AppColors.blue} />
          </TouchableOpacity>
        </View>

        {/* Seção: Perto de você */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Livros cadastrados</Text>
        </View>

        <View style={styles.cardList}>
          {booksLoading ? (
            <ActivityIndicator
              accessibilityLabel="Carregando livros"
              color={AppColors.blue}
            />
          ) : booksError ? (
            <View style={styles.loadError}>
              <Text style={styles.empty}>{booksError}</Text>
              <TouchableOpacity onPress={retryBooks} style={styles.retryButton}>
                <Text style={styles.retryText}>Tentar novamente</Text>
              </TouchableOpacity>
            </View>
          ) : !user ? (
            <Text style={styles.empty}>
              Entre na sua conta para ver os livros cadastrados.
            </Text>
          ) : books.length ? books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onToggleFavorite={toggleFavorite}
              onPress={handlePress}
            />
          )) : (
            <Text style={styles.empty}>Nenhum livro cadastrado ainda.</Text>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: AppColors.background },
  scroll: { flex: 1 },
  content: { paddingBottom: 32 },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  locationText: { fontSize: 12, color: AppColors.graySecondary },

  hero: { paddingHorizontal: 16, marginBottom: 20 },
  heroTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: AppColors.darkBlue,
    lineHeight: 30,
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 13,
    color: AppColors.graySecondary,
    lineHeight: 19,
  },

  banner: {
    marginHorizontal: 16,
    backgroundColor: AppColors.darkBlue,
    borderRadius: 18,
    padding: 20,
    marginBottom: 24,
    gap: 10,
  },
  bannerBadge: {
    backgroundColor: "#ffffff26",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  bannerBadgeText: {
    color: AppColors.white,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
  },
  bannerTitle: {
    color: AppColors.white,
    fontSize: 17,
    fontWeight: "700",
    lineHeight: 24,
  },
  bannerBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: AppColors.white,
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  bannerBtnText: { color: AppColors.blue, fontSize: 13, fontWeight: "600" },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
    marginTop: 8,
  },
  sectionTitle: { fontSize: 17, fontWeight: "700", color: AppColors.darkBlue },

  cardList: { paddingHorizontal: 16, marginTop: 12 },
  empty: { color: AppColors.graySecondary, textAlign: "center", marginTop: 16 },
  loadError: { alignItems: "center", gap: 12 },
  retryButton: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, backgroundColor: AppColors.blue },
  retryText: { color: AppColors.white, fontWeight: "700" },

});
