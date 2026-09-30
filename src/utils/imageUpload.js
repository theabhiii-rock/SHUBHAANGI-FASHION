/**
 * Client-Side Image Compression & Gallery Upload Utility
 * Compresses camera and gallery photos to high-definition Web-ready JPEG
 * ensuring bridal fashion fabrics & embroidery stay crisp while keeping
 * storage lightweight.
 */

export function compressImageFile(file, maxWidth = 1200, quality = 0.84) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided'));
      return;
    }

    if (!file.type.startsWith('image/')) {
      reject(new Error('Selected file is not an image'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Scale down proportionally if larger than maxWidth
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Failed to parse image data'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Failed to read image file from device'));
    reader.readAsDataURL(file);
  });
}
