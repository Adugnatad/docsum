import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import * as Clipboard from "expo-clipboard";
import {
  Star,
  CheckSquare,
  FileText,
  DollarSign,
  AlertTriangle,
  Calendar,
  Users,
  Target,
  Copy,
  ChevronUp,
  ChevronDown,
  Share2,
  Plus,
  BookOpen,
  Check,
  CheckCircle2,
  LucideIcon,
} from "lucide-react-native";
import { SummaryResult, SummarySection } from "../types";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import * as Icons from "lucide-react-native";

interface SummaryScreenProps {
  summary: SummaryResult;
  onNewDocument: () => void;
}
type LucideIconComponent = React.ComponentType<{
  color?: string;
  size?: number;
  className?: string;
}>;

export const SummaryScreen: React.FC<SummaryScreenProps> = ({
  summary,
  onNewDocument,
}) => {
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    [summary.sections[0]?.id || "key-takeaways"]: true,
  });

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getItemText = (item: string | { content: string }) =>
    typeof item === "string" ? item : item.content;

  const copySectionText = async (section: SummarySection) => {
    const textToCopy =
      `${section.title}:\n` +
      section.items.map((item) => `- ${getItemText(item)}`).join("\n");

    try {
      if (Clipboard?.setStringAsync) {
        await Clipboard.setStringAsync(textToCopy);
      } else if (
        typeof navigator !== "undefined" &&
        navigator.clipboard?.writeText
      ) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        throw new Error("Clipboard API is unavailable");
      }

      setCopiedId(section.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.warn("Copy to clipboard failed", error);
    }
  };

  const exportAndShareData = async () => {
    try {
      const formattedText =
        `Summary: ${summary.documentTitle || "Document"}\nDate: ${new Date(
          Date.now(),
        ).toLocaleDateString()}\n\n` +
        summary.sections
          .map(
            (section) =>
              `${section.title}:\n` +
              section.items.map((item) => `- ${getItemText(item)}`).join("\n"),
          )
          .join("\n\n");

      const safeDocumentTitle = summary.documentTitle?.trim()
        ? summary.documentTitle.endsWith(".txt")
          ? summary.documentTitle
          : `${summary.documentTitle}.txt`
        : "docsum_summary.txt";

      const fileUri = FileSystem.documentDirectory + safeDocumentTitle;

      await FileSystem.writeAsStringAsync(fileUri, formattedText, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert(
          "Saved",
          `File stored at: ${fileUri}\nUse a file manager to access it.`,
        );
      }
    } catch (error) {
      console.error("Export error:", error);
      Alert.alert("Error", "Failed to export data.");
    }
  };

  const getIconComponent = (iconName: string) => {
    const componentName = iconName
      .split(/[-_ ]+/)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join("");

    const candidate = (Icons as Record<string, unknown>)[componentName];

    if (
      typeof candidate === "function" ||
      (typeof candidate === "object" && candidate !== null)
    ) {
      return candidate as unknown as LucideIcon;
    }
    console.log(typeof candidate);
    return Icons.FileText as LucideIconComponent;
  };

  const renderSectionIcon = (iconName: string) => {
    const Icon = getIconComponent(iconName);

    return (
      <View className="w-8 h-8 rounded-full bg-[#2036bd] items-center justify-center">
        <Icon
          color="white"
          size={20}
          className="w-4 h-4 text-white fill-white"
        />
      </View>
    );
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, justifyContent: "space-between" }}
      className="p-5 pt-2 max-w-md mx-auto w-full mt-10"
    >
      <View className="space-y-4">
        {/* Section Cards */}
        <View className="gap-3">
          {summary.sections.map((section) => {
            const isExpanded = !!expandedSections[section.id];
            const isCopied = copiedId === section.id;

            return (
              <View
                key={section.id}
                id={`summary-card-${section.id}`}
                className="bg-white rounded-2xl border border-[#c5c5d7]/60 shadow-xs overflow-hidden"
              >
                {/* Header */}
                <TouchableOpacity
                  onPress={() => toggleSection(section.id)}
                  activeOpacity={0.8}
                  className="p-4 flex-row items-center justify-between"
                >
                  <View className="flex-row items-center gap-3">
                    {renderSectionIcon(String(section.icon))}
                    {/* <Text> {String(section.icon)} </Text> */}
                    <Text className="text-base font-bold text-[#191c1e] tracking-tight">
                      {section.title}
                    </Text>
                  </View>

                  <View className="flex-row items-center gap-2">
                    <TouchableOpacity
                      id={`copy-btn-${section.id}`}
                      onPress={() => copySectionText(section)}
                      activeOpacity={0.7}
                      className="w-8 h-8 rounded-lg items-center justify-center"
                    >
                      {isCopied ? (
                        <Check className="w-4 h-4 text-[#15803d]" />
                      ) : (
                        <Copy className="w-4 h-4 text-[#505f76]" />
                      )}
                    </TouchableOpacity>

                    <View className="w-6 h-6 items-center justify-center">
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-[#505f76]" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-[#505f76]" />
                      )}
                    </View>
                  </View>
                </TouchableOpacity>

                {/* Body */}
                {isExpanded && (
                  <View className="px-5 pb-5 pt-1 border-t border-[#f2f4f6]">
                    <View className="space-y-3.5">
                      {section.items.map((item, idx) => (
                        <View
                          key={idx}
                          className="flex-row items-start gap-2.5"
                        >
                          <View className="w-1.5 h-1.5 bg-[#2036bd] rounded-xs mt-1.5" />
                          <Text className="text-xs text-[#454654] leading-relaxed flex-1">
                            {getItemText(item)}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Tagline */}
        <View className="pt-6 pb-2 items-center justify-center text-center space-y-2">
          <BookOpen className="w-10 h-10 text-[#c5c5d7] stroke-[1.5]" />
          <Text className="text-xs font-semibold text-[#8e9099] tracking-wide">
            Summarized with precision
          </Text>
        </View>
      </View>

      {/* Toast Feedback */}
      {copiedId && (
        <View className="bg-[#191c1e] px-4 py-2 rounded-full flex-row items-center gap-2 align-self-center my-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <Text className="text-white text-xs font-semibold">
            Copied to clipboard
          </Text>
        </View>
      )}

      {/* Action Buttons */}
      <View className="pt-4 pb-2 space-y-3 mt-auto">
        <TouchableOpacity
          id="export-summary-btn"
          onPress={exportAndShareData}
          activeOpacity={0.8}
          className="w-full bg-[#2036bd] py-3.5 px-6 mb-2 rounded-2xl shadow-lg flex-row items-center justify-center gap-2"
        >
          <Share2 size={20} color={"white"} className="w-5 h-5 text-white" />
          <Text className="text-white font-bold text-base">Export Summary</Text>
          <View className="self-end my-4 flex flex-row mr-6"></View>
        </TouchableOpacity>

        <TouchableOpacity
          id="new-document-btn"
          onPress={onNewDocument}
          activeOpacity={0.7}
          className="w-full py-2 flex-row items-center justify-center gap-1.5"
        >
          <View className=" w-6 h-6 rounded-[100%] border border-[2px] border-[#2036bd] items-center justify-center">
            <Plus color={"#2036bd"} size={19} className="w-4 h-4 text-white" />
          </View>
          <Text className="text-[#2036bd] font-bold text-sm">New Document</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
