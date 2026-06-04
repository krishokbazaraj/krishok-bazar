import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [dots, setDots] = useState('');

  useEffect(() => {
    // 3 seconds timer for splash
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);

    const interval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
    }, 400);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[9999] bg-[#FFFFFF] flex flex-col items-center justify-between py-12 px-6 overflow-hidden">
      {/* Light leaf illustration background (extremely subtle particle/leaf bg) */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none select-none">
        <svg xmlns="http://www.w3.org/2000/svg" className="absolute top-10 left-10 w-48 h-48 rotate-45 text-[#4CAF50]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" className="absolute bottom-10 right-10 w-64 h-64 -rotate-12 text-[#4CAF50]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h2a2.5 2.5 0 002.5-2.5V3a2 2 0 00-2-2h-3.07a2 2 0 00-1.41.586l-2.086 2.086a2 2 0 01-1.414.586H8.5a2 2 0 00-2 2z" />
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" className="absolute top-1/3 right-1/4 w-32 h-32 opacity-30 text-[#4CAF50]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </div>

      <div /> {/* Spacer */}

      <div className="flex flex-col items-center max-w-lg text-center">
        {/* Animated logo wrapper: soft fade-in + slight zoom (scale 0.95 to 1) over 0.8 seconds */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative w-48 h-48 md:w-56 md:h-56 mb-8 drop-shadow-md flex items-center justify-center bg-white rounded-full p-2 border border-stone-100"
        >
          {/* Subtle leaf glow rings */}
          <div className="absolute inset-0 rounded-full bg-[#4CAF50]/10 animate-ping opacity-75" />
          <img 
            src="https://cdn.shopify.com/s/files/1/0991/0717/6761/files/Gemini_Generated_Image_k0x5bek0x5bek0x5.png" 
            alt="Krishok Bazar Logo" 
            className="w-full h-full object-contain rounded-full"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        {/* Text Area */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="space-y-3"
        >
          <h1 className="text-[1.2rem] md:text-2xl font-bold text-[#1B5E20] font-sans">
            দালাল মুক্ত কৃষি বাজার
          </h1>
          <p className="text-[0.9rem] text-[#4CAF50] font-medium">
            মাঠের তাজা সবজি সরাসরি আপনার রান্নাঘরে
          </p>
        </motion.div>
      </div>

      {/* Loading section with spinning leaf and dots */}
      <div className="flex flex-col items-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#4CAF50] animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1 8.8C19 15.5 15.5 20 11 20z" />
          <path d="M19 2c-2.26 4.33-5.27 7.14-8 10" />
        </svg>
        <p className="text-xs text-stone-400 font-bold tracking-wider">লোড হচ্ছে{dots}</p>
      </div>
    </div>
  );
}
