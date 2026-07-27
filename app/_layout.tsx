// @ts-ignore: Allow global CSS import without type declarations
import "../global.css";
import { View } from "react-native";
import { DocSumProvider, useDocSum } from "../src/context/DocSumContext";
import { Header } from "../src/components/Header";
import { BottomNav } from "../src/components/BottomNav";
import { HelpModal } from "../src/components/HelpModal";
import { ExportModal } from "../src/components/ExportModal";

// Route View Containers
import UploadScreenRoute from "./index";
import ProcessScreenRoute from "./process";
import SummaryScreenRoute from "./summary";
import HistoryScreenRoute from "./history";

function AppLayoutContent() {
  const {
    activeTab,
    setActiveTab,
    selectedDocument,
    currentSummary,
    isHelpOpen,
    setIsHelpOpen,
    isExportOpen,
    setIsExportOpen,
  } = useDocSum();

  const handleHeaderBack = () => {
    if (activeTab === "summary") {
      setActiveTab("process");
    } else if (activeTab === "process") {
      setActiveTab("upload");
    } else if (activeTab === "history") {
      setActiveTab("upload");
    }
  };

  return (
    <View className="w-full max-w-[440px] min-h-screen sm:min-h-[850px] sm:max-h-[920px] bg-[#f7f9fb] sm:rounded-[40px] sm:shadow-2xl sm:border-[8px] sm:border-[#191c1e] flex-col overflow-hidden relative">
      {/* Header */}
      <Header
        title={activeTab === "summary" ? "Your Summary" : "DocSum"}
        showBack={activeTab !== "upload"}
        onBack={handleHeaderBack}
        onHelp={activeTab === "upload" ? () => setIsHelpOpen(true) : undefined}
        onMore={
          activeTab === "summary" ? () => setIsExportOpen(true) : undefined
        }
      />

      {/* Screen Body according to App Route */}
      <View className="flex-1 flex-col overflow-y-auto">
        {activeTab === "upload" && <UploadScreenRoute />}
        {activeTab === "process" && <ProcessScreenRoute />}
        {activeTab === "summary" && <SummaryScreenRoute />}
        {activeTab === "history" && <HistoryScreenRoute />}
      </View>

      {/* Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={(tab) => {
          if (tab === "process" && !selectedDocument) return;
          setActiveTab(tab);
        }}
        hasDocument={!!selectedDocument}
        hasSummary={!!currentSummary}
      />

      {/* Modals */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        summary={currentSummary}
      />
    </View>
  );
}

export default function RootLayout() {
  return (
    <DocSumProvider>
      <View className="min-h-screen bg-[#f7f9fb] flex-row justify-center items-center p-0 sm:p-4">
        <AppLayoutContent />
      </View>
    </DocSumProvider>
  );
}
