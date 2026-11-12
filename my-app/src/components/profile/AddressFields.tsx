import { useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { AppColors } from '@/constants/colors';
import { addressFields, type Address } from '@/utils/address';
import { fetchAddressByPostalCode } from '../../../database/users';

type Props = { value: Address; onChange: (value: Address) => void; disabled?: boolean };

export function AddressFields({ value, onChange, disabled }: Props) {
  const [postalCodeError, setPostalCodeError] = useState('');
  const requestId = useRef(0);
  const latestValue = useRef(value);
  latestValue.current = value;

  const handlePostalCodeChange = (text: string) => {
    const digits = text.replace(/\D/g, '').slice(0, 8);
    const formatted = digits.length > 5
      ? `${digits.slice(0, 5)}-${digits.slice(5)}`
      : digits;
    onChange({ ...value, postalCode: formatted });
    setPostalCodeError('');

    if (digits.length !== 8) return;

    const currentRequestId = ++requestId.current;
    void fetchAddressByPostalCode(digits)
      .then((address) => {
        if (currentRequestId !== requestId.current) return;
        onChange({
          ...latestValue.current,
          postalCode: formatted,
          street: address.logradouro,
          neighborhood: address.bairro,
          city: address.localidade,
          state: address.uf,
        });
      })
      .catch((cause: unknown) => {
        if (currentRequestId !== requestId.current) return;
        setPostalCodeError(
          cause instanceof Error ? cause.message : 'Não foi possível consultar o CEP.',
        );
      });
  };

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
            onChangeText={(text) => key === 'postalCode'
              ? handlePostalCodeChange(text)
              : onChange({ ...value, [key]: key === 'state' ? text.toUpperCase() : text })}
            keyboardType={key === 'postalCode' || key === 'number' ? 'number-pad' : 'default'}
            autoCapitalize={key === 'state' ? 'characters' : key === 'number' ? 'none' : 'words'}
            maxLength={key === 'state' ? 2 : key === 'postalCode' ? 9 : 120}
            placeholder={key === 'postalCode' ? '00000-000' : key === 'complement' ? 'Opcional' : label}
            placeholderTextColor={AppColors.graySecondary}
            style={styles.input}
          />
          {key === 'postalCode' && postalCodeError
            ? <Text accessibilityRole="alert" style={styles.error}>{postalCodeError}</Text>
            : null}
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
  error: { color: '#B42318', lineHeight: 19 },
});
