import React from 'react';
import { FileDown, ArrowRight } from 'lucide-react';
import type { ConversionType } from '../types/conversion';
import { SUPPORTED_CONVERSIONS } from '../types/conversion';

type ConversionOptionsProps = {
  fileType: string;
  conversion: ConversionType | null;
  onConversionChange: (conversion: ConversionType) => void;
  onConvert: () => void;
  loading: boolean;
};

export default function ConversionOptions({
  fileType,
  conversion,
  onConversionChange,
  onConvert,
  loading,
}: ConversionOptionsProps) {
  const availableConversions = SUPPORTED_CONVERSIONS.filter(conv => conv.from === fileType);

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 rounded-lg gap-4">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-600">From:</span>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
            {fileType || 'Unknown type'}
          </span>
        </div>
        
        <ArrowRight className="hidden md:block w-5 h-5 text-gray-400" />
        
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-600">To:</span>
          <select
            className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={conversion?.to}
            onChange={(e) => onConversionChange({ from: fileType, to: e.target.value })}
          >
            {availableConversions.length > 0 ? (
              availableConversions.map(conv => (
                <option key={conv.to} value={conv.to}>
                  {conv.to}
                </option>
              ))
            ) : (
              <option value="">No conversions available</option>
            )}
          </select>
        </div>
      </div>

      <button
        onClick={onConvert}
        disabled={loading || availableConversions.length === 0}
        className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Converting...</span>
          </div>
        ) : (
          <>
            <span>Convert File</span>
            <FileDown className="w-5 h-5" />
          </>
        )}
      </button>
    </div>
  );
}