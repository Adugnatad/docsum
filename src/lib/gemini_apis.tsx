import { File } from "expo-file-system";
const API_BASE = process.env.EXPO_PUBLIC_GEMINI_API_BASE;

const POLL_INTERVAL_MS = 3000;
const MAX_POLL_ATTEMPTS = 40; // ~2 minutes at 3s intervals

// ---------- Types ----------

export interface DocumentAsset {
  uri: string;
  name: string;
  size: number;
  type: string | null;
}

export interface UploadResponse {
  fileId: string;
  state: string;
}

export interface FileStatusResponse {
  fileId: string;
  state: string;
  uri?: string;
  mimeType?: string;
}

export interface SummarizeResponse {
  summary: string;
}

export interface RunFullSummaryFlowOptions {
  prompt?: string;
  onStateChange?: (state: string) => void;
}

export class GeminiApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public code?: string,
  ) {
    super(message);
    this.name = "GeminiApiError";
  }
}

// ---------- Helpers ----------

async function parseJsonOrThrow<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new GeminiApiError(
      data?.error || `Request failed with status ${res.status}`,
      res.status,
      data?.code,
    );
  }

  return data as T;
}

// ---------- 1. Upload ----------

export async function uploadDocument(
  asset: DocumentAsset,
): Promise<UploadResponse> {
  const formData = new FormData();

  formData.append("file", new File(asset.uri));

  const res = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    body: formData,
  });

  return parseJsonOrThrow<UploadResponse>(res);
}

// ---------- 2. Poll status ----------

export async function getFileStatus(
  fileId: string,
): Promise<FileStatusResponse> {
  const encodedId = encodeURIComponent(fileId);
  const res = await fetch(`${API_BASE}/status/${encodedId}`);
  return parseJsonOrThrow<FileStatusResponse>(res);
}

/**
 * Polls /api/status/[fileId] until the file reaches ACTIVE or FAILED,
 * or MAX_POLL_ATTEMPTS is exceeded.
 */
export async function pollFileStatus(
  fileId: string,
  onStateChange?: (state: string) => void,
): Promise<FileStatusResponse> {
  let attempts = 0;
  let status = await getFileStatus(fileId);
  onStateChange?.(status.state);

  while (status.state === "PROCESSING") {
    if (attempts >= MAX_POLL_ATTEMPTS) {
      throw new GeminiApiError(
        "File processing timed out",
        504,
        "PROCESSING_TIMEOUT",
      );
    }

    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
    status = await getFileStatus(fileId);
    onStateChange?.(status.state);
    attempts++;
  }

  if (status.state === "FAILED") {
    throw new GeminiApiError(
      "Gemini file processing failed",
      502,
      "PROCESSING_FAILED",
    );
  }

  return status;
}

// ---------- 3. Summarize ----------

export async function summarizeDocument(
  fileId: string,
  prompt?: string,
): Promise<SummarizeResponse> {
  const encodedId = encodeURIComponent(fileId);

  const res = await fetch(`${API_BASE}/summarize/${encodedId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  return parseJsonOrThrow<SummarizeResponse>(res);
}

// ---------- 4. Full orchestrated flow ----------

/**
 * Runs upload -> poll -> summarize in sequence.
 * Pass onStateChange to drive a progress indicator in the UI.
 */
export async function runFullSummaryFlow(
  asset: DocumentAsset,
  params: string,
  options: RunFullSummaryFlowOptions = {},
): Promise<string> {
  const { onStateChange } = options;

  const prompt = `Please summarize the document with the following focus points: ${params}`;

  onStateChange?.("UPLOADING");
  const { fileId } = await uploadDocument(asset);

  await pollFileStatus(fileId, onStateChange);

  onStateChange?.("SUMMARIZING");
  const { summary } = await summarizeDocument(fileId, prompt);

  onStateChange?.("DONE");
  return summary;
}
