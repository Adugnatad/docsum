import React from 'react';
import { useDocSum } from '../src/context/DocSumContext';
import { HistoryScreen } from '../src/components/HistoryScreen';

export default function HistoryRoute() {
  const {
    history,
    setCurrentSummary,
    setActiveTab,
    clearHistory,
    deleteSummaryItem,
  } = useDocSum();

  return (
    <HistoryScreen
      history={history}
      onSelectSummary={(sum) => {
        setCurrentSummary(sum);
        setActiveTab('summary');
      }}
      onClearHistory={clearHistory}
      onDeleteSummary={deleteSummaryItem}
    />
  );
}
