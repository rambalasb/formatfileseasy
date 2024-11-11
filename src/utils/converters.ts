import { PDFDocument } from 'pdf-lib';
import { FFmpeg } from '@ffmpeg/ffmpeg';

export class FileConverter {
  private static ffmpeg: FFmpeg | null = null;

  private static async initFFmpeg() {
    if (!this.ffmpeg) {
      this.ffmpeg = new FFmpeg();
      await this.ffmpeg.load();
    }
    return this.ffmpeg;
  }

  static async convertFile(file: File, fromType: string, toType: string): Promise<Blob> {
    switch (`${fromType}->${toType}`) {
      case 'image/jpeg->image/png':
      case 'image/png->image/jpeg':
        return await this.convertImage(file, toType);
      
      case 'image/jpeg->application/pdf':
      case 'image/png->application/pdf':
        return await this.imageToPdf(file);
      
      case 'video/mp4->audio/mpeg':
        return await this.mp4ToMp3(file);
      
      case 'application/pdf->application/msword':
      case 'application/msword->application/pdf':
        return await this.convertDocument(file, fromType, toType);
      
      default:
        throw new Error('Unsupported conversion');
    }
  }

  private static async convertImage(file: File, toType: string): Promise<Blob> {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    return new Promise((resolve, reject) => {
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        canvas.toBlob(blob => {
          if (blob) resolve(blob);
          else reject(new Error('Image conversion failed'));
        }, toType);
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }

  private static async imageToPdf(file: File): Promise<Blob> {
    const pdfDoc = await PDFDocument.create();
    const img = await this.fileToImageData(file);
    const page = pdfDoc.addPage([img.width, img.height]);
    
    if (file.type === 'image/jpeg') {
      const jpegImage = await pdfDoc.embedJpg(await file.arrayBuffer());
      page.drawImage(jpegImage);
    } else {
      const pngImage = await pdfDoc.embedPng(await file.arrayBuffer());
      page.drawImage(pngImage);
    }
    
    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes], { type: 'application/pdf' });
  }

  private static async mp4ToMp3(file: File): Promise<Blob> {
    const ffmpeg = await this.initFFmpeg();
    const inputName = 'input.mp4';
    const outputName = 'output.mp3';
    
    ffmpeg.FS('writeFile', inputName, await file.arrayBuffer());
    await ffmpeg.run('-i', inputName, '-vn', '-acodec', 'libmp3lame', outputName);
    
    const data = ffmpeg.FS('readFile', outputName);
    return new Blob([data.buffer], { type: 'audio/mpeg' });
  }

  private static async fileToImageData(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.width, height: img.height });
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }
} 