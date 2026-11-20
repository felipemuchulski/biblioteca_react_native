import { AppColors } from "@/constants/colors";
import { getFirestore, doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { getFirebaseAuth } from "../../../database/firebase";

type ContactState = {
  email: string;
  whatsapp: string;
  loading: boolean;
};

export function TradeContactInfo({
  tradeId,
  otherUserId,
  otherName,
}: {
  tradeId: string;
  otherUserId: string;
  otherName: string;
}) {
  const [contact, setContact] = useState<ContactState>({ email: "", whatsapp: "", loading: true });

  useEffect(() => {
    let active = true;
    let unsubscribe: (() => void) | undefined;
    try {
      const firestore = getFirestore(getFirebaseAuth().app);
      unsubscribe = onSnapshot(
        doc(firestore, "trades", tradeId, "contacts", otherUserId),
        (snapshot) => {
          if (!active) return;
          const data = snapshot.data();
          setContact({
            email: typeof data?.email === "string" ? data.email : "",
            whatsapp: typeof data?.whatsapp === "string" ? data.whatsapp : "",
            loading: false,
          });
        },
        () => {
          if (active) setContact({ email: "", whatsapp: "", loading: false });
        },
      );
    } catch {
      setContact({ email: "", whatsapp: "", loading: false });
    }
    return () => {
      active = false;
      unsubscribe?.();
    };
  }, [tradeId, otherUserId]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Contato de {otherName}</Text>
      {contact.loading ? (
        <ActivityIndicator color={AppColors.blue} size="small" />
      ) : contact.email || contact.whatsapp ? (
        <>
          {!!contact.email && <Text style={styles.detail}>E-mail: {contact.email}</Text>}
          {!!contact.whatsapp && <Text style={styles.detail}>WhatsApp: {contact.whatsapp}</Text>}
        </>
      ) : (
        <Text style={styles.detail}>As informações de contato ainda não estão disponíveis.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 6, padding: 14, borderRadius: 12, backgroundColor: AppColors.panel },
  heading: { color: AppColors.darkBlue, fontSize: 14, fontWeight: "700" },
  detail: { color: AppColors.categoryText, lineHeight: 21 },
});
