import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { FileUp, SlidersHorizontal, History } from "lucide-react-native";
import { DocSumTab } from "../types";

interface BottomNavProps {
  activeTab: DocSumTab;
  onSelectTab: (tab: DocSumTab) => void;
  hasDocument: boolean;
  hasSummary: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  hasDocument,
}) => {
  return (
    <View
      id="bottom-nav"
      className="bg-[#f7f9fb] border-t border-[#e0e3e5] px-6 py-2 flex-row items-center justify-around"
    >
      {/* Upload Tab */}
      <TouchableOpacity
        id="tab-upload"
        onPress={() => onSelectTab("upload")}
        activeOpacity={0.8}
        className={`flex-col items-center gap-1 py-1 px-4 rounded-xl ${
          activeTab === "upload" ? "opacity-100" : "opacity-70"
        }`}
      >
        <View
          className={`w-10 h-7 rounded-full items-center justify-center ${
            activeTab === "upload" ? "bg-[#3e52d5]/15" : "bg-transparent"
          }`}
        >
          <FileUp
            className={`w-5 h-5 ${
              activeTab === "upload" ? "text-[#2036bd]" : "text-[#505f76]"
            }`}
          />
        </View>
        <Text
          className={`text-xs font-semibold ${
            activeTab === "upload" ? "text-[#2036bd]" : "text-[#505f76]"
          }`}
        >
          Upload
        </Text>
      </TouchableOpacity>

      {/* Process Tab */}
      <TouchableOpacity
        id="tab-process"
        onPress={() => onSelectTab("process")}
        disabled={!hasDocument}
        activeOpacity={0.8}
        className={`flex-col items-center gap-1 py-1 px-4 rounded-xl ${
          !hasDocument
            ? "opacity-40"
            : activeTab === "process"
              ? "opacity-100"
              : "opacity-70"
        }`}
      >
        <View
          className={`w-10 h-7 rounded-full items-center justify-center ${
            activeTab === "process" ? "bg-[#3e52d5]/15" : "bg-transparent"
          }`}
        >
          <SlidersHorizontal
            className={`w-5 h-5 ${
              activeTab === "process" ? "text-[#2036bd]" : "text-[#505f76]"
            }`}
          />
        </View>
        <Text
          className={`text-xs font-semibold ${
            activeTab === "process" ? "text-[#2036bd]" : "text-[#505f76]"
          }`}
        >
          Process
        </Text>
      </TouchableOpacity>

      {/* History Tab */}
      <TouchableOpacity
        id="tab-history"
        onPress={() => onSelectTab("history")}
        activeOpacity={0.8}
        className={`flex-col items-center gap-1 py-1 px-4 rounded-xl ${
          activeTab === "history" ? "opacity-100" : "opacity-70"
        }`}
      >
        <View
          className={`w-10 h-7 rounded-full items-center justify-center ${
            activeTab === "history" ? "bg-[#3e52d5]/15" : "bg-transparent"
          }`}
        >
          <History
            className={`w-5 h-5 ${
              activeTab === "history" ? "text-[#2036bd]" : "text-[#505f76]"
            }`}
          />
        </View>
        <Text
          className={`text-xs font-semibold ${
            activeTab === "history" ? "text-[#2036bd]" : "text-[#505f76]"
          }`}
        >
          History
        </Text>
      </TouchableOpacity>
    </View>
  );
};
