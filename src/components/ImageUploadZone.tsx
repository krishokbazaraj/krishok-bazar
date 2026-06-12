import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, Check, AlertTriangle, Image as ImageIcon, RotateCw, ZoomIn, ZoomOut, RefreshCw, Scissors } from 'lucide-react';
import { compressAndConvertToBase64 } from '../lib/imageCompressor';

interface ImageCropperModalProps {
  imageSrc: string;
  onConfirm: (croppedBase64: string) => void;
  onCancel: () => void;
}

export function ImageCropperModal({ imageSrc, onConfirm, onCancel }: ImageCropperModalProps) {
  const [zoom, setZoom] = useState(1.0);
  const [rotation, setRotation] = useState(0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  // Reset parameters when image source changes
  useEffect(() => {
    setZoom(1.0);
    setRotation(0);
    setOffset({ x: 0, y: 0 });
  }, [imageSrc]);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - offset.x,
      y: e.clientY - offset.y
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const handleReset = () => {
    setZoom(1.0);
    setRotation(0);
    setOffset({ x: 0, y: 0 });
  };

  const handleCropSave = () => {
    const imgObj = new Image();
    imgObj.src = imageSrc;
    imgObj.onload = () => {
      const canvas = document.createElement('canvas');
      const targetSize = 600; // Output premium high-quality square format
      canvas.width = targetSize;
      canvas.height = targetSize;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Fill white background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, targetSize, targetSize);

      ctx.save();
      // Translate to middle
      ctx.translate(targetSize / 2, targetSize / 2);
      ctx.rotate((rotation * Math.PI) / 180);

      // Reference dimension viewport = 288 (w-72 in Tailwind)
      const viewportSize = 288;
      
      const originalW = imgObj.naturalWidth || imgObj.width || 1;
      const originalH = imgObj.naturalHeight || imgObj.height || 1;
      
      const fitRatio = Math.min(viewportSize / originalW, viewportSize / originalH);
      const baseWidth = originalW * fitRatio;
      const baseHeight = originalH * fitRatio;

      const conversionFactor = targetSize / viewportSize;

      // Scaled dimensions on target canvas
      const drawWidth = baseWidth * zoom * conversionFactor;
      const drawHeight = baseHeight * zoom * conversionFactor;

      // Offsets on target canvas
      const targetOffsetX = offset.x * conversionFactor;
      const targetOffsetY = offset.y * conversionFactor;

      ctx.translate(targetOffsetX, targetOffsetY);

      ctx.drawImage(
        imgObj,
        -drawWidth / 2,
        -drawHeight / 2,
        drawWidth,
        drawHeight
      );

      ctx.restore();

      try {
        const croppedBase64 = canvas.toDataURL('image/jpeg', 0.82);
        onConfirm(croppedBase64);
      } catch (err) {
        console.error('Error generating cropped image:', err);
        alert('ক্রপ করা সম্ভব হয়নি। আবার চেষ্টা করুন।');
      }
    };
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-stone-900/80 backdrop-blur-md p-4 select-none animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden border border-stone-200 shadow-2xl flex flex-col scale-in-gentle">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 p-4 text-white text-left flex justify-between items-center">
          <div>
            <h3 className="font-serif font-black text-xs flex items-center gap-1.5">
              <Scissors size={14} className="text-amber-400 animate-pulse" />
              <span>ছবি ক্রপ ও রিসাইজ (Crop & Align)</span>
            </h3>
            <p className="text-[10px] text-emerald-100 opacity-90 mt-0.5">ছবিটি নিখুঁতভাবে বসানোর জন্য প্যান ও জুম করুন</p>
          </div>
          <button 
            type="button" 
            onClick={onCancel}
            className="p-1 px-2 text-white bg-white/10 hover:bg-white/20 rounded-md text-[10px] font-bold transition-colors"
          >
            বাতিল
          </button>
        </div>

        {/* Workspace */}
        <div className="p-6 flex flex-col items-center justify-center bg-stone-50 space-y-4">
          {/* Viewport Box */}
          <div 
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className="relative w-72 h-72 rounded-2xl overflow-hidden bg-stone-950 border border-stone-200 cursor-move touch-none flex items-center justify-center shadow-inner"
          >
            <img
              src={imageSrc}
              alt="Cropper preview"
              className="max-w-full max-h-full transition-none select-none pointer-events-none"
              style={{
                transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom}) rotate(${rotation}deg)`,
                transformOrigin: 'center center',
              }}
            />

            {/* Grid overlay */}
            <div className="absolute inset-0 pointer-events-none border-2 border-dashed border-emerald-500/40 rounded-2xl m-3 flex flex-col justify-between">
              <div className="h-1/3 border-b border-dashed border-emerald-500/20" />
              <div className="h-1/3 border-b border-dashed border-emerald-500/20" />
            </div>
            
            <div className="absolute inset-0 pointer-events-none m-3 flex justify-between">
              <div className="w-1/3 border-r border-dashed border-emerald-500/20" />
              <div className="w-1/3 border-r border-dashed border-emerald-500/20" />
            </div>

            {/* Mask borders */}
            <div className="absolute -inset-1 pointer-events-none border-[36px] border-stone-950/40 rounded-2xl" />
          </div>

          {/* Slider and Buttons Row */}
          <div className="w-full space-y-3 px-1">
            {/* Zoom Slider */}
            <div className="flex items-center gap-2">
              <button 
                type="button"
                onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}
                className="p-1 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded transition"
              >
                <ZoomOut size={12} />
              </button>
              <input
                type="range"
                min="0.5"
                max="3.0"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-800"
              />
              <button 
                type="button"
                className="p-1 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded transition"
                onClick={() => setZoom(z => Math.min(3.0, z + 0.1))}
              >
                <ZoomIn size={12} />
              </button>
            </div>

            {/* Rotation & Reset Row */}
            <div className="flex gap-2 justify-center">
              <button
                type="button"
                onClick={() => setRotation(r => (r + 90) % 360)}
                className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl text-[10px] font-extrabold transition"
              >
                <RotateCw size={11} />
                <span>ঘোরান (90°)</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1 px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-605 border border-stone-300 rounded-xl text-[10px] font-extrabold transition"
              >
                <RefreshCw size={11} />
                <span>রিসেট করুন</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-stone-100 flex gap-3 bg-white">
          <button
            type="button"
            className="w-1/2 py-2 bg-stone-100 hover:bg-stone-200 rounded-xl text-stone-700 font-bold text-xs transition"
            onClick={onCancel}
          >
            বাতিল
          </button>
          <button
            type="button"
            className="w-1/2 py-2 bg-emerald-800 hover:bg-emerald-950 rounded-xl text-white font-black text-xs transition flex items-center justify-center gap-1 shadow-xs"
            onClick={handleCropSave}
          >
            <Check size={12} />
            <span>নিশ্চিত করুন</span>
          </button>
        </div>
      </div>
    </div>
  );
}

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
  const [tempImageForCrop, setTempImageForCrop] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPreview(initialImage);
  }, [initialImage]);

  const processFile = async (file: File) => {
    if (!file) return;
    
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`ফাইলের সাইজ অনেক বড়! সর্বোচ্চ ${maxSizeMB}MB ফাইল এলাউড।`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setTempImageForCrop(reader.result);
        }
        setLoading(false);
      };
      reader.onerror = () => {
        setError('ফাইল পড়তে সমস্যা হয়েছে।');
        setLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setError(err?.message || 'ছবি লোড করতে ব্যর্থ হয়েছে।');
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
              : 'border-stone-200 bg-stone-50/30 hover:border-emerald-700 hover:bg-stone-55/70'
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

      {tempImageForCrop && (
        <ImageCropperModal
          imageSrc={tempImageForCrop}
          onConfirm={(croppedBase64) => {
            setPreview(croppedBase64);
            onImageUploaded(croppedBase64);
            setTempImageForCrop(null);
          }}
          onCancel={() => {
            setTempImageForCrop(null);
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
          }}
        />
      )}
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
  const [tempImageForCrop, setTempImageForCrop] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setImages(initialImages);
  }, [initialImages]);

  const processFile = async (file: File) => {
    if (!file || images.length >= maxImages) return;
    setLoading(true);
    try {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setTempImageForCrop(reader.result);
        }
        setLoading(false);
      };
      reader.onerror = () => {
        alert('ফাইল পড়তে ব্যর্থ হয়েছে।');
        setLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      alert('ছবি আপলোড করতে ব্যর্থ হয়েছে।');
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

      {tempImageForCrop && (
        <ImageCropperModal
          imageSrc={tempImageForCrop}
          onConfirm={(croppedBase64) => {
            const nextImages = [...images, croppedBase64];
            setImages(nextImages);
            onImagesChanged(nextImages);
            setTempImageForCrop(null);
          }}
          onCancel={() => {
            setTempImageForCrop(null);
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
          }}
        />
      )}
    </div>
  );
}
