import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import { Upload, X, FileCheck2 } from "lucide-react-native";
import { DocumentData } from "../types";

const MAX_FILE_SIZE_BYTES = 4 * 1024 * 1024;

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
      if (size && size > MAX_FILE_SIZE_BYTES) {
        Alert.alert(
          "File too large",
          "Please upload a file smaller than 4 MB.",
        );
        return;
      }

      let normalizedUri = uri;
      if (normalizedUri?.startsWith("content://")) {
        const cacheFileName = `${Date.now()}-${name}`;
        const cacheUri = `${FileSystem.cacheDirectory}${cacheFileName}`;
        try {
          const copied: any = await FileSystem.copyAsync({
            from: normalizedUri,
            to: cacheUri,
          });
          normalizedUri = copied.uri;
        } catch (copyError) {
          console.warn("Unable to copy content URI to cache:", copyError);
        }
      }

      const docData: DocumentData = {
        name: name,
        size: size || 0,
        type: mimeType || "text/plain",
        uri: normalizedUri,
      };

      onSelectDocument(docData);
    } catch (error) {
      console.log("Document upload error:", error);
      Alert.alert("Upload failed", "Unable to read the selected file.");
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, justifyContent: "space-between" }}
      className="p-5 pt-2 max-w-md mx-auto my-10 w-full"
    >
      <View className="space-y-6">
        {/* Screen Title & Description */}
        <View className="flex flex-col items-center mt-2 mb-6">
          <Text className="text-[26px] font-bold text-[#191c1e] tracking-tight leading-tight mb-3">
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
            <View className="w-16 h-16 rounded-full bg-[#d3e4fe]/60 items-center justify-center mb-4">
              <View className="w-11 h-11 rounded-full bg-[#3e52d5]/15 items-center justify-center text-[#2036bd]">
                <Upload size={24} color="#2036bd" strokeWidth={2.2} />
              </View>
            </View>

            <Text className="text-lg font-bold text-[#191c1e] mb-1">
              Select a Document
            </Text>
            <Text className="text-xs text-[#505f76] mb-6 font-medium">
              PDF, Word, or TXT (Max 4MB)
            </Text>

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
                <FileCheck2 size={24} color="#2036bd" />
              </View>
              <View className="flex-1">
                <View className="flex-row items-center gap-2">
                  <Text
                    className="text-sm font-bold text-[#191c1e]"
                    numberOfLines={1}
                  >
                    {selectedDocument.name}
                  </Text>
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
              <X size={20} color="#505f76" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Bottom Action Button */}
      <View className="pt-6 pb-2 mt-auto">
        {/* <TouchableOpacity
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
        </TouchableOpacity> */}
      </View>
    </ScrollView>
  );
};
