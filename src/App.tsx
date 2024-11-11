import React from 'react';
import FileConverter from './components/FileConverter';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <FileConverter />
    </ErrorBoundary>
  );
}

export default App;