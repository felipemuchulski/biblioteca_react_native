import { BooksProvider } from "@/contexts/books-context";
import { AddressProvider } from "@/contexts/address-context";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <AddressProvider>
      <BooksProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="book/[id]" />
          <Stack.Screen name="login" />
        </Stack>
      </BooksProvider>
    </AddressProvider>
  );
}
