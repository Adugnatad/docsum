import React, { useEffect, useRef, useState } from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import {
  AdEventType,
  InterstitialAd,
  TestIds,
} from "react-native-google-mobile-ads";
import { useDocSum } from "../../src/context/DocSumContext";
import { ProcessScreen } from "../../src/components/ProcessScreen";

const interstitialAd = InterstitialAd.createForAdRequest(
  "ca-app-pub-9669689294353247/5454926011",
  {
    requestNonPersonalizedAdsOnly: true,
  },
);

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
  const [isInterstitialLoaded, setIsInterstitialLoaded] = useState(false);
  const isShowingInterstitial = useRef(false);

  useEffect(() => {
    const unsubscribeLoaded = interstitialAd.addAdEventListener(
      AdEventType.LOADED,
      () => setIsInterstitialLoaded(true),
    );
    const unsubscribeClosed = interstitialAd.addAdEventListener(
      AdEventType.CLOSED,
      () => setIsInterstitialLoaded(false),
    );
    const unsubscribeError = interstitialAd.addAdEventListener(
      AdEventType.ERROR,
      () => setIsInterstitialLoaded(false),
    );

    interstitialAd.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
      unsubscribeError();
    };
  }, []);

  const showInterstitial = async () => {
    if (!isInterstitialLoaded || isShowingInterstitial.current) return;

    isShowingInterstitial.current = true;

    await new Promise<void>((resolve) => {
      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        unsubscribeClosed();
        unsubscribeError();
        isShowingInterstitial.current = false;
        interstitialAd.load();
        resolve();
      };
      const unsubscribeClosed = interstitialAd.addAdEventListener(
        AdEventType.CLOSED,
        finish,
      );
      const unsubscribeError = interstitialAd.addAdEventListener(
        AdEventType.ERROR,
        finish,
      );

      interstitialAd.show().catch(finish);
    });
  };

  const handleGenerateSummaryWithAd = async (customParam?: string) => {
    console.log("Generating summary with ad...");
    if (isShowingInterstitial.current) return;

    await showInterstitial();
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
  };

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
      onGenerateSummary={handleGenerateSummaryWithAd}
      isProcessing={isProcessing}
      processingStep={processingStep}
      errorMessage={generationError}
      onDismissError={() => setGenerationError(null)}
    />
  );
}
