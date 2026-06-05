import React, { useState, useRef } from 'react';
import { Upload, X, Check, AlertTriangle, Image as ImageIcon } from 'lucide-react';
import { compressAndConvertToBase64 } from '../lib/imageCompressor';

interface ImageUploadZoneProps {
  onImageUploaded: (base64: string) => void;
  label?: string;
  initialImage?: string;
  maxSizeMB?: number;
}

export function ImageUploadZone({
  onImageUploaded,
  label = 'ছবি সিলেক্ট অথবা ড্র্যাগ করুন (সর্বোচ্চ ৫ এমবি)',
  initialImage = '',
  maxSizeMB = 5
}: ImageUploadZoneProps) {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string>(initialImage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    if (!file) return;
    
    // Check local restriction
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`ফাইলের সাইজ অনেক বড়! সর্বোচ্চ ${maxSizeMB}MB ফাইল এলাউড।`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Compress and convert to lightweight JPEG base64 of ~60-120KB
      const base64Str = await compressAndConvertToBase64(file, 850, 850, 0.72);
      setPreview(base64Str);
      onImageUploaded(base64Str);
    } catch (err: any) {
      setError(err?.message || 'ছবি প্রসেস করতে ব্যর্থ হয়েছে।');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      await processFile(e.target.files[0]);
    }
  };

  const clearImage = () => {
    setPreview('');
    onImageUploaded('');
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-1.5 w-full text-left">
      {label && <label className="text-[10px] font-bold text-stone-500 block">{label}</label>}
      
      <div 
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative rounded-2xl border-2 border-dashed p-4 flex flex-col items-center justify-center text-center cursor-pointer min-h-[140px] transition-all overflow-hidden ${
          dragActive 
            ? 'border-emerald-600 bg-emerald-50/50' 
            : preview 
              ? 'border-stone-300 bg-stone-50/10 hover:bg-stone-55/20' 
              : 'border-stone-200 bg-stone-50/30 hover:border-emerald-700 hover:bg-stone-50/70'
        }`}
      >
        <input 
          ref={fileInputRef}
          type="file" 
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />

        {preview ? (
          <div className="w-full h-full flex flex-col items-center justify-center space-y-2 relative group">
            <img 
              src={preview} 
              alt="Uploaded preview" 
              className="max-h-24 object-cover rounded-xl shadow-xs border bg-white"
            />
            <div className="flex items-center gap-1 bg-emerald-50 text-emerald-800 text-[9px] font-black tracking-wide px-2 py-0.5 rounded border border-emerald-100 uppercase animate-pulse">
              <Check size={10} /> অটো-কমপ্রেসড ও রেডি
            </div>
            
            {/* Clear Image Hover Button */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                clearImage();
              }}
              className="absolute top-0 right-0 bg-red-650 hover:bg-red-700 text-white rounded-full p-1 shadow-md transition"
              title="মুছে ফেলুন"
            >
              <X size={12} />
            </button>
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center space-y-2 py-3">
            <div className="w-6 h-6 border-2 border-t-transparent border-emerald-800 rounded-full animate-spin" />
            <p className="text-[10px] font-bold text-stone-400">ছবি প্রসেসিং ও কমপ্রেস করা হচ্ছে...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2 py-3 text-stone-400 font-medium">
            <div className="bg-stone-105 border p-2 rounded-full text-stone-450 hover:text-emerald-700 hover:border-emerald-700/50 transition">
              <Upload size={18} />
            </div>
            <div className="space-y-0.5 text-center">
              <p className="text-[11px] font-bold text-stone-600">ডিভাইস থেকে সরাসরি ফটো আপলোড করুন</p>
              <p className="text-[9px] text-stone-400">ট্যাপ করুন বা এখানে ড্র্যাগ এন্ড ড্রপ করুন</p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute bottom-2 left-2 right-2 bg-red-50 text-red-700 p-1.5 rounded-lg border border-red-150 flex items-center gap-1 text-[9px] font-bold leading-none animate-bounce">
            <AlertTriangle size={10} className="shrink-0" />
            <span className="line-clamp-1">{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// Support multiple images helper
interface MultiImageUploadProps {
  onImagesChanged: (images: string[]) => void;
  initialImages?: string[];
  maxImages?: number;
  label?: string;
}

export function MultiImageUploadZone({
  onImagesChanged,
  initialImages = [],
  maxImages = 4,
  label = 'অতিরিক্ত গ্যালারি ছবিসমূহ যুক্ত করুন (ধাপে ধাপে সর্বোচ্চ ৪টি)'
}: MultiImageUploadProps) {
  const [images, setImages] = useState<string[]>(initialImages);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    if (!file || images.length >= maxImages) return;
    setLoading(true);
    try {
      const base64Str = await compressAndConvertToBase64(file, 800, 800, 0.73);
      const nextImages = [...images, base64Str];
      setImages(nextImages);
      onImagesChanged(nextImages);
    } catch (err) {
      console.error(err);
      alert('ছবি আপলোড করতে ব্যর্থ হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  const removeImageAt = (idx: number) => {
    const nextImages = images.filter((_, i) => i !== idx);
    setImages(nextImages);
    onImagesChanged(nextImages);
  };

  return (
    <div className="space-y-2 w-full text-left">
      {label && <label className="text-[10px] font-bold text-stone-500 block">{label}</label>}
      <div className="flex flex-wrap gap-2.5">
        {images.map((img, idx) => (
          <div key={idx} className="relative w-16 h-16 rounded-xl border overflow-hidden bg-white group shadow-2xs">
            <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removeImageAt(idx)}
              className="absolute top-1 right-1 bg-red-650 hover:bg-red-700 text-white rounded-full p-0.5 transition hover:scale-110 shadow"
            >
              <X size={10} />
            </button>
          </div>
        ))}

        {images.length < maxImages && (
          <button
            type="button"
            disabled={loading}
            onClick={() => fileInputRef.current?.click()}
            className="w-16 h-16 rounded-xl border-2 border-dashed border-stone-200 bg-stone-50/50 hover:border-emerald-700 hover:bg-stone-50 flex flex-col items-center justify-center text-stone-400 group cursor-pointer transition"
          >
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                if (e.target.files && e.target.files[0]) {
                  await processFile(e.target.files[0]);
                  e.target.value = '';
                }
              }}
            />
            {loading ? (
              <div className="w-4 h-4 border-2 border-t-transparent border-emerald-800 rounded-full animate-spin" />
            ) : (
              <>
                <ImageIcon size={14} className="group-hover:text-emerald-700 transition" />
                <span className="text-[8px] font-bold mt-0.5">যুক্ত করুন</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
