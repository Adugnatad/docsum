import { Schema, Type } from "@google/genai";
import type { LucideIcon } from "lucide-react-native";
export type DocSumTab = "upload" | "process" | "summary" | "history";

export interface DocumentData {
  id: string;
  name: string;
  size?: number;
  type?: string;
  content: string;
  mimeType?: string;
  createdAt: number;
  isSample?: boolean;
}

export interface FocusPoint {
  id: string;
  label: string;
  isSelected: boolean;
  isCustom?: boolean;
}

export interface SummarySection {
  id: string;
  title: string;
  icon: LucideIcon;
  items: { content: string }[];
}

export interface SummaryResult {
  id: string;
  documentTitle: string;
  focusPoints: string[];
  sections: SummarySection[];
}

export const summaryJsonSchema = {
  type: Type.OBJECT,
  properties: {
    id: {
      type: Type.STRING,
      description: "Unique identifier for the summary.",
    },
    documentTitle: {
      type: Type.STRING,
      description: "Title of the summarized document.",
    },

    focusPoints: {
      type: Type.ARRAY,
      description: "The focus areas requested for the summary.",
      items: {
        type: Type.STRING,
      },
    },

    sections: {
      type: Type.ARRAY,
      description: "The structured sections of the summary.",
      items: {
        type: Type.OBJECT,
        properties: {
          id: {
            type: Type.STRING,
            description: "Unique identifier for the section.",
          },
          icon: {
            type: Type.STRING,
            description:
              "Icon representing the summary, must be a valid icon name in lucide-react-native collection.",
          },
          title: {
            type: Type.STRING,
            description: "Section title.",
          },

          items: {
            type: Type.ARRAY,
            description: "List of summary items.",
            items: {
              type: Type.OBJECT,
              properties: {
                content: {
                  type: Type.STRING,
                  description: "Main content of the summary item.",
                },
              },
              required: ["content"],
            },
          },
        },
        required: ["id", "icon", "title", "items"],
      },
    },
  },
  required: ["id", "documentTitle", "focusPoints", "sections"],
} as const satisfies Schema;
