import { Link } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import ScreenBackButton from "@/components/navigation/ScreenBackButton";
import RecordCard from "@/components/profile/RecordCard";
import { AppColors } from "@/constants/colors";
import { useProfile } from "@/hooks/use-profile";
import { useProfileRecords } from "@/hooks/use-profile-records";
import { useTradeActions } from "@/hooks/use-trade-actions";

export default function MyTradesScreen() {
  const {
    user,
    profile,
    loading: authLoading,
    error: authError,
    retry: retryAuth,
  } = useProfile();
  const { records, loading, error, hasMore, retry, loadMore } =
    useProfileRecords(user?.uid, "trades");
  const { respondingId, respondToTrade } = useTradeActions({
    email: user?.email ?? profile?.email ?? "",
    whatsapp: profile?.whatsapp ?? "",
  });

  return (
    <View style={styles.screen}>
      <View style={styles.content}>
        <View style={styles.recordsHeader}>
          <View style={styles.backButton}>
            <ScreenBackButton />
          </View>
          <Text style={styles.recordsHeaderTitle}>Histórico de Trocas</Text>
        </View>

        {authLoading || (user && loading) ? (
          <ActivityIndicator
            accessibilityLabel="Carregando lista"
            color={AppColors.blue}
          />
        ) : authError || error ? (
          <View style={styles.card}>
            <Text style={styles.body}>{authError || error}</Text>
            <TouchableOpacity
              onPress={authError ? retryAuth : retry}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        ) : !user ? (
          <View style={styles.card}>
            <Text style={styles.body}>
              Crie seu perfil para acessar esta lista.
            </Text>
            <Link href="/login" style={styles.link}>
              Ir para o login
            </Link>
          </View>
        ) : records.length === 0 ? (
          <Text style={styles.body}>
            Você ainda não tem trocas registradas.
          </Text>
        ) : (
          <FlatList
            style={styles.list}
            data={records}
            extraData={respondingId}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.recordItem}>
                <RecordCard
                  item={item}
                  kind="trades"
                  deleting={false}
                  onDelete={() => {}}
                  currentUid={user.uid}
                  responding={respondingId === item.id}
                  onTradeAction={respondToTrade}
                />
              </View>
            )}
          />
        )}

        {user && !authError && !error && hasMore ? (
          <TouchableOpacity style={styles.button} onPress={loadMore}>
            <Text style={styles.buttonText}>Carregar mais</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: AppColors.background },
  content: {
    flex: 1,
    padding: 24,
    gap: 16,
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
  },
  recordsHeader: {
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
    position: "relative",
  },
  recordsHeaderTitle: {
    color: AppColors.darkBlue,
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },
  backButton: { position: "absolute", left: 0, top: 2 },
  card: {
    position: "relative",
    backgroundColor: AppColors.white,
    padding: 20,
    borderRadius: 16,
    gap: 10,
  },
  body: { color: AppColors.categoryText, lineHeight: 22 },
  list: { flex: 1, width: "100%" },
  recordItem: { marginBottom: 16 },
  button: {
    backgroundColor: AppColors.blue,
    alignItems: "center",
    borderRadius: 12,
    padding: 16,
  },
  buttonText: { color: AppColors.white, fontWeight: "700" },
  link: { color: AppColors.blue, paddingVertical: 12 },
});
