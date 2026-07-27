import React from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { X, Sparkles, CheckCircle2 } from "lucide-react-native";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <Modal
      transparent
      visible={isOpen}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/40 items-center justify-center p-4">
        <View className="bg-white rounded-3xl max-w-sm w-full p-6 border border-[#c5c5d7] relative space-y-4 shadow-xl">
          <TouchableOpacity
            id="close-help-modal-btn"
            onPress={onClose}
            activeOpacity={0.7}
            className="absolute right-4 top-4 w-8 h-8 rounded-full bg-[#f2f4f6] items-center justify-center z-10"
          >
            <X className="w-4 h-4 text-[#505f76]" />
          </TouchableOpacity>

          <View className="flex-row items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-[#2036bd]" />
            <Text className="text-lg font-bold text-[#191c1e]">
              About DocSum
            </Text>
          </View>

          <Text className="text-xs text-[#505f76] leading-relaxed">
            DocSum is an AI-powered document intelligence tool designed to turn
            long PDFs, Word documents, and text files into concise, prioritized
            summaries.
          </Text>

          <View className="space-y-2 pt-1">
            <View className="flex-row items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#2036bd] mt-0.5" />
              <Text className="text-xs text-[#191c1e] flex-1">
                <Text className="font-bold">Upload Any File:</Text> Supports
                PDF, DOCX, TXT up to 25MB.
              </Text>
            </View>
            <View className="flex-row items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#2036bd] mt-0.5" />
              <Text className="text-xs text-[#191c1e] flex-1">
                <Text className="font-bold">Prioritize Insights:</Text> Choose
                parameters like Key Takeaways, Action Items, or custom prompts.
              </Text>
            </View>
            <View className="flex-row items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#2036bd] mt-0.5" />
              <Text className="text-xs text-[#191c1e] flex-1">
                <Text className="font-bold">Export & Share:</Text> Copy
                individual sections or export full summaries instantly.
              </Text>
            </View>
          </View>

          <TouchableOpacity
            id="got-it-help-btn"
            onPress={onClose}
            activeOpacity={0.8}
            className="w-full bg-[#2036bd] items-center justify-center py-3 rounded-xl mt-2"
          >
            <Text className="text-white font-bold text-xs">Got it</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
