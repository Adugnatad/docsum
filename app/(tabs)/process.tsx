import React, { useState } from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { useDocSum } from "../../src/context/DocSumContext";
import { ProcessScreen } from "../../src/components/ProcessScreen";

export default function ProcessRoute() {
  const {
    selectedDocument,
    focusPoints,
    handleToggleFocusPoint,
    handleAddCustomFocusPoint,
    handleGenerateSummary,
    isProcessing,
    processingStep,
    setCurrentSummary,
  } = useDocSum();
  const router = useRouter();
  const [generationError, setGenerationError] = useState<string | null>(null);

  if (!selectedDocument) {
    return (
      <View className="flex-1 items-center justify-center p-6 text-center">
        <Text className="text-sm text-[#505f76]">
          Please select or upload a document first.
        </Text>
      </View>
    );
  }

  return (
    <ProcessScreen
      documentName={selectedDocument.name}
      focusPoints={focusPoints}
      onToggleFocusPoint={handleToggleFocusPoint}
      onAddCustomFocusPoint={handleAddCustomFocusPoint}
      onGenerateSummary={async (customParam) => {
        setGenerationError(null);
        setCurrentSummary(null);

        try {
          await handleGenerateSummary(customParam);
          router.push("/summary");
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : "Something went wrong while generating your summary.";
          setGenerationError(message);
        }
      }}
      isProcessing={isProcessing}
      processingStep={processingStep}
      errorMessage={generationError}
      onDismissError={() => setGenerationError(null)}
    />
  );
}
