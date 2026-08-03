import z from "zod";
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
  icon: string; // 'star' | 'checkbox' | 'file-text' | 'dollar-sign' | 'alert-triangle' | 'calendar' | 'users' | 'target'
  items: string[];
}

export interface SummaryResult {
  id: string;
  documentTitle: string;
  createdAt: number;
  focusPoints: string[];
  sections: SummarySection[];
  customParameter?: string;
}

const summarySectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  icon: z.string(),
  items: z.array(z.string()),
});

export const summarySchema = z.object({
  id: z.string(),
  documentTitle: z.string(),
  createdAt: z.number(),
  focusPoints: z.array(z.string()),
  sections: z.array(summarySectionSchema),
  customParameter: z.string().optional(),
});
