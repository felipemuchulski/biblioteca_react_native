import { BooksProvider } from "@/contexts/books-context";
import { Stack } from "expo-router";


export default function RootLayout() {
  return (
    <BooksProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="book/[id]" options={{ headerShown: false }} />
      </Stack>
    </BooksProvider>
  );
}
