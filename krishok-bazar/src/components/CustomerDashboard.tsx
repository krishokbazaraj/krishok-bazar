import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  User, Mail, Phone, MapPin, Clipboard, Loader2, LogOut, CheckCircle2, 
  ShoppingBag, Sparkles, X, ChevronRight, Lock, UserCheck, Star, 
  Calendar, CreditCard, ArrowRight, Eye, EyeOff, Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, collection, query, where, onSnapshot, getDocs } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import { Order } from '../types';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';

interface CustomerDashboardProps {
  onClose: () => void;
  onSelectOrder?: (order: Order) => void;
  onProfileLoaded?: (profile: { name: string; phone: string; address: string }) => void;
  fullScreen?: boolean;
}

interface UserProfile {
  name: string;
  phone: string;
  address: string;
  email: string;
  gender?: string;
  uniqueCode?: string;
}

export default function CustomerDashboard({ onClose, onSelectOrder, onProfileLoaded, fullScreen = false }: CustomerDashboardProps) {
  // Auth state
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Authentication sub-views: 'login' | 'signup' | 'forgot' | 'dashboard' | 'lookup'
  const [authView, setAuthView] = useState<'login' | 'signup' | 'forgot' | 'dashboard' | 'lookup'>('login');

  // Input states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'optional'>('optional');
  const [uniqueCode, setUniqueCode] = useState('');
  const [currentOfferSlide, setCurrentOfferSlide] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Flag to check if registration is in progress to prevent fetchUserProfile race condition
  const isRegisteringRef = useRef(false);

  // Guest lookup state indicators
  const [lookupPhone, setLookupPhone] = useState('');
  const [lookupOrders, setLookupOrders] = useState<Order[]>([]);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [lookupRan, setLookupRan] = useState(false);

  const handlePhoneLookup = async () => {
    if (!lookupPhone || lookupPhone.trim().length < 6) {
      setErrorMsg('দয়া করে একটি সঠিক মোবাইল নম্বর লিখুন!');
      return;
    }
    setErrorMsg('');
    setIsLookingUp(true);
    setLookupRan(false);
    try {
      const ordersRef = collection(db, 'orders');
      const qPhone = lookupPhone.trim();
      
      const snap = await getDocs(ordersRef);
      const list: Order[] = [];
      snap.forEach(d => {
        const data = d.data() as Order;
        const oPhone = String(data.customerPhone || '').trim();
        if (
          oPhone === qPhone || 
          oPhone.endsWith(qPhone) || 
          qPhone.endsWith(oPhone)
        ) {
          list.push({ ...data, id: d.id });
        }
      });
      list.sort((a, b) => {
        const da = a.date ? new Date(a.date).getTime() : 0;
        const dbTime = b.date ? new Date(b.date).getTime() : 0;
        return dbTime - da;
      });
      setLookupOrders(list);
      setLookupRan(true);
    } catch (err: any) {
      console.error(err);
      setErrorMsg('সার্ভার থেকে অর্ডার ডেটা লোড করা ব্যর্থ হয়েছে!');
    } finally {
      setIsLookingUp(false);
    }
  };

  // Lifetime user metrics summary calculation
  const stats = useMemo(() => {
    let totalSpend = 0;
    let packagesCount = 0;
    const farmersSet = new Set<string>();

    orders.forEach(order => {
      if (order.status !== 'cancelled') {
        totalSpend += order.total;
        order.items.forEach(item => {
          const isCombo = item.title.includes('বাস্কেট') || item.title.includes('কম্বো') || item.title.includes('Combo') || item.title.includes('Basket');
          if (isCombo) {
            packagesCount += item.quantity;
          }
          if (item.farmer) {
            farmersSet.add(item.farmer);
          }
        });
      }
    });

    return {
      totalSpend,
      packagesCount,
      uniqueFarmers: farmersSet.size
    };
  }, [orders]);

  // Track password strength or verification alerts
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        await fetchUserProfile(user);
        setAuthView('dashboard');
      } else {
        setCurrentUser(null);
        setProfile(null);
        setOrders([]);
        setAuthView('login');
      }
      setIsLoading(false);
    });
    return unsub;
  }, []);

  // Real-time listener for orders when user profile or login updates
  useEffect(() => {
    if (!currentUser) {
      setOrders([]);
      return;
    }
    const userPhone = profile?.phone || '';
    const userEmail = currentUser.email || '';
    if (!userPhone && !userEmail) return;

    const ordersRef = collection(db, 'orders');
    const unsub = onSnapshot(ordersRef, (snapshot) => {
      const list: Order[] = [];
      snapshot.forEach(d => {
        const data = d.data() as Order;
        // Match either phone, or email (ignoring space / casing)
        const phoneMatch = userPhone && data.customerPhone && data.customerPhone.trim() === userPhone.trim();
        const emailMatch = userEmail && data.customerEmail && data.customerEmail.toLowerCase().trim() === userEmail.toLowerCase().trim();
        
        if (phoneMatch || emailMatch) {
          list.push({ ...data, id: d.id });
        }
      });
      
      // Sort orders descending by date
      setOrders(list.sort((a, b) => b.id.localeCompare(a.id)));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'orders');
    });

    return () => unsub();
  }, [currentUser, profile?.phone]);

  // Fetch client user profile & orders
  const fetchUserProfile = async (user: FirebaseUser) => {
    try {
      const docRef = doc(db, 'customers', user.uid);
      const docSnap = await getDoc(docRef);
      
      let loadedProfile: UserProfile;
      if (docSnap.exists()) {
        const data = docSnap.data();
        let code = data.uniqueCode;
        if (!code) {
          const userPhone = data.phone || '0000';
          code = "KB-" + userPhone.slice(-4) + "-" + Math.floor(1000 + Math.random() * 9000);
          await updateDoc(docRef, { uniqueCode: code });
        }
        loadedProfile = {
          name: data.name || '',
          phone: data.phone || '',
          address: data.address || '',
          email: user.email || '',
          gender: data.gender || 'optional',
          uniqueCode: code
        };
      } else {
        if (isRegisteringRef.current) {
          // Skip placeholder creation because handleSignup is writing the complete profile document!
          return;
        }
        const generatedCode = "KB-USER-" + Math.floor(1000 + Math.random() * 9000);
        // Create initial placeholder if not exists
        loadedProfile = {
          name: user.displayName || '',
          phone: '',
          address: '',
          email: user.email || '',
          gender: 'optional',
          uniqueCode: generatedCode
        };
        await setDoc(docRef, {
          name: loadedProfile.name,
          phone: loadedProfile.phone,
          address: loadedProfile.address,
          uid: user.uid,
          gender: 'optional',
          uniqueCode: generatedCode,
          createdAt: new Date().toISOString()
        });
      }
      
      setProfile(loadedProfile);
      setName(loadedProfile.name);
      setPhone(loadedProfile.phone);
      setAddress(loadedProfile.address);
      setGender((loadedProfile.gender as any) || 'optional');
      setUniqueCode(loadedProfile.uniqueCode || '');

      if (onProfileLoaded) {
        onProfileLoaded({
          name: loadedProfile.name,
          phone: loadedProfile.phone,
          address: loadedProfile.address
        });
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, `customers/${user.uid}`);
    }
  };

  // Handle traditional Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !password) {
      setErrorMsg('দয়া করে আপনার সচল মোবাইল নম্বর এবং পাসওয়ার্ড দুটিই লিখুন!');
      return;
    }
    setIsLoading(true);
    setErrorMsg('');
    try {
      const syntheticEmail = `${phone.trim()}@krishokbazar.com`;
      await signInWithEmailAndPassword(auth, syntheticEmail, password);
      setSuccessMsg('সফলভাবে লগইন হয়েছে!');
    } catch (err: any) {
      let msg = 'লগইন ব্যর্থ হয়েছে!';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        msg = 'ভুল মোবাইল নম্বর অথবা পাসওয়ার্ড দিয়েছেন!';
      } else {
        msg = err.message || msg;
      }
      setErrorMsg(msg);
      setIsLoading(false);
    }
  };

  // Handle traditional Signup
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !password || !name || !address) {
      setErrorMsg('দয়া করে আপনার নাম, মোবাইল নম্বর, প্রদেয় ডেলিভারি ঠিকানা এবং নিখুঁত পাসওয়ার্ড পূরণ করুন!');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('পাসওয়ার্ডটি ন্যূনতম ৬ অক্ষরের হতে হবে!');
      return;
    }
    setIsLoading(true);
    setErrorMsg('');
    isRegisteringRef.current = true;
    try {
      const syntheticEmail = `${phone.trim()}@krishokbazar.com`;
      const userCredential = await createUserWithEmailAndPassword(auth, syntheticEmail, password);
      const user = userCredential.user;
      
      const generatedCode = "KB-" + phone.trim().slice(-4) + "-" + Math.floor(1000 + Math.random() * 9000);
      const docRef = doc(db, 'customers', user.uid);
      await setDoc(docRef, {
        name,
        phone,
        address,
        gender,
        uniqueCode: generatedCode,
        uid: user.uid,
        createdAt: new Date().toISOString()
      });
      
      const loadedProfile = {
        name,
        phone,
        address,
        email: user.email || '',
        gender,
        uniqueCode: generatedCode
      };
      setProfile(loadedProfile);
      setUniqueCode(generatedCode);
      if (onProfileLoaded) {
        onProfileLoaded({ name, phone, address });
      }

      setSuccessMsg('অ্যাকাউন্ট সফলভাবে নিবন্ধন করা হয়েছে!');
    } catch (err: any) {
      let msg = 'নিবন্ধন ব্যর্থ হয়েছে!';
      if (err.code === 'auth/email-already-in-use') {
        msg = 'এই মোবাইল নম্বর দিয়ে ইতিমধ্যেই একটি অ্যাকাউন্ট খোলা হয়েছে!';
      } else {
        msg = err.message || msg;
      }
      setErrorMsg(msg);
      setIsLoading(false);
    } finally {
      isRegisteringRef.current = false;
    }
  };

  // Handle Google OAuth
  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      setSuccessMsg('গুগলের সাহায্যে সফলভাবে যুক্ত হয়েছেন!');
    } catch (err: any) {
      setErrorMsg('গুগল লগইন সম্পন্ন করা যায়নি: ' + (err?.message || 'ত্রুটি'));
      setIsLoading(false);
    }
  };

  // Process forgot password recovery
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('দয়া করে আপনার নিবন্ধিত ইমেইল ঠিকানা দিন!');
      return;
    }
    setIsLoading(true);
    setErrorMsg('');
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMsg('আপনার পাসওয়ার্ড রিসেটের লিংক ইমেইলে পাঠানো হয়েছে। ইনবক্স অথবা স্প্যাম ফোল্ডার চেক করুন!');
    } catch (err: any) {
      setErrorMsg('পাসওয়ার্ড লিংক পাঠাতে ব্যর্থ হয়েছে: ' + (err?.message || 'ত্রুটি'));
    } finally {
      setIsLoading(false);
    }
  };

  // Update Profile document details
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setIsSavingProfile(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const docRef = doc(db, 'customers', currentUser.uid);
      await updateDoc(docRef, {
        name,
        phone,
        address
      });
      const updatedProfile = {
        name,
        phone,
        address,
        email: currentUser.email || ''
      };
      setProfile(updatedProfile);
      
      if (onProfileLoaded) {
        onProfileLoaded({ name, phone, address });
      }

      setSuccessMsg('আপনার প্রোফাইল তথ্য সফলভাবে সংরক্ষণ করা হয়েছে!');
    } catch (err) {
      setErrorMsg('প্রোফাইল আপডেট করতে সমস্যা হয়েছে!');
      handleFirestoreError(err, OperationType.UPDATE, `customers/${currentUser.uid}`);
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Sign out user session
  const handleSignOut = async () => {
    if (!confirm('আপনি কি সত্যিই আপন অ্যাকাউন্ট থেকে লগআউট করতে চান?')) return;
    setIsLoading(true);
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Logout error', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Helpers to format status in Bengali with colors
  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <span className="bg-amber-100 text-amber-800 border border-amber-200 text-[10px] px-2 py-0.5 rounded-full font-bold">⏳ অপেক্ষমান (Pending)</span>;
      case 'confirmed':
        return <span className="bg-blue-100 text-blue-800 border border-blue-200 text-[10px] px-2 py-0.5 rounded-full font-bold">📦 অনুমোদিত (Confirmed)</span>;
      case 'packed':
        return <span className="bg-fuchsia-100 text-fuchsia-800 border border-fuchsia-200 text-[10px] px-2 py-0.5 rounded-full font-bold">🎁 প্যাক করা হয়েছে (Packed)</span>;
      case 'shipped':
        return <span className="bg-cyan-100 text-cyan-800 border border-cyan-200 text-[10px] px-2 py-0.5 rounded-full font-bold">🚚 শিপড করা হয়েছে (Shipped)</span>;
      case 'delivered':
        return <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] px-2 py-0.5 rounded-full font-bold">🚛 ডেলিভারি সম্পন্ন</span>;
      case 'completed':
        return <span className="bg-green-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">🎉 সফল সম্পন্ন (Completed)</span>;
      case 'cancelled':
        return <span className="bg-red-100 text-red-800 border border-red-200 text-[10px] px-2 py-0.5 rounded-full font-bold">❌ বাতিলকৃত (Cancelled)</span>;
      default:
        return <span className="bg-stone-100 text-stone-600 text-[10px] px-2 py-0.5 rounded-full">সাধারণ</span>;
    }
  };

  const getTrackerSteps = (status: string) => {
    const steps = [
      { key: 'confirmed', label: 'অনুমোদিত', en: 'Confirmed', num: 1 },
      { key: 'packed', label: 'প্যাকড', en: 'Packed', num: 2 },
      { key: 'shipped', label: 'শিপড', en: 'Shipped', num: 3 },
      { key: 'delivered', label: 'ডেলিভারড', en: 'Delivered', num: 4 }
    ];

    let activeIndex = -1; // -1 means pending
    if (status === 'confirmed') activeIndex = 0;
    else if (status === 'packed') activeIndex = 1;
    else if (status === 'shipped') activeIndex = 2;
    else if (status === 'delivered' || status === 'completed') activeIndex = 3;

    return { steps, activeIndex };
  };

  const renderOrderProgressBar = (status: string) => {
    if (status === 'cancelled') {
      return (
        <div className="bg-red-50 text-red-700 text-[10.5px] p-2.5 rounded-xl border border-red-100 flex items-center gap-1.5 font-bold font-sans">
          <span>❌ দুঃখিত, অর্ডারটি বাতিল করা হয়েছে (Cancelled)। যেকোনো প্রয়োজনে সরাসরি হটলাইনে ফোন করুন।</span>
        </div>
      );
    }

    const { steps, activeIndex } = getTrackerSteps(status);
    
    return (
      <div className="py-2 px-1 font-sans bg-stone-50/50 rounded-xl border border-stone-100/50">
        <div className="flex items-center justify-between relative mt-1 select-none">
          {/* Connection rail behind steps */}
          <div className="absolute left-6 right-6 top-3 h-[3px] bg-stone-200/70 rounded-full -translate-y-1/2 z-0">
            <div 
              className="h-full bg-emerald-600 rounded-full transition-all duration-500"
              style={{ 
                width: activeIndex === -1 
                  ? '0%' 
                  : `${(activeIndex / (steps.length - 1)) * 105}%` 
              }}
            />
          </div>

          {/* Dynamic Nodes */}
          {steps.map((step, idx) => {
            const isCompleted = idx <= activeIndex;
            const isActive = idx === activeIndex;
            
            return (
              <div key={step.key} className="flex flex-col items-center relative z-10 flex-1">
                <div 
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[9.5px] transition-all duration-300 border ${
                    isCompleted 
                      ? isActive 
                        ? 'bg-emerald-600 text-white border-emerald-700 ring-4 ring-emerald-100/80 scale-105 shadow-sm' 
                        : 'bg-emerald-800 text-white border-emerald-900'
                      : 'bg-white text-stone-400 border-stone-200'
                  }`}
                >
                  {isCompleted ? '✓' : step.num}
                </div>
                <span className={`text-[8.5px] font-black mt-1.5 transition-colors leading-none ${
                  isCompleted ? 'text-emerald-950' : 'text-stone-400'
                }`}>
                  {step.label}
                </span>
                <span className="text-[7.5px] text-stone-400 block font-light font-mono scale-90 -mt-0.5">
                  {step.en}
                </span>
              </div>
            );
          })}
        </div>
        
        {activeIndex === -1 && (
          <p className="text-[8.5px] text-center text-amber-700 font-bold bg-amber-50 rounded-lg py-1 mt-1.5 border border-amber-100/70 inline-block px-3 leading-none w-full">
            ⏳ অর্ডারটি পেন্ডিং অবস্থায় আছে; এডমিন দ্রুত এটি নিশ্চিত (Confirm) করছেন।
          </p>
        )}
      </div>
    );
  };

  return (
    <div className={fullScreen ? "w-full max-w-4xl mx-auto font-sans text-stone-800" : "fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-xs font-sans"}>
      <div className={fullScreen ? "bg-white w-full rounded-2xl border border-stone-200 flex flex-col overflow-hidden shadow-xs" : "bg-white w-full max-w-4xl h-[92vh] sm:h-[85vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-stone-200"}>
        {/* Core Layout Header */}
        <div className="px-6 py-4 border-b flex justify-between items-center bg-stone-50/50 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-50 rounded-xl text-emerald-850 flex items-center justify-center border border-emerald-100">
              <ShoppingBag size={18} />
            </span>
            <div>
              <h2 className="text-sm font-serif font-black text-stone-900 leading-tight">গ্রাহক অ্যাকাউন্ট পোর্টাল (Customer Account)</h2>
              <p className="text-[10px] text-stone-400 mt-0.5">আপনার অর্ডার ট্র্যাকিং এবং ব্যক্তিগত ঠিকানা ড্যাশবোর্ড</p>
            </div>
          </div>
          {!fullScreen && (
            <button 
              onClick={onClose} 
              className="p-1.5 hover:bg-stone-200/80 active:scale-95 rounded-full transition-all text-stone-400 hover:text-stone-700 cursor-pointer"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Dynamic Alert Messages */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200/80 rounded-xl text-[11px] text-red-900 font-bold flex gap-2 items-center">
            <span>⚠️ {errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-200/85 rounded-xl text-[11px] text-emerald-905 font-bold flex gap-2 items-center">
            <CheckCircle2 size={13} className="text-emerald-800" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Primary View Switcher */}
        <div className="flex-1 overflow-y-auto p-6">

          {isLoading ? (
            <div className="h-full flex flex-col items-center justify-center gap-3 py-16">
              <Loader2 className="animate-spin text-emerald-850" size={32} />
              <p className="text-xs text-stone-400 font-bold">ডাটাবেস কানেকশন লোড হচ্ছে...</p>
            </div>
          ) : authView === 'login' ? (
            /* ====================================
               TRADITIONAL EMAIL & SOCIAL SIGN IN 
               ==================================== */
            <div className="max-w-md mx-auto py-4 space-y-6">
              <div className="text-center space-y-1.5">
                <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-2.5 py-0.5 rounded-full">নিরাপদ ডোরওয়ে</span>
                <h3 className="text-lg font-serif font-black text-stone-800 pt-1">সহজে লগইন করুন</h3>
                <p className="text-xs text-stone-450">অর্ডার ট্র্যাক এবং প্রোফাইল ডিটেইল সেভ রাখতে আপনার অ্যাকাউন্ট খুলুন।</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4 text-left text-xs font-semibold">
                <div className="space-y-1">
                  <label className="text-[10px] text-stone-400 uppercase tracking-wider block pl-1">আপনার অ্যাকাউন্ট মোবাইল নম্বর *</label>
                  <div className="relative">
                    <Phone size={13} className="absolute left-3.5 top-3.5 text-stone-400" />
                    <input 
                      type="tel" 
                      required
                      placeholder="উদা: ০১৭xxxxxxxx"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-1 focus:ring-emerald-800"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] text-stone-400 uppercase tracking-wider block">গোপন পাসওয়ার্ড *</label>
                    <button 
                      type="button" 
                      onClick={() => setAuthView('forgot')}
                      className="text-[10px] text-emerald-850 hover:underline hidden"
                    >
                      পাসওয়ার্ড ভুলে গেছেন?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock size={13} className="absolute left-3.5 top-3.5 text-stone-400" />
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full pl-9 pr-10 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-1 focus:ring-emerald-800"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-stone-400 hover:text-stone-700 active:scale-95 transition-all"
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-emerald-800 hover:bg-emerald-950 text-white font-bold py-3 rounded-xl transition-all shadow-md mt-4 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <UserCheck size={14} />
                  <span>মোবাইল নম্বর দিয়ে প্রবেশ করুন</span>
                </button>
              </form>

              {/* Social Login Dividor */}
              <div className="relative flex items-center justify-center py-2">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-stone-100"></div></div>
                <span className="relative bg-white px-3 text-[10px] text-stone-400 uppercase font-black">অথবা সহজে গুগল দিয়ে সরাসরি</span>
              </div>

              {/* Social OAuth CTA */}
              <button 
                type="button"
                onClick={handleGoogleAuth}
                className="w-full bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700 font-bold py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 text-xs"
              >
                <img 
                  src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png" 
                  alt="Google Logo" 
                  className="h-3.5 object-contain" 
                  referrerPolicy="no-referrer"
                />
                <span>গুগল অ্যাকাউন্ট দিয়ে সাইন-ইন</span>
              </button>

              <div className="text-center pt-2 text-[11px] space-y-4">
                <div className="relative flex items-center justify-center py-1">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-stone-200"></div></div>
                  <span className="relative bg-white px-3 text-[9px] text-stone-400 uppercase font-bold">বা অ্যাকাউন্ট ছাড়াই ট্র্যাক করুন</span>
                </div>

                <button 
                  type="button"
                  onClick={() => { setErrorMsg(''); setSuccessMsg(''); setAuthView('lookup'); }}
                  className="w-full bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-bold py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 text-xs shadow-xs"
                >
                  <Search size={14} className="text-amber-700" />
                  <span>মোবাইল নম্বর দিয়ে কুইক অর্ডার ট্র্যাক</span>
                </button>

                <div className="pt-2">
                  <span className="text-stone-400">নতুন গ্রাহক? </span>
                  <button 
                    onClick={() => { setErrorMsg(''); setSuccessMsg(''); setAuthView('signup'); }}
                    className="text-emerald-850 font-bold hover:underline"
                  >
                    এখানে নতুন অ্যাকাউন্ট তৈরি করুন (Sign Up)
                  </button>
                </div>
              </div>
            </div>
          ) : authView === 'signup' ? (
            /* ====================================
               TRADITIONAL REGISTRATION SCREEN 
               ==================================== */
            <div className="max-w-md mx-auto py-2 space-y-6">
              <div className="text-center space-y-1.5">
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-0.5 rounded-full">নতুন মেম্বারশিপ</span>
                <h3 className="text-lg font-serif font-black text-stone-800 pt-1">অ্যাকাউন্ট রেজিস্টার করুন</h3>
                <p className="text-xs text-stone-450">নিরাপদ ও স্বাস্থ্যকর পচনশীল খামারের তাজা ফল ও সবজি দ্রুত অর্ডার করতে একাউন্ট খুলুন।</p>
              </div>

              <form onSubmit={handleSignup} className="space-y-3.5 text-left text-xs font-semibold">
                <div className="space-y-1">
                  <label className="text-[10px] text-stone-400 uppercase tracking-wider block pl-1">পূর্ণ নাম *</label>
                  <div className="relative">
                    <User size={13} className="absolute left-3.5 top-3.5 text-stone-400" />
                    <input 
                      type="text" 
                      required
                      placeholder="উদা: আব্দুল করিম"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-1 focus:ring-emerald-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-stone-400 uppercase tracking-wider block pl-1">সক্রিয় মোবাইল নম্বর *</label>
                    <div className="relative">
                      <Phone size={13} className="absolute left-3.5 top-3.5 text-stone-400" />
                      <input 
                        type="tel" 
                        required
                        placeholder="০১৭xxxxxxxx"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-1 focus:ring-emerald-800 font-mono text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-stone-400 uppercase tracking-wider block pl-1">লিঙ্গ (Gender) - ঐচ্ছিক</label>
                    <select
                      value={gender}
                      onChange={e => setGender(e.target.value as any)}
                      className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-1 focus:ring-emerald-800 text-xs text-stone-800 font-semibold"
                    >
                      <option value="optional">বাছাই করুন (Optional)</option>
                      <option value="male">পুরুষ (Male)</option>
                      <option value="female">মহিলা (Female)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-stone-400 uppercase tracking-wider block pl-1">গোপন পাসওয়ার্ড *</label>
                  <div className="relative">
                    <Lock size={13} className="absolute left-3.5 top-3.5 text-stone-400" />
                    <input 
                      type="password" 
                      required
                      placeholder="ন্যূনতম ৬ অক্ষর..."
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-1 focus:ring-emerald-800"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-stone-400 uppercase block pl-1">ডেলিভারি ঠিকানা *</label>
                  <div className="relative font-bold">
                    <textarea 
                      required
                      rows={2}
                      placeholder="উদা: ফ্ল্যাট বি-৩, রোড- ১, মিরপুর ১০, ঢাকা"
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-1 focus:ring-emerald-800 text-xs resize-none"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-emerald-800 hover:bg-emerald-950 text-white font-bold py-3 rounded-xl transition-all shadow-md mt-4 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Sparkles size={14} />
                  <span>অ্যাকাউন্ট তৈরি করুন (Register)</span>
                </button>
              </form>

              <div className="text-center text-[11px] pt-1">
                <span className="text-stone-400 font-semibold">ইতিমধ্যেই অ্যাকাউন্ট আছে? </span>
                <button 
                  onClick={() => { setErrorMsg(''); setSuccessMsg(''); setAuthView('login'); }}
                  className="text-emerald-850 font-bold hover:underline"
                >
                  এখানে ক্লিক করে লগইন করুন
                </button>
              </div>
            </div>
          ) : authView === 'forgot' ? (
            /* ====================================
               FORGOT PASSWORD RECOVERY 
               ==================================== */
            <div className="max-w-md mx-auto py-8 space-y-6">
              <div className="text-center space-y-1.5">
                <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-2.5 py-0.5 rounded-full">রিসেকভারী</span>
                <h3 className="text-lg font-serif font-black text-stone-800 pt-1">পাসওয়ার্ড রিসেট করুন</h3>
                <p className="text-xs text-stone-450">অ্যাকাউন্টের পাসওয়ার্ডটি ভুলে গেলে আপনার নিবন্ধিত ইমেইল ঠিকানাটি নিচে দিন।</p>
              </div>

              <form onSubmit={handleForgotPassword} className="space-y-4 text-left text-xs font-semibold">
                <div className="space-y-1">
                  <label className="text-[10px] text-stone-400 uppercase block pl-1">নিবন্ধিত ইমেইল *</label>
                  <div className="relative">
                    <Mail size={13} className="absolute left-3.5 top-3.5 text-stone-400" />
                    <input 
                      type="email" 
                      required
                      placeholder="example@gmail.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-1 focus:ring-emerald-800"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    type="button"
                    onClick={() => { setErrorMsg(''); setSuccessMsg(''); setAuthView('login'); }}
                    className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-750 font-bold py-2.5 rounded-xl text-center active:scale-97 cursor-pointer"
                  >
                    ফিরে যান
                  </button>
                  <button 
                    type="submit"
                    className="flex-[2] bg-emerald-850 hover:bg-emerald-950 text-white font-bold py-2.5 rounded-xl active:scale-97 cursor-pointer"
                  >
                    রিসেট লিংক পাঠান
                  </button>
                </div>
              </form>
            </div>
          ) : authView === 'lookup' ? (
            /* ====================================
               GUEST NO-LOGIN PHONE LOOKUP SYSTEM
               ==================================== */
            <div className="max-w-md mx-auto py-4 space-y-6 text-left">
              <div className="text-center space-y-1.5">
                <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-2.5 py-0.5 rounded-full font-sans">কুইক ট্র্যাকার</span>
                <h3 className="text-base font-serif font-black text-stone-800 pt-1">অর্ডার খোঁজ ও ট্র্যাকিং</h3>
                <p className="text-xs text-stone-450 leading-relaxed">লগইন বা একাউন্ট ছাড়াই শুধুমাত্র আপনার ক্রয়ের সময় ব্যবহৃত মোবাইল ফোন নম্বরটি দিয়ে পূর্ববর্তী সকল অর্ডারের বর্তমান অবস্থা ট্র্যাক করুন।</p>
              </div>

              <div className="bg-stone-50 border p-5 rounded-2xl space-y-4">
                <div className="space-y-1 text-left text-xs font-semibold">
                  <label className="text-[10px] text-stone-400 uppercase tracking-wider block pl-1">ব্যবহারকারী মোবাইল নম্বর</label>
                  <div className="relative">
                    <Phone size={13} className="absolute left-3.5 top-3.5 text-stone-400" />
                    <input 
                      type="tel" 
                      placeholder="উদা: 017xxxxxxxx"
                      value={lookupPhone}
                      onChange={e => setLookupPhone(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl outline-none focus:ring-1 focus:ring-emerald-800 font-mono text-xs"
                    />
                  </div>
                </div>

                <button 
                  onClick={handlePhoneLookup}
                  disabled={isLookingUp}
                  className="w-full bg-emerald-800 hover:bg-emerald-950 text-white font-bold py-2.5 rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5 text-xs font-sans"
                >
                  {isLookingUp ? (
                    <Loader2 className="animate-spin" size={13} />
                  ) : (
                    <Search size={13} />
                  )}
                  <span>অর্ডার ট্র্যাক করুন (Track Orders)</span>
                </button>
              </div>

              {/* Lookup results section */}
              {lookupRan && (
                <div className="space-y-4 text-left">
                  <h4 className="text-xs font-bold text-stone-800 border-b pb-1.5 flex justify-between items-center">
                    <span>🔍 প্রাপ্ত ফলাফল:</span>
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-[10px] font-mono">{lookupOrders.length}টি অর্ডার</span>
                  </h4>
                  {lookupOrders.length === 0 ? (
                    <p className="text-center py-6 text-stone-400 text-xs">
                      এই মোবাইল নম্বর সম্বলিত কোনো অর্ডার পাওয়া যায়নি। সঠিক নম্বরটি টাইপ করেছেন কি না চেক করুন।
                    </p>
                  ) : (
                    <div className="space-y-4 max-h-[35vh] overflow-y-auto pr-1">
                      {lookupOrders.map(order => (
                        <div key={order.id} className="bg-white border hover:border-stone-300 p-4 rounded-xl space-y-2.5 shadow-xs transition-all">
                          <div className="flex justify-between items-center text-[10px] text-stone-405 border-b pb-1.5">
                            <span>অর্ডার আইডি: <strong className="font-mono text-stone-800 text-[10.5px] font-bold">{order.id}</strong></span>
                            <span className="font-mono">{order.date || 'আজ'}</span>
                          </div>
                          
                          <div className="text-xs text-stone-700 space-y-1.5">
                            {order.items.map((it, idx) => (
                              <div key={idx} className="flex justify-between">
                                <span className="font-semibold">{it.title} x {it.quantity}</span>
                                <span className="font-mono font-bold text-stone-850">৳{it.price * it.quantity}</span>
                              </div>
                            ))}
                          </div>

                          <div className="flex justify-between items-center border-t border-stone-100 pt-2.5 mt-1 text-xs">
                            <span className="text-[10px] text-stone-500 font-bold">ডেলিভারিসহ মোট: <strong className="text-emerald-800 font-mono text-sm ml-1 font-semibold">৳{order.total}</strong></span>
                            {getStatusBadge(order.status)}
                          </div>
                          
                          {/* Progress bar inside guest lookup */}
                          <div className="pt-2">
                            {renderOrderProgressBar(order.status)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="text-center text-[11px] pt-1">
                <button 
                  onClick={() => { setErrorMsg(''); setSuccessMsg(''); setAuthView('login'); }}
                  className="text-emerald-850 font-bold hover:underline"
                >
                  ← পুনরায় লগইন স্ক্রিনে ফিরে যান
                </button>
              </div>
            </div>
          ) : (
            /* ====================================
               FULL CUSTOMER DASHBOARD VIEW 
               ==================================== */
            <div className="grid md:grid-cols-5 gap-6 text-left">
              {/* Left Column: Profile Card */}
              <div className="md:col-span-2 space-y-5">
                <div className="bg-stone-50 rounded-2xl border border-stone-200 p-5 space-y-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-100/30 rounded-full blur-2xl pointer-events-none -mr-4 -mt-4"></div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-emerald-800 text-amber-300 rounded-full font-serif font-black text-xl flex items-center justify-center border-4 border-white shadow-md">
                      {name ? name.substring(0, 1) : 'G'}
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-stone-900 text-sm leading-none">{name || 'সম্মানিত কাস্টমার'}</h4>
                      <p className="text-[10px] text-stone-400 mt-1 block font-mono">{phone || currentUser?.email}</p>
                      {uniqueCode && (
                        <div className="mt-1.5 inline-flex items-center gap-1 bg-amber-100 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider font-mono shadow-xs border border-amber-200">
                          👑 আইডি: {uniqueCode}
                        </div>
                      )}
                    </div>
                  </div>

                  <hr className="border-stone-200" />

                  <form onSubmit={handleUpdateProfile} className="space-y-3.5 text-xs font-semibold">
                    <h5 className="text-[10px] font-black text-stone-400 uppercase tracking-wider block">প্রোফাইল সেটিংস আপডেট</h5>
                    
                    <div className="space-y-1">
                      <label className="text-[9px] text-stone-400 block px-0.5">আপনার নাম *</label>
                      <input 
                        type="text"
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg outline-none focus:ring-1 focus:ring-emerald-800 text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] text-stone-400 block px-0.5">মোবাইল ফোন *</label>
                      <input 
                        type="tel"
                        required
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg outline-none focus:ring-1 focus:ring-emerald-800 text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] text-stone-400 block px-0.5">ডেলিভারি ঠিকানা ও জেলা *</label>
                      <textarea 
                        required
                        rows={3}
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg outline-none focus:ring-1 focus:ring-emerald-800 text-xs resize-none"
                      />
                    </div>

                    <div className="flex gap-2 pt-1 font-bold">
                      <button 
                        type="button" 
                        onClick={handleSignOut}
                        className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl py-2 flex items-center justify-center gap-1 cursor-pointer"
                        title="লগ আউট"
                      >
                        <LogOut size={12} />
                        <span>লগআউট</span>
                      </button>
                      <button 
                        type="submit"
                        disabled={isSavingProfile}
                        className="flex-[2] bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl py-2 flex items-center justify-center gap-1 shadow-sm transition-all cursor-pointer"
                      >
                        {isSavingProfile ? <Loader2 className="animate-spin" size={12} /> : null}
                        <span>তথ্য সংরক্ষণ</span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* Interactive Premium Notifications Slider Section */}
                <div className="bg-gradient-to-br from-stone-900 to-emerald-950 rounded-2xl border border-stone-800 p-4 text-white space-y-4 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/10 rounded-full blur-xl pointer-events-none -mr-4 -mt-4"></div>
                  
                  <div className="flex justify-between items-center pb-2 border-b border-white/10">
                    <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest flex items-center gap-1">
                      <Sparkles size={10} className="animate-ping" />
                      Premium Announcement Club
                    </span>
                    <span className="text-[9px] bg-white/10 px-2 py-0.5 rounded-full font-mono font-bold">
                      {currentOfferSlide + 1} / 3
                    </span>
                  </div>

                  <AnimatePresence mode="wait">
                    {currentOfferSlide === 0 && (
                      <motion.div 
                        key="offer_500"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.15 }}
                        className="space-y-2 text-xs"
                      >
                        <div className="inline-block bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                          ৳৫০০ সুপার বাস্কেট মেম্বারশিপ
                        </div>
                        <h4 className="font-serif font-black text-white text-sm">আনলিমিটেড ফ্রি হোম ডেলিভারি ও ৫% ক্যাশব্যাক!</h4>
                        <p className="text-[11px] text-stone-200 font-medium leading-relaxed">
                          ৳৫০০ প্রিমিয়াম প্যাকেজে আপনি পাবেন যেকোনো কেনাকাটায় আনলিমিটেড শতভার ফ্রি হোম ডেলিভারি এবং প্রতি অর্ডারে ৫% স্পেশাল ক্যাশব্যাক অফার!
                        </p>
                      </motion.div>
                    )}

                    {currentOfferSlide === 1 && (
                      <motion.div 
                        key="offer_700"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.15 }}
                        className="space-y-2 text-xs"
                      >
                        <div className="inline-block bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                          ৳৭০০ গোল্ডেন ফ্যামিলি মেম্বারশিপ
                        </div>
                        <h4 className="font-serif font-black text-white text-sm">সাপ্তাহিক কাটা সবজি + ১ কেজি প্রিমিয়াম মাংস ফ্রি!</h4>
                        <p className="text-[11px] text-stone-200 font-medium leading-relaxed">
                          ৳৭০০ গোল্ডেন পরিবার মেম্বারশিপ নিলে প্রতি সপ্তাহের রেডি-টু-কুক মিক্স কাটা সবজির সাথে পাবেন ম্যারিনেট করা ১ কেজি তাজা ব্রয়লার মুরগি সম্পূর্ণ ফ্রি!
                        </p>
                      </motion.div>
                    )}

                    {currentOfferSlide === 2 && (
                      <motion.div 
                        key="verification_notice"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.15 }}
                        className="space-y-2 text-xs"
                      >
                        <div className="inline-block bg-red-500/25 text-red-300 border border-red-500/30 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider">
                          ⚠️ পেমেন্ট ট্রানজেকশন ও অ্যাক্টিভেশন নোটিশ
                        </div>
                        <h4 className="font-serif font-black text-white text-sm">১২ থেকে ২৪ ঘণ্টার মধ্যে অ্যাকাউন্ট সচল</h4>
                        <p className="text-[10.5px] text-stone-250 font-semibold leading-relaxed">
                          প্রিমিয়াম ফি পরিশোধের পর আপনার bKash/Nagad পেমেন্ট ট্রানজেকশন আইডি প্রদান করুন। আমাদের টিম ব্যাংক স্টেটমেন্ট মিলিয়ে আগামী ১২-২৪ ঘণ্টার মধ্যে সার্ভিস সচল করে দিবে।
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex justify-between items-center pt-2 border-t border-white/10 text-xs">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((idx) => (
                        <span 
                          key={idx} 
                          className={`w-1.5 h-1.5 rounded-full transition-all ${
                            currentOfferSlide === idx ? 'bg-amber-400 w-3' : 'bg-white/20'
                          }`}
                        />
                      ))}
                    </div>

                    <div className="flex gap-1.5 font-bold">
                      <button 
                        onClick={() => setCurrentOfferSlide(prev => (prev === 0 ? 2 : prev - 1))}
                        className="p-1 hover:bg-white/10 active:scale-95 rounded-lg border border-white/10 text-stone-300 cursor-pointer"
                      >
                        পূর্ববর্তী
                      </button>
                      <button 
                        onClick={() => setCurrentOfferSlide(prev => (prev === 2 ? 0 : prev + 1))}
                        className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 active:scale-95 rounded-lg text-stone-900 border border-amber-400 font-extrabold cursor-pointer"
                      >
                        পরবর্তী (Next)
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Order Tracking */}
              <div className="md:col-span-3 space-y-4">
                <div className="flex justify-between items-center bg-stone-50 p-4 rounded-2xl border">
                  <div>
                    <h3 className="text-xs font-serif font-black text-stone-850">📦 আপনার খামার ট্র্যাকিং তথ্য</h3>
                    <p className="text-[9px] text-stone-400 mt-0.5">আপনার ফোন বা ইমেইল সম্পর্কিত পূর্ববর্তী সকল অর্ডার সরাসরি ট্রাক করুন</p>
                  </div>
                  <span className="bg-emerald-800 text-amber-300 font-extrabold text-[10px] px-2.5 py-1 rounded-full">{orders.length}টি অর্ডার</span>
                </div>

                {/* Lifetime Stats Bento Grid Summary */}
                <div className="grid grid-cols-3 gap-2.5">
                  <div className="bg-emerald-50/70 border border-emerald-100 p-3 rounded-2xl flex flex-col justify-between">
                    <span className="text-[8.5px] text-emerald-800 font-extrabold uppercase tracking-wider block">💰 মোট ব্যয়</span>
                    <div>
                      <span className="text-base font-black text-emerald-950 font-sans mt-1 block">৳ {stats.totalSpend}</span>
                      <span className="text-[7.5px] text-emerald-600 block">নিরাপদ খাদ্য ক্রয়</span>
                    </div>
                  </div>

                  <div className="bg-amber-50/70 border border-amber-100 p-3 rounded-2xl flex flex-col justify-between">
                    <span className="text-[8.5px] text-amber-900 font-extrabold uppercase tracking-wider block">🧺 প্যাকেজ ও লাভ</span>
                    <div>
                      <span className="text-base font-black text-amber-950 font-sans mt-1 block">{stats.packagesCount} টি</span>
                      <span className="text-[7.5px] text-amber-600 block">সাপ্তাহিক বাস্কেট</span>
                    </div>
                  </div>

                  <div className="bg-stone-50 border border-stone-200 p-3 rounded-2xl flex flex-col justify-between">
                    <span className="text-[8.5px] text-stone-650 font-extrabold uppercase tracking-wider block">👨‍🌾 খামারী সংখ্যা</span>
                    <div>
                      <span className="text-base font-black text-stone-900 font-sans mt-1 block">{stats.uniqueFarmers} জন</span>
                      <span className="text-[7.5px] text-stone-505 block">সরাসরি যুক্ত চাষী</span>
                    </div>
                  </div>
                </div>

                <SpendingTrendsChart orders={orders} />

                <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                  {orders.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-stone-250 flex flex-col items-center justify-center p-6">
                      <ShoppingBag size={32} className="text-stone-300 mb-3" />
                      <p className="text-stone-400 text-xs font-medium">কোন পূর্ববর্তী অর্ডার খুঁজে পাওয়া যায়নি।</p>
                      <p className="text-[10px] text-stone-450 mt-1 max-w-xs leading-relaxed">
                        আপনি প্রোফাইলের সঠিক মোবাইল নম্বরটি সেট করার পর অটোমেটিকলি ওই মোবাইল নম্বরের পূর্বের সকল অর্ডার ট্র্যাকিং এখানে প্রদর্শিত হবে।
                      </p>
                    </div>
                  ) : (
                    orders.map(order => (
                      <div 
                        key={order.id}
                        className="bg-white border rounded-2xl p-4 shadow-xs hover:border-emerald-800/40 transition-all space-y-3"
                      >
                        {/* Order Header */}
                        <div className="flex flex-wrap justify-between items-center gap-1.5 border-b pb-2.5">
                          <div>
                            <span className="text-stone-400 text-[10px]">অর্ডার আইডি:</span>
                            <span className="text-[11px] text-stone-900 font-bold ml-1 font-mono">{order.id}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(order.status)}
                          </div>
                        </div>

                        {/* Order details products info items */}
                        <div className="space-y-1.5 text-xs text-stone-600">
                          {order.items.map((item, id) => (
                            <div key={id} className="flex justify-between items-center">
                              <span className="font-semibold">{item.title} x {item.quantity}</span>
                              <span className="font-mono text-[10px]">৳{item.price * item.quantity}</span>
                            </div>
                          ))}
                        </div>

                        {/* Realtime Status Progress Bar Segment */}
                        {renderOrderProgressBar(order.status)}

                        <hr className="border-stone-100" />

                        {/* Order Bottom status summary */}
                        <div className="flex justify-between items-center text-[10px] text-stone-400">
                          <div>
                            <span>তারিখ: {order.date}</span>
                          </div>
                          <div>
                            <span className="text-stone-500 font-bold">সর্বমোট প্রদেয়: ৳{order.total}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// BENGALI TRANSLATION & DATE PARSING HELPERS
// ==========================================

const bnToEnMap: Record<string, string> = {
  '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
  '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
};

function translateBnToEn(str: string): string {
  return str.replace(/[০-৯]/g, (match) => bnToEnMap[match] || match);
}

function toBnNo(num: number | string): string {
  return String(num);
}

function toBnPrice(num: number): string {
  return num.toLocaleString('en-US'); // Keep standard English numerals globally
}

function parseOrderDate(dateStr: string): { year: number; month: number } | null {
  if (!dateStr) return null;
  const translated = translateBnToEn(dateStr);
  const datePartOnly = translated.split(/[\s,]+/)[0];
  
  if (datePartOnly.includes('/')) {
    const parts = datePartOnly.split('/');
    if (parts.length >= 3) {
      let d = parseInt(parts[0], 10);
      let m = parseInt(parts[1], 10);
      let y = parseInt(parts[2], 10);
      
      // If first part is 4 digits, it is YYYY/MM/DD
      if (parts[0].length === 4) {
        y = parseInt(parts[0], 10);
        m = parseInt(parts[1], 10);
        d = parseInt(parts[2], 10);
      }
      
      if (!isNaN(y) && !isNaN(m) && y > 1900 && m >= 1 && m <= 12) {
        return { year: y, month: m };
      }
    }
  }

  // Fallback to standard JS Date parser
  try {
    const parsedDate = new Date(translated);
    if (!isNaN(parsedDate.getTime())) {
      return { year: parsedDate.getFullYear(), month: parsedDate.getMonth() + 1 };
    }
  } catch (e) {
    // skip
  }
  return null;
}

// ==========================================
// RECHARTS SPENDING TRENDS ANALYSIS COMPONENT
// ==========================================

function SpendingTrendsChart({ orders }: { orders: Order[] }) {
  const monthNamesBn = [
    'জানু', 'ফেব্রু', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
    'জুলাই', 'আগস্ট', 'সেপ্টে', 'অক্টো', 'নভে', 'ডিসে'
  ];
  
  const chartData = [];
  const today = new Date();
  
  // Calculate preceding 6 months
  for (let i = 5; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const m = d.getMonth() + 1;
    const y = d.getFullYear();
    const key = `${y}-${m.toString().padStart(2, '0')}`;
    const monthLabel = `${monthNamesBn[d.getMonth()]} ${toBnNo(String(y).substring(2))}`;
    chartData.push({
      key,
      monthLabel,
      amount: 0,
      orderCount: 0
    });
  }

  // Aggregation
  let totalSpending = 0;
  let activeMonthsCount = 0;
  
  orders.forEach(order => {
    const parsed = parseOrderDate(order.date);
    if (parsed) {
      const { year, month } = parsed;
      const key = `${year}-${month.toString().padStart(2, '0')}`;
      const bucket = chartData.find(item => item.key === key);
      if (bucket) {
        bucket.amount += order.total;
        bucket.orderCount += 1;
        totalSpending += order.total;
      }
    }
  });

  chartData.forEach(item => {
    if (item.amount > 0) {
      activeMonthsCount++;
    }
  });

  const avgSpending = activeMonthsCount > 0 ? Math.round(totalSpending / activeMonthsCount) : 0;
  const maxSpendItem = chartData.reduce((prev, current) => prev.amount > current.amount ? prev : current, chartData[0]);

  return (
    <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-4 space-y-3 shadow-xs">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="text-xs font-serif font-black text-stone-800 flex items-center gap-1.5">
            <span className="w-1.5 h-3 bg-emerald-800 rounded-full inline-block"></span>
            ব্যয় বিশ্লেষণ ও বাজেট ট্র্যাকার (৬ মাস)
          </h4>
          <p className="text-[9px] text-stone-400 mt-0.5">গত ৬ মাসে আপনার অর্ডারের মোট খরচের গ্রাফিক্যাল সামারি</p>
        </div>
        <div className="text-right">
          <span className="text-[8px] text-stone-400 uppercase tracking-widest block font-bold">মোট ব্যয়কৃত</span>
          <span className="text-xs font-black text-emerald-850 font-mono">৳{toBnPrice(totalSpending)}</span>
        </div>
      </div>

      {totalSpending > 0 && (
        <div className="grid grid-cols-3 gap-2 py-2 border-y border-stone-100/70 text-center">
          <div>
            <span className="text-[8px] text-stone-450 block">মাসিক গড় ব্যয়</span>
            <span className="text-[11px] font-bold text-stone-850 font-mono">৳{toBnPrice(avgSpending)}</span>
          </div>
          <div>
            <span className="text-[8px] text-stone-450 block">সর্বোচ্চ ব্যয় মাস</span>
            <span className="text-[11px] font-bold text-emerald-850">{maxSpendItem.amount > 0 ? maxSpendItem.monthLabel : 'N/A'}</span>
          </div>
          <div>
            <span className="text-[8px] text-stone-450 block">সর্বমোট অর্ডার</span>
            <span className="text-[11px] font-bold text-stone-850 font-mono">{toBnNo(orders.length)}টি</span>
          </div>
        </div>
      )}

      <div className="w-full h-36 pt-1 text-[9px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="spendingColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#065f46" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="#065f46" stopOpacity={0.0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f5" />
            <XAxis 
              dataKey="monthLabel" 
              tickLine={false}
              axisLine={{ stroke: '#e9ecef' }}
              tick={{ fill: '#6c757d', fontSize: 9 }}
            />
            <YAxis 
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#6c757d', fontSize: 9 }}
              tickFormatter={(value) => `৳${toBnNo(value)}`}
            />
            <Tooltip 
              formatter={(value: any) => [`৳${toBnPrice(Number(value))}`, 'খরচ']}
              labelFormatter={(label) => `মাস: ${label}`}
              contentStyle={{ 
                backgroundColor: '#ffffff', 
                borderColor: '#e2e8f0', 
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
                fontSize: '11px',
                fontFamily: 'sans-serif'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="amount" 
              stroke="#047857" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#spendingColor)" 
            />
          </AreaChart>
        </ResponsiveContainer>

        {totalSpending === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-[0.5px] rounded-xl">
            <p className="text-[9px] text-stone-400 font-bold bg-white px-2.5 py-1.5 rounded-lg border shadow-xs">
              📊 পর্যাপ্ত অর্ডারের তথ্য নেই (রি-চার্ট দেখতে একটি অর্ডার করুন)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

