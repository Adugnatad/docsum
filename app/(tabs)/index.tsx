import React from "react";
import { useDocSum } from "../../src/context/DocSumContext";
import { UploadScreen } from "../../src/components/UploadScreen";
import { useRouter } from "expo-router";

export default function UploadRoute() {
  const { selectedDocument, setSelectedDocument, setActiveTab } = useDocSum();
  const router = useRouter();
  return (
    <UploadScreen
      selectedDocument={selectedDocument}
      onSelectDocument={setSelectedDocument}
      onClearDocument={() => setSelectedDocument(null)}
      onContinue={() => {
        router.push("/process");
      }}
    />
  );
}
