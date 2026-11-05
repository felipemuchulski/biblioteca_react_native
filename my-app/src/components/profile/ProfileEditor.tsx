import { useState } from 'react';
import { FirebaseError } from 'firebase/app';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AppColors } from '@/constants/colors';
import { emptyAddress } from '@/utils/address';
import { AddressFields } from './AddressFields';
import { saveUserProfile, type UserProfile } from '../../../database/users';

type Props = { profile: UserProfile; onClose: () => void; onSaved: () => void };

export function ProfileEditor({ profile, onClose, onSaved }: Props) {
  const [name, setName] = useState(profile.displayName);
  const [whatsapp, setWhatsapp] = useState(profile.whatsapp);
  const [address, setAddress] = useState(profile.address ?? { ...emptyAddress });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function save() {
    if (saving) return;
    setSaving(true);
    setError('');
    try {
      await saveUserProfile({ displayName: name, whatsapp, address });
      onSaved();
    } catch (cause) {
      setError(cause instanceof FirebaseError
        ? cause.code === 'permission-denied'
          ? 'Não foi possível salvar. Confira se as regras atualizadas do Firestore foram publicadas.'
          : 'Não foi possível salvar. Verifique sua conexão e tente novamente.'
        : cause instanceof Error ? cause.message : 'Não foi possível salvar o perfil.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={styles.form}>
      <Text style={styles.title}>Editar perfil</Text>
      <Text style={styles.label}>Nome</Text>
      <TextInput accessibilityLabel="Nome" style={styles.input} value={name} onChangeText={setName} editable={!saving} maxLength={120} autoCapitalize="words" />
      <Text style={styles.label}>WhatsApp</Text>
      <TextInput accessibilityLabel="WhatsApp" style={styles.input} value={whatsapp} onChangeText={setWhatsapp} editable={!saving} keyboardType="phone-pad" />
      <Text style={styles.help}>E-mail: {profile.email}</Text>
      <AddressFields value={address} onChange={setAddress} disabled={saving} />
      {!!error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
      <TouchableOpacity accessibilityRole="button" style={styles.button} onPress={save} disabled={saving}>
        {saving ? <ActivityIndicator color={AppColors.white} /> : <Text style={styles.buttonText}>Salvar alterações</Text>}
      </TouchableOpacity>
      <TouchableOpacity accessibilityRole="button" style={styles.cancel} onPress={onClose} disabled={saving}>
        <Text style={styles.label}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  form: { gap: 12 }, title: { fontSize: 20, color: AppColors.darkBlue, fontWeight: '700' },
  label: { color: AppColors.darkBlue, fontWeight: '600' },
  help: { color: AppColors.categoryText, lineHeight: 22 }, error: { color: '#B42318', lineHeight: 22 },
  input: { backgroundColor: AppColors.white, padding: 14, borderWidth: 1, borderColor: AppColors.border, borderRadius: 12, color: AppColors.darkBlue, fontSize: 16 },
  button: { backgroundColor: AppColors.blue, alignItems: 'center', padding: 16, borderRadius: 12 },
  buttonText: { color: AppColors.white, fontWeight: '700' }, cancel: { padding: 16, alignItems: 'center' },
});
