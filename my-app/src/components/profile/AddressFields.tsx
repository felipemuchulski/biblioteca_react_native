import { StyleSheet, Text, TextInput, View } from 'react-native';
import { AppColors } from '@/constants/colors';
import { addressFields, type Address } from '@/utils/address';

type Props = { value: Address; onChange: (value: Address) => void; disabled?: boolean };

export function AddressFields({ value, onChange, disabled }: Props) {
  return (
    <View style={styles.fields}>
      <Text style={styles.title}>Endereço</Text>
      <Text style={styles.help}>Opcional. Seu endereço completo fica visível apenas para você.</Text>
      {addressFields.map(([key, label]) => (
        <View key={key} style={styles.field}>
          <Text style={styles.label}>{label}</Text>
          <TextInput
            accessibilityLabel={label}
            value={value[key]}
            editable={!disabled}
            onChangeText={(text) => onChange({ ...value, [key]: key === 'state' ? text.toUpperCase() : text })}
            keyboardType={key === 'postalCode' ? 'number-pad' : 'default'}
            autoCapitalize={key === 'state' ? 'characters' : 'words'}
            maxLength={key === 'state' ? 2 : key === 'postalCode' ? 9 : 120}
            placeholder={key === 'postalCode' ? '00000-000' : key === 'complement' ? 'Opcional' : label}
            placeholderTextColor={AppColors.graySecondary}
            style={styles.input}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  fields: { gap: 10, marginTop: 16 }, field: { gap: 8 },
  title: { color: AppColors.darkBlue, fontSize: 18, fontWeight: '700' },
  help: { color: AppColors.categoryText, lineHeight: 20 },
  label: { color: AppColors.darkBlue, fontWeight: '600' },
  input: { backgroundColor: AppColors.white, borderColor: AppColors.border, borderWidth: 1, borderRadius: 12, color: AppColors.darkBlue, fontSize: 15, padding: 14 },
});
