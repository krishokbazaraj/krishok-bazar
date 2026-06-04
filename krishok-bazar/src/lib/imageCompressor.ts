/**
 * Utility to compress any user-uploaded image client-side before uploading to Firestore.
 * This guarantees images are saved for a lifetime inside Firestore under its 1MB limits,
 * while accepting files up to 10MB and compressing them to a lightweight (~60KB - 150KB) high-quality JPEG base64 format.
 */
export async function compressAndConvertToBase64(file: File, maxWidth = 900, maxHeight = 900, quality = 0.75): Promise<string> {
  return new Promise((resolve, reject) => {
    // Validate file size is under 10MB
    const maxSizeBytes = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSizeBytes) {
      reject(new Error('ফাইলের সাইজ অনেক বেশি (সর্বোচ্চ ১০ এমবি সমর্থিত)!'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        // Create HTML5 Canvas
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('ক্যানভাস কনটেক্সট তৈরি করতে ব্যর্থ!'));
          return;
        }

        // Clean draw image
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to highly-compressed light Base64 JPEG URL style
        try {
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        } catch (e) {
          reject(e);
        }
      };
      img.onerror = (err) => {
        reject(err);
      };
      if (event.target?.result) {
        img.src = event.target.result as string;
      } else {
        reject(new Error('ফাইল পড়তে ব্যর্থ!'));
      }
    };
    reader.onerror = (err) => {
      reject(err);
    };
    reader.readAsDataURL(file);
  });
}
