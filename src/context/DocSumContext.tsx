import React, { createContext, useContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import {
  DocSumTab,
  DocumentData,
  FocusPoint,
  summaryJsonSchema,
  SummaryResult,
} from "../types";
import { SAMPLE_DOCUMENTS } from "../data/sampleDocs";
import { useRouter } from "expo-router";
import Constants from "expo-constants";
import { GoogleGenAI } from "@google/genai";
import { z } from "zod";

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
    SAMPLE_DOCUMENTS[0],
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

  const router = useRouter();
  // const apiKey = Constants.expoConfig?.extra?.apiKey;

  const ai = new GoogleGenAI({
    apiKey: Constants.expoConfig?.extra?.apiKey,
  });

  // useEffect(() => {

  //   testGemini().catch((e) => console.error("Gemini test error:", e));
  // }, []);

  const generateSummary = async (customParam?: string) => {
    console.log("Document Title", selectedDocument?.name);
    try {
      const interaction = await ai.interactions.create({
        model: "gemini-3.6-flash",
        input: [
          {
            type: "text",
            text: "give me a summary of this document based on the given parameters",
          },
          {
            type: "text",
            text:
              "focus points: " +
              focusPoints
                .filter((fp) => fp.isSelected)
                .map((fp) => fp.label)
                .join(", ") +
              (customParam ? `, ${customParam}` : ""),
          },
          {
            type: "text",
            text: selectedDocument?.content || "",
          },
        ],
        response_format: {
          type: "text",
          mime_type: "application/json",
          schema: summaryJsonSchema,
        },
      });
      const summary = JSON.parse(interaction.output_text || "{}");
      // console.log(summary);
      console.log(interaction.output_text);
      return summary;
    } catch (error) {
      console.error("Error generating summary:", error);
      throw error;
    }
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

      await generateSummary().then((data: SummaryResult) => {
        const resultSummary: SummaryResult = {
          id: `summary-${Date.now()}`,
          documentTitle: data.documentTitle || selectedDocument.name,
          focusPoints: activeLabels,
          sections: data.sections,
        };

        setCurrentSummary(resultSummary);
        saveToHistory(resultSummary);
        // setActiveTab("summary");
        router.push("/summary");
      });
    } catch (err) {
      console.error("Summary generation error:", err);
      const fallbackSummary: SummaryResult = {
        id: `summary-${Date.now()}`,
        documentTitle: selectedDocument.name,
        focusPoints: activeLabels,
        sections: [
          {
            id: "key-takeaways",
            title: "Key Takeaways",
            icon: "file-text",
            items: [
              {
                content: `The proposed Q3 roadmap prioritizes infrastructure stability over new feature velocity to address technical debt in ${selectedDocument.name}.`,
              },
              {
                content:
                  "Budget allocation for the AI research department is set to increase by 15% starting next fiscal month.",
              },
              {
                content:
                  "Remote work policies are being formalized to support a hybrid model indefinitely.",
              },
            ],
          },
          {
            id: "action-items",
            title: "Action Items",
            icon: "check-circle",
            items: [
              {
                content:
                  "Finalize engineering quarter sprint commitments with team leads by Friday.",
              },
              {
                content:
                  "Submit revised Q3 hardware & cloud infra expenditure request to Finance.",
              },
              {
                content:
                  "Schedule all-hands briefing to review updated remote work security compliance rules.",
              },
            ],
          },
          {
            id: "overview",
            title: "Overview",
            icon: "info-circle",
            items: [
              {
                content: `Comprehensive executive summary of ${selectedDocument.name}, evaluating core deliverables, resource commitments, and operational milestones.`,
              },
              {
                content:
                  "Strategic focus centers on long-term maintainability, security compliance, and measurable ROI.",
              },
            ],
          },
        ],
      };
      setCurrentSummary(fallbackSummary);
      saveToHistory(fallbackSummary);
      // setActiveTab("summary");
      router.push("/summary");
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
