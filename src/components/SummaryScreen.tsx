import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
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
} from "lucide-react-native";
import { SummaryResult, SummarySection } from "../types";

interface SummaryScreenProps {
  summary: SummaryResult;
  onNewDocument: () => void;
  onExport: () => void;
}

export const SummaryScreen: React.FC<SummaryScreenProps> = ({
  summary,
  onNewDocument,
  onExport,
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

  const copySectionText = (section: SummarySection) => {
    const textToCopy =
      `${section.title}:\n` +
      section.items.map((item) => `- ${item}`).join("\n");
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(section.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const renderSectionIcon = (iconType: string) => {
    switch (iconType) {
      case "star":
        return (
          <View className="w-8 h-8 rounded-full bg-[#2036bd] items-center justify-center">
            <Star
              color={"white"}
              size={20}
              className="w-4 h-4 text-white fill-white"
            />
          </View>
        );
      case "checkbox":
        return (
          <View className="w-8 h-8 rounded-lg bg-[#a44200] items-center justify-center">
            <CheckSquare
              color={"white"}
              size={20}
              className="w-4 h-4 text-white"
            />
          </View>
        );
      case "file-text":
        return (
          <View className="w-8 h-8 rounded-lg bg-[#505f76] items-center justify-center">
            <FileText
              color={"white"}
              size={20}
              className="w-4 h-4 text-white"
            />
          </View>
        );
      case "dollar-sign":
        return (
          <View className="w-8 h-8 rounded-lg bg-[#15803d] items-center justify-center">
            <DollarSign
              color={"white"}
              size={20}
              className="w-4 h-4 text-white"
            />
          </View>
        );
      case "alert-triangle":
        return (
          <View className="w-8 h-8 rounded-lg bg-[#ba1a1a] items-center justify-center">
            <AlertTriangle
              color={"white"}
              size={20}
              className="w-4 h-4 text-white"
            />
          </View>
        );
      case "calendar":
        return (
          <View className="w-8 h-8 rounded-lg bg-[#3e52d5] items-center justify-center">
            <Calendar
              color={"white"}
              size={20}
              className="w-4 h-4 text-white"
            />
          </View>
        );
      case "users":
        return (
          <View className="w-8 h-8 rounded-lg bg-[#6b21a8] items-center justify-center">
            <Users color={"white"} size={20} className="w-4 h-4 text-white" />
          </View>
        );
      default:
        return (
          <View className="w-8 h-8 rounded-lg bg-[#2036bd] items-center justify-center">
            <Target color={"white"} size={20} className="w-4 h-4 text-white" />
          </View>
        );
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, justifyContent: "space-between" }}
      className="p-5 pt-2 max-w-md mx-auto w-full"
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
                    {renderSectionIcon(section.icon)}
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
                            {item}
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
          onPress={onExport}
          activeOpacity={0.8}
          className="w-full bg-[#2036bd] py-3.5 px-6 rounded-2xl shadow-lg flex-row items-center justify-center gap-2"
        >
          <Share2 className="w-5 h-5 text-white" />
          <Text className="text-white font-bold text-base">Export Summary</Text>
        </TouchableOpacity>

        <TouchableOpacity
          id="new-document-btn"
          onPress={onNewDocument}
          activeOpacity={0.7}
          className="w-full py-2 flex-row items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4 text-[#2036bd] stroke-[2.5]" />
          <Text className="text-[#2036bd] font-bold text-sm">New Document</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
