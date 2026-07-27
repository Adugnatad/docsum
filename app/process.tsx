import React from 'react';
import { View, Text } from 'react-native';
import { useDocSum } from '../src/context/DocSumContext';
import { ProcessScreen } from '../src/components/ProcessScreen';

export default function ProcessRoute() {
  const {
    selectedDocument,
    focusPoints,
    handleToggleFocusPoint,
    handleAddCustomFocusPoint,
    handleGenerateSummary,
    isProcessing,
    processingStep,
  } = useDocSum();

  if (!selectedDocument) {
    return (
      <View className="flex-1 items-center justify-center p-6 text-center">
        <Text className="text-sm text-[#505f76]">Please select or upload a document first.</Text>
      </View>
    );
  }

  return (
    <ProcessScreen
      documentName={selectedDocument.name}
      focusPoints={focusPoints}
      onToggleFocusPoint={handleToggleFocusPoint}
      onAddCustomFocusPoint={handleAddCustomFocusPoint}
      onGenerateSummary={handleGenerateSummary}
      isProcessing={isProcessing}
      processingStep={processingStep}
    />
  );
}
