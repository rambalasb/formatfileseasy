import React, { useState, useCallback, useRef } from 'react';
import { ConversionType } from '../types/conversion';
import { convertFile } from '../utils/fileConversion';
import FileUpload from './FileUpload';
import ConversionOptions from './ConversionOptions';
import StatusMessage from './StatusMessage';
import SupportedFormats from './SupportedFormats';
import { FileType, Settings2 } from 'lucide-react';
import { FileConverter } from '../utils/converters';
import ProgressBar from './ProgressBar';

export default function FileConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [convertedData, setConvertedData] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [conversion, setConversion] = useState<ConversionType | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const workerRef = useRef<Worker | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile = e.dataTransfer?.files[0];
    if (droppedFile) {
      handleFileSelection(droppedFile);
    }
  }, []);

  const handleFileSelection = (selectedFile: File) => {
    setFile(selectedFile);
    setError(null);
    setConvertedData(null);
    setConversion({ from: selectedFile.type || 'text/plain', to: selectedFile.type || 'text/plain' });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelection(selectedFile);
    }
  };

  const handleConvert = useCallback(async () => {
    if (!file || !conversion) return;

    try {
      setLoading(true);
      setError(null);
      setProgress(0);

      if (!workerRef.current) {
        workerRef.current = new Worker(
          new URL('../workers/conversionWorker.ts', import.meta.url),
          { type: 'module' }
        );
      }

      const worker = workerRef.current;
      const conversionId = Date.now().toString();

      return new Promise((resolve, reject) => {
        worker.onmessage = (e) => {
          const { type, progress, result, error, id } = e.data;
          if (id !== conversionId) return;

          switch (type) {
            case 'progress':
              setProgress(progress);
              break;
            case 'complete':
              setConvertedData(result);
              resolve(result);
              break;
            case 'error':
              reject(new Error(error));
              break;
          }
        };

        worker.postMessage({
          file,
          fromType: conversion.from,
          toType: conversion.to,
          id: conversionId
        });
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion failed');
    } finally {
      setLoading(false);
    }
  }, [file, conversion]);

  const handleDownload = () => {
    if (!convertedData || !conversion) return;
    
    const blob = new Blob([convertedData], { type: conversion.to });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `converted-file.${conversion.to.split('/')[1]}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <FileType className="w-12 h-12 text-blue-600 mr-4" />
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Universal File Converter</h1>
            </div>
            <div className="flex items-center justify-center text-gray-600">
              <Settings2 className="w-5 h-5 mr-2" />
              <p>Convert between various file formats with ease</p>
            </div>
          </div>

          <div className="space-y-8"
               onDragEnter={handleDrag}
               onDragLeave={handleDrag}
               onDragOver={handleDrag}
               onDrop={handleDrop}>
            <FileUpload 
              onFileChange={handleFileChange}
              fileName={file?.name || null}
              dragActive={dragActive}
            />

            {file && !error && (
              <ConversionOptions
                fileType={file.type || 'text/plain'}
                conversion={conversion}
                onConversionChange={setConversion}
                onConvert={handleConvert}
                loading={loading}
              />
            )}

            {loading && (
              <ProgressBar 
                progress={progress}
                status={`Converting ${file?.name}...`}
              />
            )}

            <StatusMessage
              error={error}
              success={!!convertedData}
              onDownload={convertedData ? handleDownload : undefined}
            />
          </div>
        </div>

        <SupportedFormats />

        <footer className="mt-8 text-center text-gray-600 text-sm">
          <p>Supported file types: Plain Text, JSON, CSV, JPEG, PNG, WebP</p>
        </footer>
      </div>
    </div>
  );
}