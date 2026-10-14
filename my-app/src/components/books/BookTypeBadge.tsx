import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { AppColors } from '@/constants/colors';

interface Props {
  type: 'donation' | 'exchange';
  size?: 'sm' | 'md';
}

export function BookTypeBadge({ type, size = 'md' }: Props) {
  const isDonation = type === 'donation';
  const isSmall = size === 'sm';

  return (
    <View
      style={[
        styles.badge,
        isDonation ? styles.donationBg : styles.exchangeBg,
        isSmall && styles.badgeSm,
      ]}
    >
      <Ionicons
        name={isDonation ? 'heart' : 'swap-horizontal'}
        size={isSmall ? 10 : 12}
        color={isDonation ? AppColors.donationText : AppColors.exchangeText}
      />
      <Text
        style={[
          styles.text,
          isDonation ? styles.donationText : styles.exchangeText,
          isSmall && styles.textSm,
        ]}
      >
        {isDonation ? 'Doação' : 'Troca'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  badgeSm: {
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  donationBg: { backgroundColor: AppColors.donationBg },
  exchangeBg: { backgroundColor: AppColors.exchangeBg },
  text: { fontSize: 12, fontWeight: '600' },
  textSm: { fontSize: 10 },
  donationText: { color: AppColors.donationText },
  exchangeText: { color: AppColors.exchangeText },
});
