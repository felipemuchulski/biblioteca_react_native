import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BookCard } from '@/components/books/BookCard';
import { BookGridCard } from '@/components/books/BookGridCard';
import { BookFilters, FilterType } from '@/components/home/BookFilters';
import { HomeHeader } from '@/components/home/HomeHeader';
import { AppColors } from '@/constants/colors';
import { BOOKS } from '@/mocks/books';
import { Book } from '@/types/book';

export default function HomeScreen() {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>(BOOKS);
  const [filter, setFilter] = useState<FilterType>('all');

  const toggleFavorite = (id: string) => {
    setBooks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isFavorite: !b.isFavorite } : b))
    );
  };

  const handlePress = (book: Book) => {
    router.push(`/book/${book.id}` as never);
  };

  const filteredBooks = books.filter((b) => {
    if (filter === 'donation') return b.type === 'donation';
    if (filter === 'exchange') return b.type === 'exchange';
    if (filter === 'fiction') return b.category === 'fiction';
    return true;
  });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <HomeHeader />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Localização */}
        <View style={styles.locationRow}>
          <Ionicons name="location-sharp" size={14} color={AppColors.blue} />
          <Text style={styles.locationText}>Livros perto de Vila Mariana, São Paulo</Text>
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Que história vamos{'\n'}compartilhar hoje?</Text>
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
            Dê espaço na estante.{'\n'}Ganhe uma nova conversa.
          </Text>
          <TouchableOpacity style={styles.bannerBtn} activeOpacity={0.8}>
            <Text style={styles.bannerBtnText}>Cadastrar um livro</Text>
            <Ionicons name="arrow-forward" size={14} color={AppColors.blue} />
          </TouchableOpacity>
        </View>

        {/* Seção: Perto de você */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Perto de você</Text>
          <TouchableOpacity>
            <Text style={styles.sectionLink}>Ver mapa</Text>
          </TouchableOpacity>
        </View>

        <BookFilters selected={filter} onSelect={setFilter} />

        <View style={styles.cardList}>
          {filteredBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onToggleFavorite={toggleFavorite}
              onPress={handlePress}
            />
          ))}
          {filteredBooks.length === 0 && (
            <Text style={styles.empty}>Nenhum livro encontrado para este filtro.</Text>
          )}
        </View>

        {/* Seção: Novos na estante */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Novos na estante</Text>
          <TouchableOpacity>
            <Text style={styles.sectionLink}>Ver todos</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.grid}>
          {books.map((book) => (
            <BookGridCard key={book.id} book={book} onPress={handlePress} />
          ))}
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  locationText: { fontSize: 12, color: AppColors.graySecondary },

  hero: { paddingHorizontal: 16, marginBottom: 20 },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: AppColors.darkBlue,
    lineHeight: 30,
    marginBottom: 6,
  },
  heroSubtitle: { fontSize: 13, color: AppColors.graySecondary, lineHeight: 19 },

  banner: {
    marginHorizontal: 16,
    backgroundColor: AppColors.darkBlue,
    borderRadius: 18,
    padding: 20,
    marginBottom: 24,
    gap: 10,
  },
  bannerBadge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  bannerBadgeText: { color: AppColors.white, fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  bannerTitle: { color: AppColors.white, fontSize: 17, fontWeight: '700', lineHeight: 24 },
  bannerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: AppColors.white,
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  bannerBtnText: { color: AppColors.blue, fontSize: 13, fontWeight: '600' },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
    marginTop: 8,
  },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: AppColors.darkBlue },
  sectionLink: { fontSize: 13, color: AppColors.blue, fontWeight: '500' },

  cardList: { paddingHorizontal: 16, marginTop: 12 },
  empty: { color: AppColors.graySecondary, textAlign: 'center', marginTop: 16 },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 16,
    justifyContent: 'space-between',
  },
});
