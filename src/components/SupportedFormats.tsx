import React from 'react';
import { SUPPORTED_CONVERSIONS } from '../types/conversion';
import { ArrowRight } from 'lucide-react';

export default function SupportedFormats() {
  return (
    <div className="mt-8 bg-white rounded-2xl shadow-xl p-6 md:p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Supported Conversions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SUPPORTED_CONVERSIONS.map((conv, index) => (
          <div 
            key={index} 
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm min-w-[100px] text-center">
              {conv.from.split('/')[1].toUpperCase()}
            </span>
            <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm min-w-[100px] text-center">
              {conv.to.split('/')[1].toUpperCase()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}