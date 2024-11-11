export async function convertFile(file: File, fromType: string, toType: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        let result = '';
        
        if (fromType === 'text/plain' && toType === 'application/json') {
          const lines = (e.target?.result as string).split('\n');
          result = JSON.stringify(lines, null, 2);
        } else if (fromType === 'application/json' && toType === 'text/plain') {
          const json = JSON.parse(e.target?.result as string);
          result = Array.isArray(json) ? json.join('\n') : JSON.stringify(json, null, 2);
        } else if (fromType === 'text/plain' && toType === 'text/csv') {
          const lines = (e.target?.result as string).split('\n');
          result = lines.map(line => `"${line.replace(/"/g, '""')}"`).join(',\n');
        } else if (fromType === 'text/csv' && toType === 'application/json') {
          const lines = (e.target?.result as string).split('\n');
          result = JSON.stringify(lines.map(line => line.split(',')), null, 2);
        } else if (fromType.startsWith('image/')) {
          const img = new Image();
          img.src = e.target?.result as string;
          await new Promise(resolve => img.onload = resolve);
          
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0);
          
          result = canvas.toDataURL(toType);
        }
        
        resolve(result);
      } catch (err) {
        reject(new Error('Conversion failed. Please check your file format.'));
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    
    if (fromType.startsWith('image/')) {
      reader.readAsDataURL(file);
    } else {
      reader.readAsText(file);
    }
  });
}