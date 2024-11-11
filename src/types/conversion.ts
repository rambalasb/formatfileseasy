export type ConversionType = {
  from: string;
  to: string;
  label: string;
  icon?: string;
  description?: string;
};

export const SUPPORTED_CONVERSIONS: ConversionType[] = [
  // Document conversions
  {
    from: 'application/pdf',
    to: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    label: 'PDF to DOCX',
    icon: 'file-text',
    description: 'Convert PDF files to editable Word documents'
  },
  {
    from: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    to: 'application/pdf',
    label: 'DOCX to PDF',
    icon: 'file-text',
    description: 'Convert Word documents to PDF format'
  },
  
  // Image conversions
  {
    from: 'image/jpeg',
    to: 'image/png',
    label: 'JPEG to PNG',
    icon: 'image',
    description: 'Convert JPEG images to PNG format'
  },
  {
    from: 'image/png',
    to: 'image/jpeg',
    label: 'PNG to JPEG',
    icon: 'image',
    description: 'Convert PNG images to JPEG format'
  },
  {
    from: 'image/jpeg',
    to: 'image/webp',
    label: 'JPEG to WebP',
    icon: 'image',
    description: 'Convert JPEG images to WebP format for better compression'
  },
  
  // Media conversions
  {
    from: 'video/mp4',
    to: 'audio/mpeg',
    label: 'MP4 to MP3',
    icon: 'music',
    description: 'Extract audio from MP4 videos'
  },
  {
    from: 'audio/mpeg',
    to: 'audio/wav',
    label: 'MP3 to WAV',
    icon: 'music',
    description: 'Convert MP3 audio to WAV format'
  },
  {
    from: 'video/mp4',
    to: 'video/webm',
    label: 'MP4 to WebM',
    icon: 'video',
    description: 'Convert MP4 videos to WebM format'
  },
  
  // OCR
  {
    from: 'image/jpeg',
    to: 'text/plain',
    label: 'Image to Text (OCR)',
    icon: 'type',
    description: 'Extract text from images using OCR'
  }
];