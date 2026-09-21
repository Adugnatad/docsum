import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useDocSum } from "../../src/context/DocSumContext";
import { router } from "expo-router";
import { FileCheck2, Upload, X } from "lucide-react-native";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import { DocumentData } from "@/src/types";
import { ErrorModal } from "@/src/components/ErrorModal";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
  InterstitialAd,
  AdEventType,
} from "react-native-google-mobile-ads";

const MAX_FILE_SIZE_BYTES = 4 * 1024 * 1024;

export default function UploadRoute() {
  const { selectedDocument, setSelectedDocument, setActiveTab } = useDocSum();
  const [errorModal, setErrorModal] = React.useState({
    isOpen: false,
    title: "",
    message: "",
  });

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
        setErrorModal({
          isOpen: true,
          title: "File too large",
          message: "Please upload a file smaller than 4 MB.",
        });
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

      setSelectedDocument(docData);
    } catch (error) {
      console.log("Document upload error:", error);
      setErrorModal({
        isOpen: true,
        title: "Upload failed",
        message: "Unable to read the selected file.",
      });
    }
  };

  const closeErrorModal = () => {
    setErrorModal((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "space-between",
        padding: 20,
        paddingTop: 8,
        maxWidth: 448,
        alignSelf: "center",
        marginVertical: 40,
        width: "100%",
      }}
    >
      <View style={{ gap: 24 }}>
        {/* Screen Title & Description */}
        <View style={{ alignItems: "center", marginTop: 8, marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 26,
              fontWeight: "700",
              color: "#191c1e",
              lineHeight: 31,
              marginBottom: 12,
            }}
          >
            Analyze your documents
          </Text>
          <Text style={{ color: "#505f76", fontSize: 14, lineHeight: 22 }}>
            Upload your files to generate instant summaries, key insights, and
            actionable takeaways.
          </Text>
        </View>

        {/* Upload Dropzone Container */}
        {!selectedDocument ? (
          <View
            id="upload-dropzone"
            style={{
              borderWidth: 2,
              borderStyle: "dashed",
              borderColor: "rgba(62, 82, 213, 0.4)",
              borderRadius: 16,
              padding: 32,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "white",
              shadowColor: "#000",
              shadowOpacity: 0.08,
              shadowRadius: 2,
              shadowOffset: { width: 0, height: 1 },
              elevation: 1,
            }}
          >
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                backgroundColor: "rgba(211, 228, 254, 0.6)",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: "rgba(62, 82, 213, 0.15)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Upload size={24} color="#2036bd" strokeWidth={2.2} />
              </View>
            </View>

            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: "#191c1e",
                marginBottom: 4,
              }}
            >
              Select a Document
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: "#505f76",
                marginBottom: 24,
                fontWeight: "500",
              }}
            >
              PDF, Word, or TXT (Max 4MB)
            </Text>

            <TouchableOpacity
              id="browse-files-btn"
              onPress={handlePickDocument}
              activeOpacity={0.8}
              style={{
                backgroundColor: "#2036bd",
                paddingHorizontal: 24,
                paddingVertical: 10,
                borderRadius: 999,
                shadowColor: "#000",
                shadowOpacity: 0.2,
                shadowRadius: 4,
                shadowOffset: { width: 0, height: 2 },
                elevation: 3,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "600", fontSize: 14 }}>
                Browse Files
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* Active Document Card */
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 16,
              padding: 20,
              borderWidth: 1,
              borderColor: "rgba(62, 82, 213, 0.3)",
              shadowColor: "#000",
              shadowOpacity: 0.16,
              shadowRadius: 4,
              shadowOffset: { width: 0, height: 2 },
              elevation: 3,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 14,
                flex: 1,
                paddingRight: 8,
              }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  backgroundColor: "rgba(62, 82, 213, 0.1)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FileCheck2 size={24} color="#2036bd" />
              </View>
              <View style={{ flex: 1 }}>
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "700",
                      color: "#191c1e",
                    }}
                    numberOfLines={1}
                  >
                    {selectedDocument.name}
                  </Text>
                </View>
                <Text style={{ fontSize: 12, color: "#505f76", marginTop: 2 }}>
                  {selectedDocument.size
                    ? `${(selectedDocument.size / 1024).toFixed(0)} KB`
                    : "Ready for analysis"}{" "}
                  • Ready
                </Text>
              </View>
            </View>

            <TouchableOpacity
              id="remove-doc-btn"
              onPress={() => setSelectedDocument(null)}
              activeOpacity={0.7}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f2f4f6",
              }}
            >
              <X size={20} color="#505f76" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Bottom Action Button */}
      <View style={{ paddingTop: 24, paddingBottom: 8, marginTop: "auto" }}>
        <TouchableOpacity
          id="continue-btn"
          onPress={() => {
            setActiveTab("process");
            router.push("/process");
          }}
          disabled={!selectedDocument}
          activeOpacity={0.8}
          style={{
            width: "100%",
            paddingVertical: 14,
            borderRadius: 16,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            gap: 8,
            backgroundColor: selectedDocument ? "#2036bd" : "#e0e3e5",
            shadowColor: "#000",
            shadowOpacity: selectedDocument ? 0.2 : 0,
            shadowRadius: 4,
            shadowOffset: { width: 0, height: 2 },
            elevation: selectedDocument ? 3 : 0,
          }}
        >
          <Text
            style={{
              fontWeight: "700",
              fontSize: 16,
              color: selectedDocument ? "#fff" : "#8e9099",
            }}
          >
            Continue
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{ marginTop: 24, alignItems: "center" }}>
        <BannerAd
          unitId={TestIds.BANNER}
          size={BannerAdSize.BANNER}
          requestOptions={{ requestNonPersonalizedAdsOnly: true }}
        />
      </View>
      <ErrorModal
        isOpen={errorModal.isOpen}
        title={errorModal.title}
        message={errorModal.message}
        primaryActionLabel="Try Again"
        onClose={closeErrorModal}
        onPrimaryAction={closeErrorModal}
      />
    </ScrollView>
  );
}
