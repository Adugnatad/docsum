import React from 'react';
import { useDocSum } from '../src/context/DocSumContext';
import { UploadScreen } from '../src/components/UploadScreen';

export default function UploadRoute() {
  const { selectedDocument, setSelectedDocument, setActiveTab } = useDocSum();

  return (
    <UploadScreen
      selectedDocument={selectedDocument}
      onSelectDocument={setSelectedDocument}
      onClearDocument={() => setSelectedDocument(null)}
      onContinue={() => setActiveTab('process')}
    />
  );
}
