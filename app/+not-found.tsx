import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useDocSum } from '../src/context/DocSumContext';

export default function NotFoundScreen() {
  const { setActiveTab } = useDocSum();

  return (
    <View className="flex-1 items-center justify-center p-6 text-center space-y-4">
      <Text className="text-xl font-bold text-[#191c1e]">Screen Not Found</Text>
      <Text className="text-xs text-[#505f76]">The requested screen does not exist.</Text>
      <TouchableOpacity
        onPress={() => setActiveTab('upload')}
        activeOpacity={0.8}
        className="bg-[#2036bd] px-4 py-2.5 rounded-xl shadow-xs"
      >
        <Text className="text-white text-xs font-bold">Return to Home</Text>
      </TouchableOpacity>
    </View>
  );
}
