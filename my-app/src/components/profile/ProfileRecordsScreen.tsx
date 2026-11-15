import { Link } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useState } from "react";
import { Timestamp } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import { deleteBook } from "../../../database/books";
import { AppColors } from "@/constants/colors";
import { useProfile } from "@/hooks/use-profile";
import {
  useProfileRecords,
  type ProfileRecord,
  type RecordKind,
} from "@/hooks/use-profile-records";

const text = (value: unknown, fallback: string) =>
  typeof value === "string" && value.trim() ? value : fallback;
const statuses: Record<string, string> = {
  pending: "Pendente",
  accepted: "Aceita",
  completed: "Concluída",
  cancelled: "Cancelada",
  rejected: "Recusada",
};

function RecordCard({
  item,
  kind,
  deleting,
  onDelete,
}: {
  item: ProfileRecord;
  kind: RecordKind;
  deleting: boolean;
  onDelete: (id: string, title: string) => void;
}) {
  const data = item.data;
  if (kind === "books") {
    const images = Array.isArray(data.images)
      ? data.images.filter((image: unknown): image is string => typeof image === "string" && !!image.trim())
      : [];
    const imageUri = images[0] || text(data.thumbnail, "");
    return (
      <View style={styles.card}>
        <View style={styles.bookImageContainer}>
          {imageUri ? <BookCover uri={imageUri} /> : <Text style={styles.imageFallback}>Falha ao carregar imagem</Text>}
        </View>
        <Text style={styles.title}>{text(data.title, "Livro sem título")}</Text>
        <Text style={styles.body}>
          {text(data.author, "Autor não informado")}
        </Text>
        <Text style={styles.body}>
          {data.type === "donation"
            ? "Doação"
            : data.type === "exchange"
              ? "Troca"
              : "Modalidade não informada"}
        </Text>
        <Text style={styles.body}>
          {data.available === true
            ? "Disponível"
            : data.available === false
              ? "Indisponível"
              : "Disponibilidade não informada"}
        </Text>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={`Excluir livro ${text(data.title, "")}`}
          accessibilityState={{ disabled: deleting, busy: deleting }}
          disabled={deleting}
          onPress={() => onDelete(item.id, text(data.title, "este livro"))}
          style={[styles.deleteButton, deleting && styles.disabledButton]}
        >
          {deleting ? (
            <ActivityIndicator color={AppColors.danger} size="small" />
          ) : (
            <Ionicons name="trash-outline" size={19} color={AppColors.danger} />
          )}
        </TouchableOpacity>
      </View>
    );
  }
  const date =
    data.createdAt instanceof Timestamp
      ? data.createdAt.toDate().toLocaleDateString("pt-BR")
      : "";
  return (
    <View style={styles.card}>
      <Text style={styles.title}>
        {text(data.offeredBookTitle, "Livro oferecido")}
      </Text>
      <Text style={styles.body}>
        Por: {text(data.requestedBookTitle, "Livro solicitado")}
      </Text>
      <Text style={styles.body}>
        Situação: {statuses[text(data.status, "")] ?? "Não informada"}
      </Text>
      {!!date && <Text style={styles.body}>Registrada em {date}</Text>}
    </View>
  );
}

function BookCover({ uri }: { uri: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <Text style={styles.imageFallback}>Falha ao carregar imagem</Text>;
  return <Image source={{ uri }} style={styles.bookImage} resizeMode="cover" onError={() => setFailed(true)} accessibilityLabel="Capa do livro" />;
}

export function ProfileRecordsScreen({ kind }: { kind: RecordKind }) {
  const {
    user,
    loading: authLoading,
    error: authError,
    retry: retryAuth,
  } = useProfile();
  const { records, loading, error, hasMore, retry, loadMore } =
    useProfileRecords(user?.uid, kind);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const confirmDelete = (id: string, title: string) => {
    const remove = async () => {
      setDeletingId(id);
      try {
        await deleteBook(id);
      } catch (cause) {
        const message =
          cause instanceof Error ? cause.message : "Não foi possível excluir o livro.";
        if (Platform.OS === "web") globalThis.alert(message);
        else Alert.alert("Erro ao excluir", message);
      } finally {
        setDeletingId(null);
      }
    };

    const message = `Tem certeza de que deseja excluir “${title}”? Esta ação não pode ser desfeita.`;
    if (Platform.OS === "web") {
      if (globalThis.confirm(message)) void remove();
      return;
    }

    Alert.alert("Excluir livro", message, [
      { text: "Cancelar", style: "cancel" },
      { text: "Excluir", style: "destructive", onPress: () => void remove() },
    ]);
  };

  return (
    <>
      <FlatList
        style={styles.screen}
        contentContainerStyle={styles.content}
        data={authError || !user ? [] : records}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RecordCard
            item={item}
            kind={kind}
            deleting={deletingId === item.id}
            onDelete={confirmDelete}
          />
        )}
        ListEmptyComponent={
          authLoading || (user && loading) ? (
            <ActivityIndicator
              accessibilityLabel="Carregando lista"
              color={AppColors.blue}
            />
          ) : authError || error ? (
            <View style={styles.card}>
              <Text accessibilityRole="alert" style={styles.body}>
                {authError || error}
              </Text>
              <TouchableOpacity
                accessibilityRole="button"
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
              <Link href="/register-user" style={styles.link}>
                Criar perfil
              </Link>
            </View>
          ) : (
            <Text style={styles.body}>
              {kind === "books"
                ? "Você ainda não tem livros cadastrados."
                : "Você ainda não tem trocas registradas."}
            </Text>
          )
        }
        ListFooterComponent={
          user && !authError && !error && hasMore ? (
            <TouchableOpacity
              accessibilityRole="button"
              style={styles.button}
              onPress={loadMore}
            >
              <Text style={styles.buttonText}>Carregar mais</Text>
            </TouchableOpacity>
          ) : null
        }
      />
    </>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: AppColors.background },
  content: {
    padding: 24,
    gap: 16,
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
  },
  card: {
    position: "relative",
    backgroundColor: AppColors.white,
    padding: 20,
    borderRadius: 16,
    gap: 10,
  },
  bookImageContainer: { width: 112, height: 148, alignSelf: "center", borderRadius: 10, overflow: "hidden", backgroundColor: AppColors.border, alignItems: "center", justifyContent: "center" },
  bookImage: { width: "100%", height: "100%" },
  imageFallback: { color: AppColors.categoryText, textAlign: "center", padding: 8, lineHeight: 20 },
  title: { color: AppColors.darkBlue, fontSize: 18, fontWeight: "700" },
  body: { color: AppColors.categoryText, lineHeight: 22 },
  button: {
    backgroundColor: AppColors.blue,
    alignItems: "center",
    borderRadius: 12,
    padding: 16,
  },
  buttonText: { color: AppColors.white, fontWeight: "700" },
  deleteButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    backgroundColor: "#FCEBEC",
  },
  disabledButton: { opacity: 0.6 },
  link: { color: AppColors.blue, paddingVertical: 12 },
});
