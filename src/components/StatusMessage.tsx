import React from 'react';
import { AlertCircle, CheckCircle2, FileDown } from 'lucide-react';

type StatusMessageProps = {
  error: string | null;
  success: boolean;
  onDownload?: () => void;
};

export default function StatusMessage({ error, success, onDownload }: StatusMessageProps) {
  if (error) {
    return (
      <div className="flex items-center space-x-3 text-red-600 bg-red-50 p-4 rounded-lg animate-fadeIn">
        <AlertCircle className="w-5 h-5 flex-shrink-0" />
        <span className="text-sm">{error}</span>
      </div>
    );
  }

  if (success) {
    return (
      <div className="space-y-4 animate-fadeIn">
        <div className="flex items-center space-x-3 text-green-600 bg-green-50 p-4 rounded-lg">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">Conversion successful!</span>
        </div>
        {onDownload && (
          <button
            onClick={onDownload}
            className="w-full py-3 px-6 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <span>Download Converted File</span>
            <FileDown className="w-5 h-5" />
          </button>
        )}
      </div>
    );
  }

  return null;
}