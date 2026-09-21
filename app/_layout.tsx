// @ts-ignore: Allow global CSS import without type declarations
import "../global.css";
import { DocSumProvider } from "@/src/context/DocSumContext";
import { Stack } from "expo-router";
import mobileAds from "react-native-google-mobile-ads";

export default function RootLayout() {
  mobileAds().initialize();

  return (
    <DocSumProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </DocSumProvider>
  );
}
