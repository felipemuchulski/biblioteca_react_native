import { useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { AppColors } from '@/constants/colors';
import { addressFields, type Address } from '@/utils/address';
import { fetchAddressByPostalCode } from '../../../database/users';

type Props = { value: Address; onChange: (value: Address) => void; disabled?: boolean };

export function AddressFields({ value, onChange, disabled }: Props) {
  const [postalCodeError, setPostalCodeError] = useState('');
  const [lookingUpPostalCode, setLookingUpPostalCode] = useState(false);
  const requestId = useRef(0);
  const editedWhileLookingUp = useRef(new Set<keyof Address>());
  const latestValue = useRef(value);
  latestValue.current = value;

  const handlePostalCodeChange = (text: string) => {
    const digits = text.replace(/\D/g, '').slice(0, 8);
    const formatted = digits.length > 5
      ? `${digits.slice(0, 5)}-${digits.slice(5)}`
      : digits;
    onChange({ ...value, postalCode: formatted });
    setPostalCodeError('');
    setLookingUpPostalCode(false);
    editedWhileLookingUp.current.clear();
    const currentRequestId = ++requestId.current;

    if (digits.length !== 8) return;

    setLookingUpPostalCode(true);
    void fetchAddressByPostalCode(digits)
      .then((address) => {
        if (currentRequestId !== requestId.current) return;
        const updatedAddress: Address = {
          ...latestValue.current,
          postalCode: formatted,
          street: address.logradouro,
          neighborhood: address.bairro,
          city: address.localidade,
          state: address.uf,
        };
        for (const key of editedWhileLookingUp.current) {
          updatedAddress[key] = latestValue.current[key];
        }
        onChange(updatedAddress);
      })
      .catch((cause: unknown) => {
        if (currentRequestId !== requestId.current) return;
        setPostalCodeError(
          cause instanceof Error ? cause.message : 'Não foi possível consultar o CEP.',
        );
      })
      .finally(() => {
        if (currentRequestId === requestId.current) setLookingUpPostalCode(false);
      });
  };

  const handleFieldChange = (key: keyof Address, text: string) => {
    if (lookingUpPostalCode) editedWhileLookingUp.current.add(key);
    onChange({ ...value, [key]: key === 'state' ? text.toUpperCase() : text });
  };

  return (
    <View style={styles.fields}>
      <Text style={styles.title}>Endereço</Text>
      <Text style={styles.help}>Opcional. Seu endereço completo fica visível apenas para você.</Text>
      {lookingUpPostalCode ? <Text style={styles.help}>Buscando endereço pelo CEP...</Text> : null}
      {addressFields.map(([key, label]) => (
        <View key={key} style={styles.field}>
          <Text style={styles.label}>{label}</Text>
          <TextInput
            accessibilityLabel={label}
            value={value[key]}
            editable={!disabled}
            onChangeText={(text) => key === 'postalCode'
              ? handlePostalCodeChange(text)
              : handleFieldChange(key, text)}
            keyboardType={key === 'postalCode' ? 'number-pad' : 'default'}
            autoCapitalize={key === 'state' ? 'characters' : 'words'}
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
