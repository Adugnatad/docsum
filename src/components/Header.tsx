import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ArrowLeft, HelpCircle, MoreVertical } from "lucide-react-native";

interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  onHelp?: () => void;
  onMore?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBack = true,
  onBack,
  onHelp,
  onMore,
}) => {
  return (
    <View
      id="header"
      className="bg-[#f7f9fb] px-5 py-3.5 flex-row items-center justify-between border-b border-transparent"
    >
      <View className="flex-row items-center gap-3">
        {showBack && (
          <TouchableOpacity
            id="header-back-btn"
            onPress={onBack}
            activeOpacity={0.7}
            className="w-10 h-10 rounded-full items-center justify-center -ml-2"
            accessibilityLabel="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-[#191c1e]" />
          </TouchableOpacity>
        )}
        <Text className="text-xl font-bold text-[#2036bd] tracking-tight">
          {title}
        </Text>
      </View>

      <View className="flex-row items-center gap-1">
        {onHelp && (
          <TouchableOpacity
            id="header-help-btn"
            onPress={onHelp}
            activeOpacity={0.7}
            className="w-9 h-9 rounded-full items-center justify-center"
            accessibilityLabel="Help"
          >
            <HelpCircle className="w-5 h-5 text-[#454654]" />
          </TouchableOpacity>
        )}

        {onMore && (
          <TouchableOpacity
            id="header-more-btn"
            onPress={onMore}
            activeOpacity={0.7}
            className="w-9 h-9 rounded-full items-center justify-center"
            accessibilityLabel="More options"
          >
            <MoreVertical className="w-5 h-5 text-[#454654]" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
