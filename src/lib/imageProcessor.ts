/**
 * Utility for client-side image preprocessing and normalization
 * - Normalizes orientation
 * - Resizes overly large dimensions to prevent payload bloat while maintaining fine label text sharpness
 * - Preserves aspect ratio with high JPEG quality (0.92)
 */

export interface ProcessedImageResult {
  base64: string;
  mimeType: string;
  width: number;
  height: number;
}

export async function preprocessImage(
  fileOrBlob: File | Blob | string,
  maxDimension = 2048
): Promise<ProcessedImageResult> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    const cleanUpUrl = (url: string) => {
      if (url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    };

    let objectUrl = '';
    if (typeof fileOrBlob === 'string') {
      img.src = fileOrBlob;
    } else {
      objectUrl = URL.createObjectURL(fileOrBlob);
      img.src = objectUrl;
    }

    img.onload = () => {
      try {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        // Calculate scaled dimensions if larger than maxDimension
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) {
          throw new Error('Failed to get 2D canvas context for image preprocessing');
        }

        // Draw image (modern browsers automatically respect EXIF orientation on <img>)
        ctx.drawImage(img, 0, 0, width, height);

        // Export high-quality JPEG base64 data
        const mimeType = 'image/jpeg';
        const dataUrl = canvas.toDataURL(mimeType, 0.92);
        const base64 = dataUrl.replace(/^data:image\/[a-zA-Z0-9+]+;base64,/, '');

        if (objectUrl) cleanUpUrl(objectUrl);

        resolve({
          base64,
          mimeType,
          width,
          height,
        });
      } catch (err) {
        if (objectUrl) cleanUpUrl(objectUrl);
        reject(err);
      }
    };

    img.onerror = (e) => {
      if (objectUrl) cleanUpUrl(objectUrl);
      reject(new Error(`Failed to load image for preprocessing: ${e}`));
    };
  });
}
