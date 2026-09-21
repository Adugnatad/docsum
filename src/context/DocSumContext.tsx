import React, { createContext, useContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { DocSumTab, DocumentData, FocusPoint, SummaryResult } from "../types";
import { runFullSummaryFlow } from "../lib/gemini_apis";

const DEFAULT_FOCUS_POINTS: FocusPoint[] = [
  { id: "key-takeaways", label: "Key Takeaways", isSelected: true },
  { id: "action-items", label: "Action Items", isSelected: true },
  { id: "financial-figures", label: "Financial Figures", isSelected: false },
  { id: "risks-concerns", label: "Risks & Concerns", isSelected: false },
  { id: "dates-deadlines", label: "Dates & Deadlines", isSelected: false },
  { id: "key-people", label: "Key People", isSelected: false },
];

interface DocSumContextType {
  activeTab: DocSumTab;
  setActiveTab: (tab: DocSumTab) => void;
  selectedDocument: DocumentData | null;
  setSelectedDocument: (doc: DocumentData | null) => void;
  focusPoints: FocusPoint[];
  handleToggleFocusPoint: (id: string) => void;
  handleAddCustomFocusPoint: (label: string) => void;
  currentSummary: SummaryResult | null;
  setCurrentSummary: (sum: SummaryResult | null) => void;
  history: SummaryResult[];
  isProcessing: boolean;
  processingStep: string;
  handleGenerateSummary: (customParam?: string) => Promise<void>;
  clearHistory: () => void;
  deleteSummaryItem: (id: string) => void;
  isHelpOpen: boolean;
  setIsHelpOpen: (open: boolean) => void;
  isExportOpen: boolean;
  setIsExportOpen: (open: boolean) => void;
}

const DocSumContext = createContext<DocSumContextType | undefined>(undefined);

export const DocSumProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [activeTab, setActiveTab] = useState<DocSumTab>("upload");
  const [selectedDocument, setSelectedDocument] = useState<DocumentData | null>(
    null,
  );
  const [focusPoints, setFocusPoints] =
    useState<FocusPoint[]>(DEFAULT_FOCUS_POINTS);
  const [currentSummary, setCurrentSummary] = useState<SummaryResult | null>(
    null,
  );
  const [history, setHistory] = useState<SummaryResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] =
    useState<string>("Parsing content...");
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [progress, setProgress] = useState("");

  const generateSummary = async (params: string) => {
    console.log("Document Title", selectedDocument?.name);
    if (!selectedDocument) return;
    setProgress("");
    const summary = await runFullSummaryFlow(selectedDocument, params, {
      onStateChange: (state) => setProgress(state),
    });
    const parsedSummary = JSON.parse(summary);
    return parsedSummary as SummaryResult;
  };

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const saved = await SecureStore.getItemAsync("docsum_history");
        if (saved) {
          setHistory(JSON.parse(saved));
        }
      } catch (e) {
        console.error("Error loading history:", e);
      }
    };

    loadHistory();
  }, []);

  const persistHistory = async (updated: SummaryResult[]) => {
    try {
      await SecureStore.setItemAsync("docsum_history", JSON.stringify(updated));
    } catch (e) {
      console.error("Error saving history:", e);
    }
  };

  const saveToHistory = (newSummary: SummaryResult) => {
    const updated = [
      newSummary,
      ...history.filter((h) => h.id !== newSummary.id),
    ].slice(0, 20);
    setHistory(updated);
    persistHistory(updated);
  };

  const clearHistory = () => {
    setHistory([]);
    SecureStore.deleteItemAsync("docsum_history").catch((e) => {
      console.error("Error clearing history:", e);
    });
  };

  const deleteSummaryItem = (id: string) => {
    const updated = history.filter((h) => h.id !== id);
    setHistory(updated);
    persistHistory(updated);
  };

  const handleToggleFocusPoint = (id: string) => {
    setFocusPoints((prev) =>
      prev.map((point) =>
        point.id === id ? { ...point, isSelected: !point.isSelected } : point,
      ),
    );
  };

  const handleAddCustomFocusPoint = (label: string) => {
    const newId = `custom-${Date.now()}`;
    const newPoint: FocusPoint = {
      id: newId,
      label,
      isSelected: true,
      isCustom: true,
    };
    setFocusPoints((prev) => [...prev, newPoint]);
  };

  const handleGenerateSummary = async (customParam?: string) => {
    if (!selectedDocument) return;

    setIsProcessing(true);
    setProcessingStep("Reading document text...");
    setCurrentSummary(null);

    const activeLabels = focusPoints
      .filter((f) => f.isSelected)
      .map((f) => f.label);

    console.log(
      "Generating summary with focus points:",
      activeLabels,
      "and custom parameter:",
      customParam,
    );

    try {
      setProcessingStep("Formatting AI insights...");

      const data = await generateSummary(
        [...activeLabels, ...(customParam ? [customParam] : [])].join(", "),
      );

      if (!data) {
        throw new Error("The AI summary did not return any content.");
      }

      const resultSummary: SummaryResult = {
        id: `summary-${Date.now()}`,
        documentTitle: data.documentTitle,
        focusPoints: data.focusPoints,
        sections: data.sections,
      };

      setCurrentSummary(resultSummary);
      saveToHistory(resultSummary);
    } catch (err) {
      console.error("Summary generation error:", err);
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong while generating your summary.";
      throw new Error(message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <DocSumContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedDocument,
        setSelectedDocument,
        focusPoints,
        handleToggleFocusPoint,
        handleAddCustomFocusPoint,
        currentSummary,
        setCurrentSummary,
        history,
        isProcessing,
        processingStep,
        handleGenerateSummary,
        clearHistory,
        deleteSummaryItem,
        isHelpOpen,
        setIsHelpOpen,
        isExportOpen,
        setIsExportOpen,
      }}
    >
      {children}
    </DocSumContext.Provider>
  );
};

export const useDocSum = () => {
  const context = useContext(DocSumContext);
  if (!context) {
    throw new Error("useDocSum must be used within a DocSumProvider");
  }
  return context;
};
