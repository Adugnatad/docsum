import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Check, Plus, Sparkles } from "lucide-react-native";
import { FocusPoint } from "../types";

interface ProcessScreenProps {
  documentName: string;
  focusPoints: FocusPoint[];
  onToggleFocusPoint: (id: string) => void;
  onAddCustomFocusPoint: (label: string) => void;
  onGenerateSummary: (customParam?: string) => void;
  isProcessing: boolean;
  processingStep?: string;
}

export const ProcessScreen: React.FC<ProcessScreenProps> = ({
  documentName,
  focusPoints,
  onToggleFocusPoint,
  onAddCustomFocusPoint,
  onGenerateSummary,
  isProcessing,
  processingStep,
}) => {
  const [customInput, setCustomInput] = useState("");

  const handleAddCustom = () => {
    if (!customInput.trim()) return;
    onAddCustomFocusPoint(customInput.trim());
    setCustomInput("");
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, justifyContent: "space-between" }}
      className="p-5 pt-2 max-w-md mx-auto w-full relative"
    >
      <View className="space-y-6">
        {/* Screen Title & Subtitle */}
        <View className="space-y-2 mb-6">
          <Text className="text-[25px] font-medium mb-4  text-[#191c1e] tracking-tight leading-tight">
            What should we focus on?
          </Text>
          <Text className="text-[16px] text-[#191c1e]  leading-7">
            Select the key parameters you want DocSum to prioritize during the
            analysis.
          </Text>
        </View>

        {/* Suggested Focus Points */}
        <View className="space-y-3">
          <Text className="uppercase mb-6 font-bold text-[#757686] tracking-wider uppercase">
            SUGGESTED FOCUS POINts
          </Text>

          <View className="flex-row flex-wrap gap-2.5 mb-6">
            {focusPoints.map((point) => {
              const isSelected = point.isSelected;
              return (
                <TouchableOpacity
                  key={point.id}
                  id={`chip-${point.id}`}
                  onPress={() => onToggleFocusPoint(point.id)}
                  activeOpacity={0.8}
                  className={` px-6 py-2 rounded-full flex-row items-center gap-1.5 ${
                    isSelected
                      ? "bg-[#2036bd]"
                      : "bg-white border border-[#c5c5d7]"
                  }`}
                >
                  {isSelected && (
                    <Check
                      color={"white"}
                      className="w-3.5 h-3.5 text-white stroke-[3]"
                    />
                  )}
                  <Text
                    className={` font-medium ${
                      isSelected ? "text-white" : "text-[#191c1e]"
                    }`}
                  >
                    {point.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Custom Parameter Section */}
        <View className="space-y-2.5 pt-2">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="  text-[#191c1e]">Custom Parameter</Text>
            <Text className="text-[10px] font-semibold text-[#757686] tracking-widest uppercase">
              OPTIONAL
            </Text>
          </View>

          <View className="relative flex-row items-center">
            <TextInput
              id="custom-parameter-input"
              value={customInput}
              onChangeText={setCustomInput}
              placeholder="e.g. Environmental impact, Project timeline"
              placeholderTextColor="#757686"
              className="w-full bg-[#eceef0]/60 border border-transparent focus:border-[#2036bd] text-xs text-[#191c1e] rounded-2xl px-4 py-3.5 pr-10"
            />
            {customInput.trim() !== "" && (
              <TouchableOpacity
                id="add-custom-btn"
                onPress={handleAddCustom}
                activeOpacity={0.8}
                className="absolute right-2.5 w-7 h-7 rounded-full bg-[#2036bd] items-center justify-center"
              >
                <Plus
                  color={"white"}
                  size={16}
                  className="w-4 h-4 text-white"
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* Bottom Generate Button */}
      <View className="pt-6 pb-2 mt-auto">
        <TouchableOpacity
          id="generate-summary-btn"
          onPress={() => onGenerateSummary(customInput.trim() || undefined)}
          disabled={isProcessing}
          activeOpacity={0.8}
          className="w-full bg-[#2036bd] py-3.5 px-6 rounded-full shadow-lg flex-row items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <ActivityIndicator color="#ffffff" size="small" />
              <Text className="text-white font-bold text-base">
                Analyzing Document...
              </Text>
            </>
          ) : (
            <>
              <Text className="text-white font-bold text-base mr-2">
                Generate Summary
              </Text>
              <Sparkles
                size={20}
                color={"white"}
                className="w-5 h-5 text-white"
              />
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Loading Modal Overlay */}
      {isProcessing && (
        <View
          id="processing-modal"
          className="absolute inset-0 bg-white/95 z-40 rounded-3xl items-center justify-center p-6 text-center"
        >
          <View className="w-16 h-16 rounded-full bg-[#3e52d5]/15 items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-[#2036bd]" />
          </View>

          <Text className="text-xl font-bold text-[#191c1e] mb-2">
            Summarizing with Precision
          </Text>

          <Text className="text-xs text-[#505f76] mb-6 text-center max-w-xs">
            DocSum AI is extracting key insights and formatting your prioritized
            parameters.
          </Text>

          <ActivityIndicator color="#2036bd" size="large" className="mb-3" />

          <Text className="text-xs font-semibold text-[#2036bd]">
            {processingStep || "Parsing document content..."}
          </Text>
        </View>
      )}
    </ScrollView>
  );
};
