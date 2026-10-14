import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';

import { AppColors } from '@/constants/colors';

export type FilterType = 'all' | 'donation' | 'exchange' | 'fiction';

const FILTERS: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'donation', label: 'Doação' },
  { key: 'exchange', label: 'Troca' },
  { key: 'fiction', label: 'Ficção' },
];

interface Props {
  selected: FilterType;
  onSelect: (filter: FilterType) => void;
}

export function BookFilters({ selected, onSelect }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {FILTERS.map((f) => {
        const active = selected === f.key;
        return (
          <TouchableOpacity
            key={f.key}
            style={[styles.chip, active && styles.chipActive]}
            onPress={() => onSelect(f.key)}
            activeOpacity={0.75}
          >
            <Text style={[styles.label, active && styles.labelActive]}>{f.label}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, gap: 8, paddingVertical: 4 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: AppColors.white,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  chipActive: {
    backgroundColor: AppColors.darkBlue,
    borderColor: AppColors.darkBlue,
  },
  label: { fontSize: 13, fontWeight: '500', color: AppColors.graySecondary },
  labelActive: { color: AppColors.white },
});
