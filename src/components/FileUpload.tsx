import React from 'react';
import { Upload, File } from 'lucide-react';

type FileUploadProps = {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileName: string | null;
  dragActive: boolean;
};

export default function FileUpload({ onFileChange, fileName, dragActive }: FileUploadProps) {
  return (
    <div className={`
      border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
      ${dragActive 
        ? 'border-blue-500 bg-blue-50' 
        : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
      }
    `}>
      <input
        type="file"
        onChange={onFileChange}
        className="hidden"
        id="fileInput"
        accept=".txt,.json,.csv,.jpg,.jpeg,.png,.pdf,.doc,.docx,.mp4,.mp3"
      />
      <label
        htmlFor="fileInput"
        className="cursor-pointer flex flex-col items-center space-y-4"
      >
        {fileName ? (
          <>
            <File className="w-12 h-12 text-blue-500" />
            <span className="text-blue-600 font-medium">{fileName}</span>
          </>
        ) : (
          <>
            <Upload className="w-12 h-12 text-blue-500" />
            <div className="space-y-2">
              <span className="text-gray-600 block">
                {dragActive ? 'Drop your file here' : 'Click to upload or drag and drop'}
              </span>
              <span className="text-gray-400 text-sm block">
                Supports TXT, JSON, CSV, JPEG, PNG, PDF, DOC, DOCX, MP4, MP3
              </span>
            </div>
          </>
        )}
      </label>
    </div>
  );
}