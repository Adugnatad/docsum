export type DocSumTab = 'upload' | 'process' | 'summary' | 'history';

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
