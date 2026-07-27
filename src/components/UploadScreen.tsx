import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import {
  Upload,
  FileText,
  CheckCircle2,
  Sparkles,
  X,
  FileCheck2,
  ArrowRight,
} from "lucide-react-native";
import { DocumentData } from "../types";
import { SAMPLE_DOCUMENTS } from "../data/sampleDocs";

interface UploadScreenProps {
  selectedDocument: DocumentData | null;
  onSelectDocument: (doc: DocumentData) => void;
  onClearDocument: () => void;
  onContinue: () => void;
}

export const UploadScreen: React.FC<UploadScreenProps> = ({
  selectedDocument,
  onSelectDocument,
  onClearDocument,
  onContinue,
}) => {
  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "text/plain",
          "text/markdown",
          "application/json",
        ],
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      const asset = result.assets?.[0];
      if (!asset) {
        return;
      }

      const { uri, name, size, mimeType } = asset;

      let content = "";
      if (mimeType?.includes("pdf")) {
        content = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
      } else {
        content = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.UTF8,
        });
      }

      const docData: DocumentData = {
        id: `uploaded-${Date.now()}`,
        name: name || "Uploaded document",
        size: size || undefined,
        type: mimeType || "text/plain",
        content,
        mimeType,
        createdAt: Date.now(),
        isSample: false,
      };

      onSelectDocument(docData);
    } catch (error) {
      Alert.alert("Upload failed", "Unable to read the selected file.");
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, justifyContent: "space-between" }}
      className="p-5 pt-2 max-w-md mx-auto w-full"
    >
      <View className="space-y-6">
        {/* Screen Title & Description */}
        <View className="space-y-2 mt-2">
          <Text className="text-[26px] font-bold text-[#191c1e] tracking-tight leading-tight">
            Analyze your documents
          </Text>
          <Text className="text-[#505f76] text-sm leading-relaxed">
            Upload your files to generate instant summaries, key insights, and
            actionable takeaways.
          </Text>
        </View>

        {/* Upload Dropzone Container */}
        {!selectedDocument ? (
          <View
            id="upload-dropzone"
            className="border-2 border-dashed border-[#3e52d5]/40 rounded-2xl p-8 flex-col items-center justify-center text-center bg-white/60 shadow-xs"
          >
            {/* Round Icon Container */}
            <View className="w-16 h-16 rounded-full bg-[#d3e4fe]/60 items-center justify-center mb-4">
              <View className="w-11 h-11 rounded-full bg-[#3e52d5]/15 items-center justify-center text-[#2036bd]">
                <Upload className="w-6 h-6 stroke-[2.2] text-[#2036bd]" />
              </View>
            </View>

            {/* Call to action */}
            <Text className="text-lg font-bold text-[#191c1e] mb-1">
              Select a Document
            </Text>
            <Text className="text-xs text-[#505f76] mb-6 font-medium">
              PDF, Word, or TXT (Max 25MB)
            </Text>

            {/* Browse Files Button */}
            <TouchableOpacity
              id="browse-files-btn"
              onPress={handlePickDocument}
              activeOpacity={0.8}
              className="bg-[#2036bd] px-6 py-2.5 rounded-full shadow-md flex-row items-center justify-center"
            >
              <Text className="text-white font-semibold text-sm">
                Browse Files
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* Active Document Card */
          <View className="bg-white rounded-2xl p-5 border border-[#3e52d5]/30 shadow-md flex-row items-center justify-between">
            <View className="flex-row items-center gap-3.5 flex-1 pr-2">
              <View className="w-12 h-12 rounded-xl bg-[#3e52d5]/10 items-center justify-center text-[#2036bd]">
                <FileCheck2 className="w-6 h-6 text-[#2036bd]" />
              </View>
              <View className="flex-1">
                <View className="flex-row items-center gap-2">
                  <Text
                    className="text-sm font-bold text-[#191c1e]"
                    numberOfLines={1}
                  >
                    {selectedDocument.name}
                  </Text>
                  {selectedDocument.isSample && (
                    <View className="bg-[#3e52d5]/10 px-2 py-0.5 rounded-full">
                      <Text className="text-[#2036bd] text-[10px] font-bold">
                        Sample
                      </Text>
                    </View>
                  )}
                </View>
                <Text className="text-xs text-[#505f76] mt-0.5">
                  {selectedDocument.size
                    ? `${(selectedDocument.size / 1024).toFixed(0)} KB`
                    : "Ready for analysis"}{" "}
                  • Ready
                </Text>
              </View>
            </View>

            <TouchableOpacity
              id="remove-doc-btn"
              onPress={onClearDocument}
              activeOpacity={0.7}
              className="w-8 h-8 rounded-full items-center justify-center bg-[#f2f4f6]"
            >
              <X className="w-5 h-5 text-[#505f76]" />
            </TouchableOpacity>
          </View>
        )}

        {/* Quick Sample Documents Section */}
        <View className="space-y-3 pt-2">
          <View className="flex-row items-center justify-between">
            <Text className="text-xs font-bold text-[#505f76] tracking-wider uppercase">
              Or test with sample files
            </Text>
            <Sparkles className="w-3.5 h-3.5 text-[#2036bd]" />
          </View>

          <View className="space-y-2.5">
            {SAMPLE_DOCUMENTS.map((doc) => {
              const isCurrent = selectedDocument?.id === doc.id;
              return (
                <TouchableOpacity
                  key={doc.id}
                  id={`sample-doc-${doc.id}`}
                  onPress={() => onSelectDocument(doc)}
                  activeOpacity={0.8}
                  className={`p-3.5 rounded-xl border flex-row items-center justify-between ${
                    isCurrent
                      ? "bg-[#3e52d5]/10 border-[#2036bd]"
                      : "bg-white border-[#e0e3e5]"
                  }`}
                >
                  <View className="flex-row items-center gap-3 flex-1 pr-2">
                    <View
                      className={`w-8 h-8 rounded-lg items-center justify-center ${
                        isCurrent ? "bg-[#2036bd]" : "bg-[#f2f4f6]"
                      }`}
                    >
                      <FileText
                        className={`w-4 h-4 ${isCurrent ? "text-white" : "text-[#505f76]"}`}
                      />
                    </View>
                    <Text
                      className="text-xs font-semibold text-[#191c1e]"
                      numberOfLines={1}
                    >
                      {doc.name}
                    </Text>
                  </View>

                  {isCurrent ? (
                    <CheckCircle2 className="w-4 h-4 text-[#2036bd]" />
                  ) : (
                    <View className="flex-row items-center gap-1">
                      <Text className="text-[11px] text-[#2036bd] font-medium">
                        Use
                      </Text>
                      <ArrowRight className="w-3 h-3 text-[#2036bd]" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>

      {/* Bottom Action Button */}
      <View className="pt-6 pb-2 mt-auto">
        <TouchableOpacity
          id="continue-btn"
          onPress={onContinue}
          disabled={!selectedDocument}
          activeOpacity={0.8}
          className={`w-full py-3.5 rounded-2xl items-center justify-center flex-row gap-2 ${
            selectedDocument ? "bg-[#2036bd] shadow-md" : "bg-[#e0e3e5]"
          }`}
        >
          <Text
            className={`font-bold text-base ${
              selectedDocument ? "text-white" : "text-[#8e9099]"
            }`}
          >
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
