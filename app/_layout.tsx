// @ts-ignore: Allow global CSS import without type declarations
import "../global.css";
import { DocSumProvider } from "@/src/context/DocSumContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <DocSumProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </DocSumProvider>
  );
}
