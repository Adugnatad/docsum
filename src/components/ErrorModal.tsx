import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import { AlertTriangle, X } from "lucide-react-native";

interface ErrorModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  primaryActionLabel?: string;
  onClose: () => void;
  onPrimaryAction?: () => void;
}

export const ErrorModal: React.FC<ErrorModalProps> = ({
  isOpen,
  title,
  message,
  primaryActionLabel = "Try Again",
  onClose,
  onPrimaryAction,
}) => {
  if (!isOpen) {
    return null;
  }

  const handlePrimaryAction = () => {
    if (onPrimaryAction) {
      onPrimaryAction();
      return;
    }

    onClose();
  };

  return (
    <Modal
      transparent
      visible={isOpen}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(17, 24, 39, 0.52)",
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
        }}
      >
        <View
          style={{
            width: "100%",
            maxWidth: 380,
            backgroundColor: "#ffffff",
            borderRadius: 24,
            borderWidth: 1,
            borderColor: "rgba(148, 163, 184, 0.35)",
            padding: 20,
            shadowColor: "#000",
            shadowOpacity: 0.18,
            shadowRadius: 16,
            shadowOffset: { width: 0, height: 10 },
            elevation: 8,
          }}
        >
          <TouchableOpacity
            onPress={onClose}
            activeOpacity={0.75}
            style={{
              position: "absolute",
              top: 14,
              right: 14,
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: "#f3f4f6",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={16} color="#475569" />
          </TouchableOpacity>

          <View
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: "rgba(239, 68, 68, 0.12)",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <AlertTriangle size={28} color="#dc2626" />
          </View>

          <Text
            style={{
              fontSize: 22,
              fontWeight: "700",
              color: "#111827",
              marginBottom: 8,
            }}
          >
            {title}
          </Text>

          <Text
            style={{
              color: "#475569",
              fontSize: 14,
              lineHeight: 22,
              marginBottom: 20,
            }}
          >
            {message}
          </Text>

          <TouchableOpacity
            onPress={handlePrimaryAction}
            activeOpacity={0.9}
            style={{
              width: "100%",
              backgroundColor: "#2036bd",
              borderRadius: 14,
              paddingVertical: 12,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "#ffffff", fontSize: 14, fontWeight: "700" }}>
              {primaryActionLabel}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
