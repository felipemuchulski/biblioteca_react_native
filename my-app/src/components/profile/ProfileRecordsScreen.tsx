import { Link, Stack } from 'expo-router';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Timestamp } from 'firebase/firestore';
import { AppColors } from '@/constants/colors';
import { useProfile } from '@/hooks/use-profile';
import { useProfileRecords, type ProfileRecord, type RecordKind } from '@/hooks/use-profile-records';

const text = (value: unknown, fallback: string) => typeof value === 'string' && value.trim() ? value : fallback;
const statuses: Record<string, string> = { pending: 'Pendente', accepted: 'Aceita', completed: 'Concluída', cancelled: 'Cancelada', rejected: 'Recusada' };

function RecordCard({ item, kind }: { item: ProfileRecord; kind: RecordKind }) {
  const data = item.data;
  if (kind === 'books') return (
    <View style={styles.card}>
      <Text style={styles.title}>{text(data.title, 'Livro sem título')}</Text>
      <Text style={styles.body}>{text(data.author, 'Autor não informado')}</Text>
      <Text style={styles.body}>{data.type === 'donation' ? 'Doação' : data.type === 'exchange' ? 'Troca' : 'Modalidade não informada'}</Text>
      <Text style={styles.body}>{data.available === true ? 'Disponível' : data.available === false ? 'Indisponível' : 'Disponibilidade não informada'}</Text>
    </View>
  );
  const date = data.createdAt instanceof Timestamp ? data.createdAt.toDate().toLocaleDateString('pt-BR') : '';
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{text(data.offeredBookTitle, 'Livro oferecido')}</Text>
      <Text style={styles.body}>Por: {text(data.requestedBookTitle, 'Livro solicitado')}</Text>
      <Text style={styles.body}>Situação: {statuses[text(data.status, '')] ?? 'Não informada'}</Text>
      {!!date && <Text style={styles.body}>Registrada em {date}</Text>}
    </View>
  );
}

export function ProfileRecordsScreen({ kind }: { kind: RecordKind }) {
  const { user, loading: authLoading, error: authError, retry: retryAuth } = useProfile();
  const { records, loading, error, hasMore, retry, loadMore } = useProfileRecords(user?.uid, kind);
  const title = kind === 'books' ? 'Meus livros cadastrados' : 'Histórico de trocas';
  return (
    <>
      <Stack.Screen options={{ title, headerShown: true }} />
      <FlatList
        style={styles.screen}
        contentContainerStyle={styles.content}
        data={authError || !user ? [] : records}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RecordCard item={item} kind={kind} />}
        ListEmptyComponent={authLoading || (user && loading) ? <ActivityIndicator accessibilityLabel="Carregando lista" color={AppColors.blue} />
          : authError || error ? <View style={styles.card}>
            <Text accessibilityRole="alert" style={styles.body}>{authError || error}</Text>
            <TouchableOpacity accessibilityRole="button" onPress={authError ? retryAuth : retry} style={styles.button}><Text style={styles.buttonText}>Tentar novamente</Text></TouchableOpacity>
          </View>
          : !user ? <View style={styles.card}><Text style={styles.body}>Crie seu perfil para acessar esta lista.</Text><Link href="/register" style={styles.link}>Criar perfil</Link></View>
          : <Text style={styles.body}>{kind === 'books' ? 'Você ainda não tem livros cadastrados.' : 'Você ainda não tem trocas registradas.'}</Text>}
        ListFooterComponent={user && !authError && !error && hasMore ? <TouchableOpacity accessibilityRole="button" style={styles.button} onPress={loadMore}><Text style={styles.buttonText}>Carregar mais</Text></TouchableOpacity> : null}
      />
    </>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: AppColors.background },
  content: { padding: 24, gap: 16, width: '100%', maxWidth: 600, alignSelf: 'center' },
  card: { backgroundColor: AppColors.white, padding: 20, borderRadius: 16, gap: 10 },
  title: { color: AppColors.darkBlue, fontSize: 18, fontWeight: '700' }, body: { color: AppColors.categoryText, lineHeight: 22 },
  button: { backgroundColor: AppColors.blue, alignItems: 'center', borderRadius: 12, padding: 16 },
  buttonText: { color: AppColors.white, fontWeight: '700' }, link: { color: AppColors.blue, paddingVertical: 12 },
});
