import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useDocSum } from "../../src/context/DocSumContext";
import { SummaryScreen } from "../../src/components/SummaryScreen";
import { useRouter } from "expo-router";

export default function SummaryRoute() {
  const { currentSummary, setSelectedDocument, setActiveTab, setIsExportOpen } =
    useDocSum();

  const router = useRouter();

  if (!currentSummary) {
    return (
      <View className="flex-1 items-center justify-center p-6 text-center space-y-3 mt-10">
        <Text className="text-sm text-[#505f76]">
          No active summary available.
        </Text>
        <TouchableOpacity
          onPress={() => setActiveTab("upload")}
          activeOpacity={0.8}
          className="bg-[#2036bd] px-4 py-2 rounded-xl"
        >
          <Text className="text-white text-xs font-bold">Go to Upload</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SummaryScreen
      summary={currentSummary}
      onNewDocument={() => {
        setSelectedDocument(null);
        router.push("/");
      }}
    />
  );
}
