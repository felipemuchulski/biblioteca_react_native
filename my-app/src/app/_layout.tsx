import { BooksProvider } from "@/contexts/books-context";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <BooksProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="book/[id]" />
        <Stack.Screen name="login" />
      </Stack>
    </BooksProvider>
  );
}
