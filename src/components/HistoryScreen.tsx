import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import {
  History,
  FileText,
  Trash2,
  Search,
  Calendar,
  ChevronRight,
} from "lucide-react-native";
import { SummaryResult } from "../types";

interface HistoryScreenProps {
  history: SummaryResult[];
  onSelectSummary: (summary: SummaryResult) => void;
  onClearHistory: () => void;
  onDeleteSummary: (id: string) => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  history,
  onSelectSummary,
  onClearHistory,
  onDeleteSummary,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredHistory = history.filter(
    (item) =>
      item.documentTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sections.some((s) =>
        s.title.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
  );

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, justifyContent: "space-between" }}
      className="p-5 pt-2 max-w-md mx-auto w-full mt-10"
    >
      <View className="space-y-5">
        {/* Screen Header */}
        <View className="flex-row items-center justify-between my-2">
          <View>
            <Text className="text-[24px] font-bold text-[#191c1e] tracking-tight">
              Analysis History
            </Text>
            <Text className="text-xs text-[#505f76] mt-0.5">
              Access your previous document summaries
            </Text>
          </View>

          {history.length > 0 && (
            <TouchableOpacity
              id="clear-history-btn"
              onPress={onClearHistory}
              activeOpacity={0.7}
            >
              <Text className="text-xs text-[#ba1a1a] font-semibold">
                Clear all
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Search Bar */}
        {history.length > 0 && (
          <View className="relative flex-row items-center mb-4">
            <Search className="w-4 h-4 absolute left-3.5 z-10 text-[#757686]" />
            <TextInput
              id="search-history-input"
              value={searchTerm}
              onChangeText={setSearchTerm}
              placeholder="Search previous summaries..."
              placeholderTextColor="#757686"
              className="w-full bg-[#eceef0]/70 border border-transparent focus:border-[#2036bd] text-xs text-[#191c1e] rounded-2xl pl-10 pr-4 py-3"
            />
          </View>
        )}

        {/* History Item List */}
        {filteredHistory.length === 0 ? (
          <View className="bg-white rounded-2xl p-8 border border-[#e0e3e5] items-center text-center space-y-3 my-6">
            <View className="w-12 h-12 rounded-full bg-[#eceef0] items-center justify-center text-[#757686]">
              <History className="w-6 h-6 text-[#757686]" />
            </View>
            <Text className="text-sm font-bold text-[#191c1e]">
              No past summaries found
            </Text>
            <Text className="text-xs text-[#505f76] text-center leading-relaxed">
              Upload a document and click "Generate Summary" to save your first
              document analysis here.
            </Text>
          </View>
        ) : (
          <View className="space-y-3">
            {filteredHistory.map((item) => (
              <TouchableOpacity
                key={item.id}
                id={`history-item-${item.id}`}
                onPress={() => {
                  onSelectSummary(item);
                }}
                activeOpacity={0.8}
                className="bg-white rounded-2xl p-4 border border-[#c5c5d7]/50 shadow-xs flex-row items-center justify-between mb-3"
              >
                <View className="flex-row items-center gap-3.5 flex-1 pr-2">
                  <View className="w-10 h-10 rounded-xl bg-[#3e52d5]/10 text-[#2036bd] items-center justify-center">
                    <FileText className="w-5 h-5 text-[#2036bd]" />
                  </View>

                  <View className="flex-1">
                    <Text
                      className="text-xs font-bold text-[#191c1e]"
                      numberOfLines={1}
                    >
                      {item.documentTitle}
                    </Text>
                    <View className="flex-row items-center gap-2 mt-1">
                      <Text className="text-[11px] text-[#505f76]">•</Text>
                      <Text className="text-[11px] text-[#505f76]">
                        {item.sections.length} sections
                      </Text>
                    </View>
                  </View>
                </View>

                <View className="flex-row items-center gap-2">
                  <TouchableOpacity
                    id={`delete-history-${item.id}`}
                    onPress={() => onDeleteSummary(item.id)}
                    activeOpacity={0.7}
                    className="w-8 h-8 rounded-lg items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4 text-[#ba1a1a]" />
                  </TouchableOpacity>
                  <ChevronRight className="w-4 h-4 text-[#757686]" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};
