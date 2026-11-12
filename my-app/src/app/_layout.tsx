import { BooksProvider } from "@/contexts/books-context";
import { Slot } from "expo-router";

export default function RootLayout() {
  return (
    <BooksProvider>
      <Slot />
    </BooksProvider>
  );
}
