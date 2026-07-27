import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import {
  X,
  Copy,
  Download,
  FileSpreadsheet,
  Printer,
  Check,
} from "lucide-react-native";
import { SummaryResult } from "../types";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  summary: SummaryResult | null;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  summary,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !summary) return null;

  const formattedText =
    `# ${summary.documentTitle} - DocSum Summary\nDate: ${new Date(summary.createdAt).toLocaleDateString()}\n\n` +
    summary.sections
      .map(
        (sec) =>
          `## ${sec.title}\n` + sec.items.map((item) => `- ${item}`).join("\n"),
      )
      .join("\n\n");

  const handleCopyAll = () => {
    navigator.clipboard.writeText(formattedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([formattedText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${summary.documentTitle.replace(/\s+/g, "_")}_Summary.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadMarkdown = () => {
    const blob = new Blob([formattedText], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${summary.documentTitle.replace(/\s+/g, "_")}_Summary.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      transparent
      visible={isOpen}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/40 items-center justify-center p-4">
        <View className="bg-white rounded-3xl max-w-sm w-full p-6 border border-[#c5c5d7] relative space-y-4 shadow-xl">
          <TouchableOpacity
            id="close-export-modal-btn"
            onPress={onClose}
            activeOpacity={0.7}
            className="absolute right-4 top-4 w-8 h-8 rounded-full bg-[#f2f4f6] items-center justify-center z-10"
          >
            <X className="w-4 h-4 text-[#505f76]" />
          </TouchableOpacity>

          <View>
            <Text className="text-lg font-bold text-[#191c1e]">
              Export Summary
            </Text>
            <Text className="text-xs text-[#505f76] mt-0.5">
              Choose your preferred export format for "{summary.documentTitle}"
            </Text>
          </View>

          <View className="space-y-2 pt-2">
            {/* Copy All */}
            <TouchableOpacity
              id="export-copy-all-btn"
              onPress={handleCopyAll}
              activeOpacity={0.8}
              className="w-full bg-[#f2f4f6] py-3 px-4 rounded-xl flex-row items-center justify-between"
            >
              <View className="flex-row items-center gap-2.5">
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4 text-[#191c1e]" />
                )}
                <Text className="text-xs font-semibold text-[#191c1e]">
                  {copied ? "Copied to Clipboard!" : "Copy Formatted Text"}
                </Text>
              </View>
              <Text className="text-[10px] text-[#757686]">Text</Text>
            </TouchableOpacity>

            {/* Download TXT */}
            <TouchableOpacity
              id="export-download-txt-btn"
              onPress={handleDownloadTxt}
              activeOpacity={0.8}
              className="w-full bg-[#f2f4f6] py-3 px-4 rounded-xl flex-row items-center justify-between"
            >
              <View className="flex-row items-center gap-2.5">
                <Download className="w-4 h-4 text-[#191c1e]" />
                <Text className="text-xs font-semibold text-[#191c1e]">
                  Download Text File (.txt)
                </Text>
              </View>
              <Text className="text-[10px] text-[#757686]">Plain Text</Text>
            </TouchableOpacity>

            {/* Download Markdown */}
            <TouchableOpacity
              id="export-download-md-btn"
              onPress={handleDownloadMarkdown}
              activeOpacity={0.8}
              className="w-full bg-[#f2f4f6] py-3 px-4 rounded-xl flex-row items-center justify-between"
            >
              <View className="flex-row items-center gap-2.5">
                <FileSpreadsheet className="w-4 h-4 text-[#191c1e]" />
                <Text className="text-xs font-semibold text-[#191c1e]">
                  Download Markdown (.md)
                </Text>
              </View>
              <Text className="text-[10px] text-[#757686]">Markdown</Text>
            </TouchableOpacity>

            {/* Print / Save PDF */}
            <TouchableOpacity
              id="export-print-btn"
              onPress={handlePrint}
              activeOpacity={0.8}
              className="w-full bg-[#f2f4f6] py-3 px-4 rounded-xl flex-row items-center justify-between"
            >
              <View className="flex-row items-center gap-2.5">
                <Printer className="w-4 h-4 text-[#191c1e]" />
                <Text className="text-xs font-semibold text-[#191c1e]">
                  Print / Save as PDF
                </Text>
              </View>
              <Text className="text-[10px] text-[#757686]">PDF</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            id="done-export-modal-btn"
            onPress={onClose}
            activeOpacity={0.8}
            className="w-full bg-[#2036bd] items-center justify-center py-3 rounded-xl mt-2"
          >
            <Text className="text-white font-bold text-xs">Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
