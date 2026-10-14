import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { AppColors } from '@/constants/colors';

export function HomeHeader() {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.iconBtn}>
        <Ionicons name="person-circle-outline" size={28} color={AppColors.darkBlue} />
      </TouchableOpacity>

      <Text style={styles.logo}>Livروei</Text>

      <View style={styles.rightActions}>
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="search-outline" size={24} color={AppColors.darkBlue} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.addBtn}>
          <Ionicons name="add" size={22} color={AppColors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  logo: {
    fontSize: 22,
    fontWeight: '800',
    color: AppColors.darkBlue,
    letterSpacing: 0.5,
  },
  rightActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconBtn: { padding: 4 },
  addBtn: {
    backgroundColor: AppColors.blue,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
