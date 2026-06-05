/**
 * FarmerDashboard — Full Standalone Page Component
 * কৃষক বাজার — কৃষক ড্যাশবোর্ড
 * Features: Video section, Supabase photo upload, stats, products CRUD, real-time orders,
 *           real-time WhatsApp notifications via Firestore onSnapshot + Browser Notification API
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BarChart2, ShoppingBag, Leaf, Video, User, Plus, Trash2,
  Edit, Check, X, Upload, Loader2, Youtube, Camera, Star,
  TrendingUp, Package, Phone, AlertTriangle, ChevronRight,
  PlayCircle, Image as ImageIcon, Save, RefreshCw, Eye,
  CheckCircle, Clock, Truck, Bell, BellRing, MessageCircle
} from 'lucide-react';
import { collection, onSnapshot, doc, setDoc, deleteDoc, updateDoc, query, where } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import { supabase, uploadImageToSupabase } from '../supabase';
import type { Farmer, Product, Order, CartItem } from '../types';

const LOGO = 'https://cdn.shopify.com/s/files/1/0991/0717/6761/files/Gemini_Generated_Image_k0x5bek0x5bek0x5.png';

// ── YouTube URL → embed URL converter ─────────────────────────
function getYouTubeEmbedUrl(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  // Already embed
  if (trimmed.includes('youtube.com/embed/')) return trimmed;
  // Raw ID (no dots/slashes)
  if (!trimmed.includes('/') && !trimmed.includes('.') && !trimmed.includes('?')) {
    return `https://www.youtube.com/embed/${trimmed}?rel=0&controls=1`;
  }
  // Shorts
  if (trimmed.includes('youtube.com/shorts/')) {
    const id = trimmed.split('youtube.com/shorts/')[1]?.split('?')[0];
    if (id) return `https://www.youtube.com/embed/${id}?rel=0&controls=1`;
  }
  // Standard watch
  if (trimmed.includes('youtube.com/watch')) {
    const id = new URLSearchParams(trimmed.split('?')[1]).get('v');
    if (id) return `https://www.youtube.com/embed/${id}?rel=0&controls=1`;
  }
  // youtu.be
  if (trimmed.includes('youtu.be/')) {
    const id = trimmed.split('youtu.be/')[1]?.split('?')[0];
    if (id) return `https://www.youtube.com/embed/${id}?rel=0&controls=1`;
  }
  return trimmed;
}

// ── Status badge helper ───────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string; icon: React.ReactNode }> = {
    pending:          { label: 'পেন্ডিং', cls: 'bg-amber-100 text-amber-800', icon: <Clock size={10} /> },
    confirmed:        { label: 'নিশ্চিত', cls: 'bg-blue-100 text-blue-800', icon: <CheckCircle size={10} /> },
    packed:           { label: 'প্যাক করা', cls: 'bg-purple-100 text-purple-800', icon: <Package size={10} /> },
    shipped:          { label: 'শিপড', cls: 'bg-indigo-100 text-indigo-800', icon: <Truck size={10} /> },
    out_for_delivery: { label: 'ডেলিভারিতে', cls: 'bg-orange-100 text-orange-800', icon: <Truck size={10} /> },
    delivered:        { label: 'ডেলিভারি সম্পন্ন', cls: 'bg-emerald-100 text-emerald-800', icon: <Check size={10} /> },
    completed:        { label: 'সম্পন্ন', cls: 'bg-emerald-100 text-emerald-800', icon: <CheckCircle size={10} /> },
    cancelled:        { label: 'বাতিল', cls: 'bg-red-100 text-red-700', icon: <X size={10} /> },
  };
  const s = map[status] || { label: status, cls: 'bg-stone-100 text-stone-600', icon: null };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${s.cls}`}>
      {s.icon}{s.label}
    </span>
  );
}

// ── Types ─────────────────────────────────────────────────────
interface FarmerVideo {
  id: string;
  title: string;
  url: string;
  createdAt: string;
}

interface FarmerNotification {
  id: string;
  farmerId: number;
  orderId: string;
  items: string;
  total: number;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  status: string;
  seen: boolean;
  createdAt: string;
}

interface Props {
  farmer: Farmer;
  allOrders: Order[];
  allProducts: Product[];
  onUpdateFarmer: (updated: Farmer) => Promise<void>;
  onAddProduct: (p: Product) => Promise<void>;
  onUpdateProduct: (p: Product) => Promise<void>;
  onDeleteProduct: (id: number) => Promise<void>;
  onLogout: () => void;
}

type Tab = 'overview' | 'products' | 'orders' | 'videos' | 'profile';

// ══════════════════════════════════════════════════════════════
export default function FarmerDashboard({
  farmer,
  allOrders,
  allProducts,
  onUpdateFarmer,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onLogout,
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  // ── Farmer's data filtered ─────────────────────────────────
  const myOrders = allOrders.filter(o =>
    o.items.some(i => i.farmerId === farmer.id || i.farmer === farmer.name)
  );
  const myProducts = allProducts.filter(
    p => p.farmerId === farmer.id || p.farmer === farmer.name
  );

  // ── Stats ──────────────────────────────────────────────────
  const totalRevenue = myOrders.reduce((sum, o) => {
    const mine = o.items.filter(i => i.farmerId === farmer.id || i.farmer === farmer.name);
    return sum + mine.reduce((s, i) => s + i.price * i.quantity, 0);
  }, 0);
  const totalOrders = myOrders.length;
  const pendingOrders = myOrders.filter(o => o.status === 'pending' || o.status === 'confirmed').length;
  const completedOrders = myOrders.filter(o => o.status === 'delivered' || o.status === 'completed').length;

  // ── Notifications — Firestore real-time ───────────────────
  const [notifications, setNotifications] = useState<FarmerNotification[]>([]);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [toastNotif, setToastNotif] = useState<FarmerNotification | null>(null);
  const prevNotifCount = useRef(0);

  // Request browser notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Real-time listener: farmer_notifications where farmerId == this farmer
  useEffect(() => {
    const q = query(
      collection(db, 'farmer_notifications'),
      where('farmerId', '==', farmer.id)
    );
    const unsub = onSnapshot(q, snap => {
      const docs = snap.docs.map(d => ({ ...d.data() } as FarmerNotification))
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      setNotifications(docs);

      // Detect genuinely new unseen notifications (not just first load)
      const unseenCount = docs.filter(n => !n.seen).length;
      if (prevNotifCount.current > 0 && unseenCount > prevNotifCount.current) {
        const newest = docs.find(n => !n.seen);
        if (newest) {
          // Show in-app toast
          setToastNotif(newest);
          setTimeout(() => setToastNotif(null), 7000);

          // Browser push notification
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('🌾 কৃষক বাজার — নতুন অর্ডার!', {
              body: `অর্ডার: ${newest.items} | মূল্য: ৳${newest.total}`,
              icon: 'https://cdn.shopify.com/s/files/1/0991/0717/6761/files/Gemini_Generated_Image_k0x5bek0x5bek0x5.png',
              tag: newest.id,
            });
          }
        }
      }
      prevNotifCount.current = unseenCount;
    });
    return () => unsub();
  }, [farmer.id]);

  const unseenCount = notifications.filter(n => !n.seen).length;

  const markNotifSeen = async (notifId: string) => {
    await updateDoc(doc(db, 'farmer_notifications', notifId), { seen: true });
  };

  const markAllSeen = async () => {
    const unseen = notifications.filter(n => !n.seen);
    await Promise.all(unseen.map(n => updateDoc(doc(db, 'farmer_notifications', n.id), { seen: true })));
  };

  const openFarmerWhatsApp = (notif: FarmerNotification) => {
    const farmerPhone = farmer.phone?.replace(/[^0-9]/g, '') || '';
    if (!farmerPhone) return;
    const waPhone = farmerPhone.startsWith('88') ? farmerPhone : `88${farmerPhone}`;
    const msg = `🌾 *কৃষক বাজার — অর্ডার ${notif.orderId}*\nপণ্য: ${notif.items}\nমূল্য: ৳${notif.total}\nক্রেতা: ${notif.customerName} · ${notif.customerPhone}`;
    window.open(`https://wa.me/${waPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // ── Videos — Firestore live ────────────────────────────────
  const [videos, setVideos] = useState<FarmerVideo[]>([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [savingVideo, setSavingVideo] = useState(false);
  const [videoPreview, setVideoPreview] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'farmer_videos'), where('farmerId', '==', farmer.id));
    const unsub = onSnapshot(q, snap => {
      setVideos(snap.docs.map(d => ({ id: d.id, ...d.data() } as FarmerVideo)));
    });
    return () => unsub();
  }, [farmer.id]);

  const handleSaveVideo = async () => {
    if (!videoUrl.trim()) return;
    setSavingVideo(true);
    try {
      const newId = `vid_${farmer.id}_${Date.now()}`;
      const newVid: FarmerVideo = {
        id: newId,
        title: videoTitle || 'আমার ফার্মের ভিডিও',
        url: videoUrl.trim(),
        createdAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'farmer_videos', newId), { ...newVid, farmerId: farmer.id });
      setVideoUrl('');
      setVideoTitle('');
      setVideoPreview('');
    } catch (err: any) {
      alert('ভিডিও সেভ করতে সমস্যা হয়েছে: ' + err.message);
    } finally {
      setSavingVideo(false);
    }
  };

  const handleDeleteVideo = async (vidId: string) => {
    if (!confirm('এই ভিডিওটি ডিলিট করবেন?')) return;
    await deleteDoc(doc(db, 'farmer_videos', vidId));
  };

  // ── Photo Upload — Supabase Storage ───────────────────────
  const [uploading, setUploading] = useState(false);
  const [uploadPct, setUploadPct] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const farmPhotoInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = async (file: File) => {
    setUploading(true);
    setUploadPct(10);
    try {
      // Try Supabase first (permanent storage)
      const url = await uploadImageToSupabase(file, 'krishok-images', `farmers/${farmer.id}`);
      if (url) {
        setUploadPct(80);
        const updated = { ...farmer, avatar: url };
        await onUpdateFarmer(updated);
        setUploadPct(100);
        alert('✅ প্রোফাইল ছবি সফলভাবে সুপাবেস ক্লাউডে আপলোড ও সংরক্ষিত হয়েছে!');
      } else {
        // Fallback to Firebase Storage
        const fileRef = ref(storage, `farmers/${farmer.id}/avatar_${Date.now()}.jpg`);
        const task = uploadBytesResumable(fileRef, file);
        task.on('state_changed',
          snap => setUploadPct(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
          err => { alert('আপলোড ব্যর্থ: ' + err.message); setUploading(false); },
          async () => {
            const downloadUrl = await getDownloadURL(task.snapshot.ref);
            const updated = { ...farmer, avatar: downloadUrl };
            await onUpdateFarmer(updated);
            alert('✅ প্রোফাইল ছবি Firebase-এ সংরক্ষিত হয়েছে!');
            setUploading(false);
          }
        );
        return;
      }
    } catch (err: any) {
      alert('ছবি আপলোড ব্যর্থ: ' + err.message);
    } finally {
      setUploading(false);
      setUploadPct(0);
    }
  };

  const handleFarmPhotoUpload = async (file: File) => {
    setUploading(true);
    setUploadPct(10);
    try {
      const url = await uploadImageToSupabase(file, 'krishok-images', `farms/${farmer.id}`);
      if (url) {
        setUploadPct(90);
        const updated = { ...farmer, farmPhoto: url } as any;
        await onUpdateFarmer(updated);
        setUploadPct(100);
        alert('✅ খামারের ছবি সফলভাবে সুপাবেসে সংরক্ষিত হয়েছে!');
      } else {
        alert('ছবি আপলোড করা যায়নি।');
      }
    } catch (err: any) {
      alert('ছবি আপলোড ব্যর্থ: ' + err.message);
    } finally {
      setUploading(false);
      setUploadPct(0);
    }
  };

  // ── Products CRUD ──────────────────────────────────────────
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProd, setNewProd] = useState({ title: '', price: '', unit: 'কেজি', cat: 'vegetables', img: '', desc: '' });
  const [addingProd, setAddingProd] = useState(false);
  const [productImgFile, setProductImgFile] = useState<File | null>(null);
  const productImgRef = useRef<HTMLInputElement>(null);

  const handleAddProduct = async () => {
    if (!newProd.title || !newProd.price) { alert('ফসলের নাম ও মূল্য দিন।'); return; }
    setAddingProd(true);
    try {
      let imgUrl = newProd.img;
      if (productImgFile) {
        const uploaded = await uploadImageToSupabase(productImgFile, 'krishok-images', `products`);
        if (uploaded) imgUrl = uploaded;
      }
      const newId = Date.now();
      const product: Product = {
        id: newId,
        title: newProd.title,
        slug: newProd.title.toLowerCase().replace(/[^\w\s]/g, '').trim().replace(/\s+/g, '-') + `-${newId}`,
        price: Number(newProd.price),
        unit: newProd.unit,
        cat: newProd.cat as any,
        farmer: farmer.name,
        farmerId: farmer.id,
        img: imgUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400',
        description: newProd.desc || 'সরাসরি কৃষকের খামার থেকে সংগৃহীত তাজা ফসল।',
        approved: false,
        rating: 4.8,
        weightOptions: ['৫০০ গ্রাম', '১ কেজি', '২ কেজি'],
      };
      await setDoc(doc(db, 'products', String(newId)), product);
      // Also save to Supabase for permanent backup
      await supabase.from('products').upsert({ ...product, created_at: new Date().toISOString() });
      await onAddProduct(product);
      setNewProd({ title: '', price: '', unit: 'কেজি', cat: 'vegetables', img: '', desc: '' });
      setProductImgFile(null);
      setShowAddProduct(false);
      alert('✅ ফসল আপলোড সফল! এডমিন অনুমোদনের পর লাইভ হবে।');
    } catch (err: any) {
      alert('ফসল আপলোড ব্যর্থ: ' + err.message);
    } finally {
      setAddingProd(false);
    }
  };

  const handleDeleteProduct = async (prod: Product) => {
    if (!confirm(`"${prod.title}" ডিলিট করবেন?`)) return;
    await deleteDoc(doc(db, 'products', String(prod.id)));
    await supabase.from('products').delete().eq('id', prod.id);
    await onDeleteProduct(prod.id);
  };

  // ── Profile Edit ───────────────────────────────────────────
  const [editName, setEditName] = useState(farmer.name);
  const [editPhone, setEditPhone] = useState(farmer.phone || '');
  const [editLocation, setEditLocation] = useState(farmer.location || '');
  const [editPass, setEditPass] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  const handleSaveProfile = async () => {
    if (!editName.trim()) { alert('নাম দিন।'); return; }
    setSavingProfile(true);
    try {
      const updated: Farmer = {
        ...farmer,
        name: editName.trim(),
        phone: editPhone.trim(),
        location: editLocation.trim(),
        ...(editPass ? { password: editPass } : {}),
      };
      await onUpdateFarmer(updated);
      // Sync to Supabase
      await supabase.from('farmers').upsert({ ...updated, updated_at: new Date().toISOString() });
      alert('✅ প্রোফাইল তথ্য সফলভাবে আপডেট হয়েছে!');
      setEditPass('');
    } catch (err: any) {
      alert('প্রোফাইল আপডেট ব্যর্থ: ' + err.message);
    } finally {
      setSavingProfile(false);
    }
  };

  // ── Tabs config ────────────────────────────────────────────
  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'ওভারভিউ', icon: <BarChart2 size={14} /> },
    { id: 'products', label: 'আমার ফসল', icon: <Leaf size={14} /> },
    { id: 'orders', label: 'অর্ডারস', icon: <ShoppingBag size={14} /> },
    { id: 'videos', label: 'ভিডিও', icon: <Video size={14} /> },
    { id: 'profile', label: 'প্রোফাইল', icon: <User size={14} /> },
  ];

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="bg-emerald-800 text-white px-4 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <img src={LOGO} alt="কৃষক বাজার" className="w-9 h-9 rounded-full object-cover border-2 border-white/30" />
          <div>
            <div className="text-[10px] font-bold text-emerald-200 uppercase tracking-widest">কৃষক বাজার — ড্যাশবোর্ড</div>
            <div className="text-base font-serif font-black leading-tight">{farmer.name}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="relative cursor-pointer group"
            onClick={() => fileInputRef.current?.click()}
            title="প্রোফাইল ছবি পরিবর্তন করুন"
          >
            <img
              src={farmer.avatar || LOGO}
              alt={farmer.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-white/40 group-hover:border-amber-300 transition"
            />
            {uploading && (
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                <Loader2 size={12} className="animate-spin text-white" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
              <Camera size={11} className="text-white" />
            </div>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleAvatarUpload(f); }} />

          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${farmer.verified ? 'bg-amber-400 text-stone-900' : 'bg-stone-700 text-stone-200'}`}>
            {farmer.verified ? '👑 গোল্ড' : '⌛ ফ্রি'}
          </span>

          {/* 🔔 Notification Bell */}
          <button
            onClick={() => { setShowNotifPanel(p => !p); if (unseenCount > 0) markAllSeen(); }}
            className="relative p-2 bg-white/10 hover:bg-white/20 rounded-lg transition cursor-pointer"
            title="নোটিফিকেশন"
          >
            {unseenCount > 0
              ? <BellRing size={16} className="text-amber-300 animate-bounce" />
              : <Bell size={16} className="text-white/70" />}
            {unseenCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-emerald-800">
                {unseenCount}
              </span>
            )}
          </button>

          <button
            onClick={onLogout}
            className="text-[10px] font-bold bg-emerald-900 hover:bg-emerald-950 px-3 py-1.5 rounded-lg transition cursor-pointer"
          >
            লগআউট
          </button>
        </div>
      </div>

      {/* ── Upload progress bar ─────────────────────────────── */}
      {uploading && (
        <div className="h-1.5 bg-stone-200">
          <div className="h-full bg-emerald-500 transition-all" style={{ width: `${uploadPct}%` }} />
        </div>
      )}

      {/* ── 🔔 Floating toast: new order arrived ─────────────── */}
      <AnimatePresence>
        {toastNotif && (
          <motion.div
            initial={{ opacity: 0, y: -60, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.92 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[200] w-[340px] max-w-[95vw]"
          >
            <div className="bg-white rounded-2xl shadow-2xl border-2 border-emerald-500 overflow-hidden">
              <div className="bg-emerald-700 px-4 py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-white font-bold text-xs">
                  <BellRing size={14} className="animate-bounce" />
                  🌾 নতুন অর্ডার পাওয়া গেছে!
                </div>
                <button onClick={() => setToastNotif(null)} className="text-white/70 hover:text-white cursor-pointer"><X size={14} /></button>
              </div>
              <div className="p-4 space-y-2">
                <div className="text-xs font-bold text-stone-800">অর্ডার আইডি: <span className="font-mono text-emerald-700">{toastNotif.orderId}</span></div>
                <div className="text-xs text-stone-600">📦 {toastNotif.items}</div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-black text-emerald-800">৳{toastNotif.total}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setActiveTab('orders'); setToastNotif(null); }}
                      className="bg-emerald-800 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg cursor-pointer hover:bg-emerald-900"
                    >
                      অর্ডার দেখুন
                    </button>
                    {toastNotif.customerPhone && (
                      <a
                        href={`https://wa.me/88${toastNotif.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`সালাম, আমি কৃষক বাজারের ${farmer.name}। আপনার অর্ডার ${toastNotif.orderId} পেয়েছি।`)}`}
                        target="_blank" rel="noopener noreferrer"
                        className="bg-[#25D366] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg cursor-pointer flex items-center gap-1"
                      >
                        <MessageCircle size={11} /> WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 🔔 Notification side panel ───────────────────────── */}
      <AnimatePresence>
        {showNotifPanel && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-[150]"
              onClick={() => setShowNotifPanel(false)}
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-80 max-w-[95vw] bg-white shadow-2xl z-[160] flex flex-col"
            >
              <div className="bg-emerald-800 text-white px-4 py-3 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <Bell size={15} /> নোটিফিকেশনস ({notifications.length})
                </div>
                <button onClick={() => setShowNotifPanel(false)} className="text-white/70 hover:text-white cursor-pointer"><X size={16} /></button>
              </div>

              {notifications.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-stone-400 gap-2">
                  <Bell size={32} className="opacity-20" />
                  <p className="text-sm font-bold">কোনো নোটিফিকেশন নেই</p>
                  <p className="text-xs text-center px-4">অর্ডার আসলে এখানে লাইভ দেখা যাবে</p>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto divide-y divide-stone-100">
                  {notifications.map(notif => (
                    <div
                      key={notif.id}
                      onClick={() => markNotifSeen(notif.id)}
                      className={`p-4 cursor-pointer hover:bg-stone-50 transition ${!notif.seen ? 'bg-emerald-50 border-l-4 border-emerald-500' : ''}`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="text-[10px] font-mono font-bold text-emerald-700">{notif.orderId}</div>
                          <div className="text-xs font-bold text-stone-800 mt-0.5 line-clamp-2">{notif.items}</div>
                          <div className="text-sm font-black text-emerald-800 mt-1">৳{notif.total}</div>
                          <div className="text-[10px] text-stone-500 mt-0.5">ক্রেতা: {notif.customerName}</div>
                          <div className="text-[10px] text-stone-400">{new Date(notif.createdAt).toLocaleString('bn-BD')}</div>
                        </div>
                        {!notif.seen && (
                          <span className="shrink-0 w-2 h-2 bg-emerald-500 rounded-full mt-1" />
                        )}
                      </div>
                      {/* WhatsApp quick-reply */}
                      {notif.customerPhone && farmer.verified && (
                        <a
                          href={`https://wa.me/88${notif.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`সালাম ${notif.customerName}, আমি কৃষক বাজারের ${farmer.name}। আপনার অর্ডার ${notif.orderId} পেয়েছি।`)}`}
                          target="_blank" rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="mt-2 inline-flex items-center gap-1.5 bg-[#25D366] text-white text-[9px] font-bold px-2.5 py-1 rounded-lg cursor-pointer"
                        >
                          <MessageCircle size={10} /> ক্রেতাকে WhatsApp করুন
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Tab bar ────────────────────────────────────────── */}
      <div className="bg-white border-b border-stone-200 px-4 flex gap-1 overflow-x-auto no-scrollbar sticky top-0 z-10 shadow-sm">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'border-emerald-800 text-emerald-800'
                : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            {tab.icon}{tab.label}
            {tab.id === 'orders' && pendingOrders > 0 && (
              <span className="bg-red-500 text-white text-[8px] px-1 rounded-full">{pendingOrders}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── Tab content ────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.18 }}>

            {/* ════ OVERVIEW ════════════════════════════════ */}
            {activeTab === 'overview' && (
              <div className="space-y-5">
                {/* Stats cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'মোট বিক্রয়', value: `৳${totalRevenue.toLocaleString('bn-BD')}`, icon: <TrendingUp size={18} className="text-emerald-700" />, bg: 'bg-emerald-50' },
                    { label: 'মোট অর্ডার', value: String(totalOrders), icon: <ShoppingBag size={18} className="text-blue-600" />, bg: 'bg-blue-50' },
                    { label: 'পেন্ডিং', value: String(pendingOrders), icon: <Clock size={18} className="text-amber-600" />, bg: 'bg-amber-50' },
                    { label: 'সম্পন্ন', value: String(completedOrders), icon: <CheckCircle size={18} className="text-purple-600" />, bg: 'bg-purple-50' },
                  ].map(s => (
                    <div key={s.label} className={`${s.bg} rounded-2xl p-4 border border-stone-100 flex flex-col gap-1.5`}>
                      {s.icon}
                      <div className="text-xl font-black text-stone-900">{s.value}</div>
                      <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Farmer info card */}
                <div className="bg-white rounded-2xl border border-stone-200 p-5 flex items-center gap-4 shadow-sm">
                  <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <img
                      src={farmer.avatar || LOGO}
                      alt={farmer.name}
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-800/20"
                    />
                    <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                      <Camera size={16} className="text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-base font-serif font-black text-stone-900">{farmer.name}</h2>
                      {farmer.verified && <span className="text-[9px] bg-amber-400 text-stone-900 font-bold px-2 py-0.5 rounded-full">✓ ভেরিফাইড</span>}
                    </div>
                    <div className="text-xs text-stone-500 mt-1 space-y-0.5">
                      {farmer.location && <div>📍 {farmer.location}</div>}
                      {farmer.phone && <div>📞 {farmer.phone}</div>}
                      <div>⭐ রেটিং: {farmer.rating || '4.8'} / 5.0</div>
                    </div>
                  </div>
                  <button onClick={() => setActiveTab('profile')} className="text-[10px] font-bold text-emerald-800 flex items-center gap-0.5 hover:underline cursor-pointer">
                    এডিট <ChevronRight size={12} />
                  </button>
                </div>

                {/* Quick actions */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'ফসল যোগ করুন', icon: <Plus size={16} />, action: () => { setActiveTab('products'); setShowAddProduct(true); }, cls: 'bg-emerald-800 text-white' },
                    { label: 'অর্ডার দেখুন', icon: <ShoppingBag size={16} />, action: () => setActiveTab('orders'), cls: 'bg-stone-900 text-white' },
                    { label: 'ভিডিও যোগ করুন', icon: <Youtube size={16} />, action: () => setActiveTab('videos'), cls: 'bg-red-600 text-white' },
                    { label: 'প্রোফাইল এডিট', icon: <User size={16} />, action: () => setActiveTab('profile'), cls: 'bg-blue-600 text-white' },
                  ].map(q => (
                    <button key={q.label} onClick={q.action} className={`${q.cls} rounded-xl p-3 flex flex-col items-start gap-2 font-bold text-xs cursor-pointer hover:opacity-90 transition shadow-sm`}>
                      {q.icon}{q.label}
                    </button>
                  ))}
                </div>

                {/* Recent orders preview */}
                {myOrders.length > 0 && (
                  <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b flex justify-between items-center">
                      <h3 className="font-serif font-black text-sm text-stone-900">সাম্প্রতিক অর্ডারসমূহ</h3>
                      <button onClick={() => setActiveTab('orders')} className="text-[10px] text-emerald-800 font-bold hover:underline cursor-pointer">সব দেখুন →</button>
                    </div>
                    {myOrders.slice(0, 3).map(o => (
                      <div key={o.id} className="p-3.5 border-b border-stone-50 flex justify-between items-center">
                        <div>
                          <div className="text-xs font-bold text-stone-800 font-mono">{o.id.substring(0, 12)}…</div>
                          <div className="text-[10px] text-stone-500 mt-0.5">{o.customerName} · {o.date}</div>
                        </div>
                        <StatusBadge status={o.status} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ════ PRODUCTS ════════════════════════════════ */}
            {activeTab === 'products' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-serif font-black text-base text-stone-900">🌱 আমার ফসলের তালিকা ({myProducts.length})</h3>
                  <button
                    onClick={() => setShowAddProduct(!showAddProduct)}
                    className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer transition"
                  >
                    <Plus size={13} /> নতুন ফসল
                  </button>
                </div>

                {/* Add product form */}
                <AnimatePresence>
                  {showAddProduct && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 space-y-3.5 overflow-hidden"
                    >
                      <h4 className="font-serif font-black text-sm text-emerald-900">নতুন ফসল আপলোড করুন</h4>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-stone-500 uppercase">ফসলের নাম *</label>
                          <input value={newProd.title} onChange={e => setNewProd(p => ({ ...p, title: e.target.value }))}
                            placeholder="যেমন: তাজা আলু (বগুড়া)" className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-emerald-700" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-stone-500 uppercase">মূল্য (৳) *</label>
                          <input type="number" value={newProd.price} onChange={e => setNewProd(p => ({ ...p, price: e.target.value }))}
                            placeholder="৬০" className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-emerald-700" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-stone-500 uppercase">একক</label>
                          <select value={newProd.unit} onChange={e => setNewProd(p => ({ ...p, unit: e.target.value }))}
                            className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-emerald-700">
                            {['কেজি', 'গ্রাম', 'হালি', 'লিটার', 'প্যাক'].map(u => <option key={u}>{u}</option>)}
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-stone-500 uppercase">ক্যাটাগরি</label>
                          <select value={newProd.cat} onChange={e => setNewProd(p => ({ ...p, cat: e.target.value }))}
                            className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-emerald-700">
                            <option value="vegetables">শাকসবজি</option>
                            <option value="fruits">ফলমূল</option>
                            <option value="staples">ডাল ও চাল</option>
                            <option value="oil_spices">তেল ও মশলা</option>
                          </select>
                        </div>
                      </div>

                      {/* Product image upload */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-stone-500 uppercase">ফসলের ছবি</label>
                        <div className="flex gap-2 flex-wrap items-center">
                          <button type="button" onClick={() => productImgRef.current?.click()}
                            className="bg-white border border-stone-300 text-stone-600 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer hover:bg-stone-50 transition">
                            <Upload size={12} /> ছবি আপলোড (Supabase)
                          </button>
                          <input ref={productImgRef} type="file" accept="image/*" className="hidden"
                            onChange={e => { const f = e.target.files?.[0]; if (f) setProductImgFile(f); }} />
                          {productImgFile && <span className="text-[10px] text-emerald-700 font-bold">✓ {productImgFile.name}</span>}
                        </div>
                        <input value={newProd.img} onChange={e => setNewProd(p => ({ ...p, img: e.target.value }))}
                          placeholder="অথবা ছবির URL দিন..." className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-emerald-700 font-mono" />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-stone-500 uppercase">ফসলের বিবরণ</label>
                        <textarea value={newProd.desc} onChange={e => setNewProd(p => ({ ...p, desc: e.target.value }))}
                          placeholder="ফসলের বিশেষত্ব, চাষ পদ্ধতি, গুণগতমান..." rows={2}
                          className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-emerald-700 resize-none" />
                      </div>

                      <div className="flex gap-2">
                        <button onClick={handleAddProduct} disabled={addingProd}
                          className="flex-1 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-60 text-white font-bold py-2.5 rounded-xl text-xs cursor-pointer transition flex items-center justify-center gap-1.5">
                          {addingProd ? <><Loader2 size={12} className="animate-spin" /> আপলোড হচ্ছে…</> : <><Plus size={12} /> ফসল জমা দিন</>}
                        </button>
                        <button onClick={() => setShowAddProduct(false)} className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold rounded-xl text-xs cursor-pointer">বাতিল</button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Products list */}
                {myProducts.length === 0 ? (
                  <div className="text-center py-16 text-stone-400 bg-white border border-stone-100 rounded-2xl">
                    <Leaf size={32} className="mx-auto opacity-20 mb-3" />
                    <p className="text-sm font-bold">এখনও কোনো ফসল আপলোড করেননি</p>
                    <p className="text-xs mt-1 text-stone-400">উপরের "নতুন ফসল" বাটন চাপুন</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {myProducts.map(prod => (
                      <div key={prod.id} className="bg-white rounded-2xl border border-stone-200 p-4 flex items-center gap-3 shadow-sm">
                        <img src={prod.img} alt={prod.title} className="w-14 h-14 rounded-xl object-cover border border-stone-100 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-sm text-stone-900 truncate">{prod.title}</span>
                            <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${prod.approved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-700'}`}>
                              {prod.approved ? '✓ অনুমোদিত' : '⌛ পেন্ডিং'}
                            </span>
                          </div>
                          <div className="text-xs text-emerald-800 font-black mt-0.5">৳{prod.price} / {prod.unit}</div>
                          <div className="text-[10px] text-stone-400 mt-0.5">{prod.cat}</div>
                        </div>
                        <div className="flex gap-1.5 shrink-0">
                          <button onClick={() => handleDeleteProduct(prod)} className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg cursor-pointer transition" title="ডিলিট করুন">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ════ ORDERS ══════════════════════════════════ */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-serif font-black text-base text-stone-900">📦 আমার অর্ডারসমূহ ({myOrders.length})</h3>
                  <div className="text-[10px] font-bold text-stone-400">লাইভ আপডেট ✓</div>
                </div>

                {/* Stats bar */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  {[
                    { label: 'পেন্ডিং', val: pendingOrders, cls: 'bg-amber-50 text-amber-800 border-amber-200' },
                    { label: 'সম্পন্ন', val: completedOrders, cls: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
                    { label: 'মোট আয়', val: `৳${totalRevenue.toLocaleString()}`, cls: 'bg-blue-50 text-blue-800 border-blue-200' },
                  ].map(s => (
                    <div key={s.label} className={`${s.cls} border rounded-xl p-2.5`}>
                      <div className="text-sm font-black">{s.val}</div>
                      <div className="text-[10px] font-bold opacity-70">{s.label}</div>
                    </div>
                  ))}
                </div>

                {myOrders.length === 0 ? (
                  <div className="text-center py-16 text-stone-400 bg-white border border-stone-100 rounded-2xl">
                    <ShoppingBag size={32} className="mx-auto opacity-20 mb-3" />
                    <p className="text-sm font-bold">এখনও কোনো অর্ডার নেই</p>
                    <p className="text-xs mt-1 text-stone-400">গ্রাহকরা অর্ডার করলে এখানে লাইভ দেখা যাবে</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {myOrders.map(order => {
                      const mine = order.items.filter(i => i.farmerId === farmer.id || i.farmer === farmer.name);
                      const myTotal = mine.reduce((s, i) => s + i.price * i.quantity, 0);
                      return (
                        <div key={order.id} className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
                          <div className="p-4 bg-stone-50 border-b border-stone-100 flex justify-between items-center">
                            <div>
                              <div className="text-xs font-mono font-bold text-stone-700">#{order.id.substring(0, 16)}…</div>
                              <div className="text-[10px] text-stone-400 mt-0.5">{order.date}</div>
                            </div>
                            <StatusBadge status={order.status} />
                          </div>
                          <div className="p-4 space-y-2">
                            {mine.map((item, idx) => (
                              <div key={idx} className="flex justify-between text-xs text-stone-800">
                                <span className="flex items-center gap-1"><Package size={10} className="text-stone-400" /> {item.title} × {item.quantity}</span>
                                <span className="font-bold text-emerald-800">৳{item.price * item.quantity}</span>
                              </div>
                            ))}
                            <div className="pt-2 border-t border-dashed border-stone-100 flex justify-between items-center">
                              <span className="text-xs font-black text-stone-700">আপনার প্রাপ্য:</span>
                              <span className="text-sm font-black text-emerald-800">৳{myTotal}</span>
                            </div>

                            {/* Customer info — gated by verified status */}
                            {farmer.verified ? (
                              <div className="bg-stone-50 rounded-xl p-3 border border-stone-100 space-y-1">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <div className="text-xs font-bold text-stone-800">ক্রেতা: {order.customerName}</div>
                                    <div className="text-[11px] text-stone-500 font-mono">{order.customerPhone}</div>
                                    <div className="text-[11px] text-stone-500 mt-0.5">{order.customerAddress}</div>
                                  </div>
                                  {order.customerPhone && (
                                    <a href={`https://wa.me/88${order.customerPhone.replace(/[^0-9]/g, '')}`}
                                      target="_blank" rel="noopener noreferrer"
                                      className="bg-[#25D366] text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer">
                                      <Phone size={10} /> WhatsApp
                                    </a>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div className="relative overflow-hidden rounded-xl p-3 bg-stone-50 border border-stone-100">
                                <div className="blur-sm select-none text-xs text-stone-700">
                                  ক্রেতা: মফিজুর রহমান · 017XXXX1234 · মিরপুর ১০, ঢাকা
                                </div>
                                <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center text-center p-2 rounded-xl">
                                  <p className="text-[10px] font-bold text-stone-700">🔒 গোল্ড মেম্বারশিপ নিলে ক্রেতার পূর্ণ তথ্য দেখা যাবে</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ════ VIDEOS ══════════════════════════════════ */}
            {activeTab === 'videos' && (
              <div className="space-y-5">
                <h3 className="font-serif font-black text-base text-stone-900">🎥 আমার ইউটিউব ভিডিও</h3>

                {/* Add video form */}
                <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 space-y-4">
                  <h4 className="text-sm font-bold text-stone-800 flex items-center gap-2">
                    <Youtube size={16} className="text-red-600" /> নতুন ভিডিও যোগ করুন
                  </h4>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-500 uppercase">ভিডিওর শিরোনাম</label>
                    <input value={videoTitle} onChange={e => setVideoTitle(e.target.value)}
                      placeholder="যেমন: বগুড়ার আলুর মাঠ থেকে লাইভ আপডেট"
                      className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-emerald-700" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-500 uppercase">ইউটিউব লিংক বা ভিডিও আইডি</label>
                    <input value={videoUrl} onChange={e => { setVideoUrl(e.target.value); setVideoPreview(e.target.value); }}
                      placeholder="https://www.youtube.com/watch?v=… অথবা শুধু ভিডিও আইডি"
                      className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-emerald-700 font-mono" />
                  </div>

                  {/* Live preview */}
                  {videoPreview && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-stone-400 uppercase">👁️ লাইভ প্রিভিউ</label>
                      <div className="relative aspect-video rounded-xl overflow-hidden bg-stone-900 border border-stone-200">
                        <iframe
                          src={getYouTubeEmbedUrl(videoPreview)}
                          title="ভিডিও প্রিভিউ"
                          className="absolute inset-0 w-full h-full border-0"
                          allowFullScreen
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        />
                      </div>
                    </div>
                  )}

                  <button onClick={handleSaveVideo} disabled={savingVideo || !videoUrl.trim()}
                    className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl text-xs cursor-pointer transition flex items-center justify-center gap-2">
                    {savingVideo ? <><Loader2 size={12} className="animate-spin" /> সেভ হচ্ছে…</> : <><Youtube size={12} /> ভিডিও সেভ করুন (Firestore)</>}
                  </button>
                </div>

                {/* Video list */}
                {videos.length === 0 ? (
                  <div className="text-center py-16 text-stone-400 bg-white border border-stone-100 rounded-2xl">
                    <PlayCircle size={32} className="mx-auto opacity-20 mb-3" />
                    <p className="text-sm font-bold">এখনও কোনো ভিডিও যোগ করেননি</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {videos.map(vid => (
                      <div key={vid.id} className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
                        <div className="relative aspect-video bg-stone-900">
                          <iframe
                            src={getYouTubeEmbedUrl(vid.url)}
                            title={vid.title}
                            className="absolute inset-0 w-full h-full border-0"
                            allowFullScreen
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          />
                        </div>
                        <div className="p-3 flex justify-between items-center">
                          <div>
                            <div className="text-xs font-bold text-stone-800 line-clamp-1">{vid.title}</div>
                            <div className="text-[10px] text-stone-400 mt-0.5">{new Date(vid.createdAt).toLocaleDateString('bn-BD')}</div>
                          </div>
                          <button onClick={() => handleDeleteVideo(vid.id)} className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg cursor-pointer transition">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ════ PROFILE ═════════════════════════════════ */}
            {activeTab === 'profile' && (
              <div className="space-y-5">
                <h3 className="font-serif font-black text-base text-stone-900">📝 প্রোফাইল সম্পাদনা</h3>

                {/* Profile photo section */}
                <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 space-y-4">
                  <h4 className="text-sm font-bold text-stone-800">📸 প্রোফাইল ও খামারের ছবি</h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Avatar */}
                    <div className="bg-stone-50 rounded-xl border border-stone-100 p-4 flex flex-col items-center gap-3">
                      <img src={farmer.avatar || LOGO} alt="Avatar" className="w-20 h-20 rounded-full object-cover border-2 border-emerald-800/20 shadow-sm" />
                      <div className="text-center">
                        <div className="text-[10px] font-bold text-stone-500 uppercase mb-1.5">প্রোফাইল ছবি (Supabase)</div>
                        <button onClick={() => fileInputRef.current?.click()}
                          className="bg-emerald-800 hover:bg-emerald-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition mx-auto">
                          <Camera size={11} /> ছবি পরিবর্তন করুন
                        </button>
                        {uploading && <div className="text-[9px] text-emerald-700 font-bold mt-1">আপলোড হচ্ছে… {uploadPct}%</div>}
                      </div>
                    </div>

                    {/* Farm photo */}
                    <div className="bg-stone-50 rounded-xl border border-stone-100 p-4 flex flex-col items-center gap-3">
                      <div className="w-20 h-20 rounded-xl bg-stone-200 border-2 border-stone-100 shadow-sm flex items-center justify-center overflow-hidden">
                        {(farmer as any).farmPhoto
                          ? <img src={(farmer as any).farmPhoto} alt="Farm" className="w-full h-full object-cover" />
                          : <ImageIcon size={28} className="text-stone-300" />
                        }
                      </div>
                      <div className="text-center">
                        <div className="text-[10px] font-bold text-stone-500 uppercase mb-1.5">খামারের ছবি (Supabase)</div>
                        <button onClick={() => farmPhotoInputRef.current?.click()}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition mx-auto">
                          <Upload size={11} /> খামারের ছবি আপলোড
                        </button>
                      </div>
                    </div>
                  </div>
                  <input ref={farmPhotoInputRef} type="file" accept="image/*" className="hidden"
                    onChange={e => { const f = e.target.files?.[0]; if (f) handleFarmPhotoUpload(f); }} />
                </div>

                {/* Profile info form */}
                <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 space-y-4">
                  <h4 className="text-sm font-bold text-stone-800">✏️ ব্যক্তিগত তথ্য সম্পাদনা</h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-stone-500 uppercase">পুরো নাম *</label>
                      <input value={editName} onChange={e => setEditName(e.target.value)}
                        className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-emerald-700" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-stone-500 uppercase">মোবাইল নম্বর</label>
                      <input value={editPhone} onChange={e => setEditPhone(e.target.value)} type="tel"
                        placeholder="০১৭xxxxxxxx"
                        className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-emerald-700 font-mono" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-500 uppercase">খামারের ঠিকানা / জেলা</label>
                    <input value={editLocation} onChange={e => setEditLocation(e.target.value)}
                      placeholder="যেমন: বগুড়া, মহাস্থান গড়"
                      className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-emerald-700" />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-500 uppercase">নতুন পাসওয়ার্ড (খালি রাখলে পরিবর্তন হবে না)</label>
                    <input value={editPass} onChange={e => setEditPass(e.target.value)} type="password"
                      placeholder="নতুন পাসওয়ার্ড"
                      className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-emerald-700 font-mono" />
                  </div>

                  <button onClick={handleSaveProfile} disabled={savingProfile}
                    className="w-full bg-emerald-800 hover:bg-emerald-900 disabled:opacity-60 text-white font-bold py-3 rounded-xl text-xs cursor-pointer transition flex items-center justify-center gap-2">
                    {savingProfile ? <><Loader2 size={12} className="animate-spin" /> সেভ হচ্ছে…</> : <><Save size={12} /> প্রোফাইল সেভ করুন (Firestore + Supabase)</>}
                  </button>
                </div>

                {/* Farmer info badges */}
                <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-4 space-y-2">
                  <h4 className="text-xs font-bold text-stone-700 pb-2 border-b">📊 অ্যাকাউন্ট তথ্য</h4>
                  {[
                    { label: 'কৃষক ID', val: `#${farmer.id}` },
                    { label: 'মেম্বারশিপ', val: farmer.verified ? '👑 গোল্ড ভেরিফাইড' : '⌛ ফ্রি স্ট্যান্ডার্ড' },
                    { label: 'রেটিং', val: `⭐ ${farmer.rating || 4.8} / 5.0` },
                    { label: 'মোট পণ্য', val: `${myProducts.length} টি` },
                    { label: 'মোট অর্ডার', val: `${totalOrders} টি` },
                  ].map(r => (
                    <div key={r.label} className="flex justify-between text-xs">
                      <span className="text-stone-500 font-medium">{r.label}</span>
                      <span className="font-bold text-stone-800">{r.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
