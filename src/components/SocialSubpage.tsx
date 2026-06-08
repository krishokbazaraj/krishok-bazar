import React, { useState } from 'react';
import { 
  Heart, MessageCircle, Send, Plus, Image as ImageIcon, Smile, 
  MapPin, Clock, Tractor, ArrowRight, CornerDownRight, CheckCircle2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { doc, updateDoc, setDoc, arrayUnion, arrayRemove, collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { ImageUploadZone } from './ImageUploadZone';

interface SocialSubpageProps {
  farmerPosts: any[];
  isLoggedInFarmer: boolean;
  loggedInFarmer: any;
  isAdmin: boolean;
  currentLang: 'bn' | 'en';
  t: (bn: string, en: string) => string;
}

export default function SocialSubpage({ 
  farmerPosts, 
  isLoggedInFarmer, 
  loggedInFarmer, 
  isAdmin, 
  currentLang,
  t 
}: SocialSubpageProps) {
  const [postBody, setPostBody] = useState('');
  const [postImg, setPostImg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
  const [commentTextState, setCommentTextState] = useState<Record<string, string>>({});

  // Formulate customer id for likes tracking
  const getVisitorId = () => {
    let visitorId = localStorage.getItem('krishok_visitor_id');
    if (!visitorId) {
      visitorId = 'vid_' + Math.random().toString(36).substring(2, 10);
      localStorage.setItem('krishok_visitor_id', visitorId);
    }
    return visitorId;
  };

  const visitorId = getVisitorId();

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postBody.trim()) {
      alert(t('পোস্টের লেখা খালি হতে পারে না!', 'Post body cannot be empty!'));
      return;
    }

    setIsSubmitting(true);
    try {
      // Determine author metadata
      let authorName = t('কৃষক বাজার অতিথি', 'Krishok Bazar Guest');
      let authorAvatar = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100';
      let authorPhone = '';
      let authorId = 0;

      if (isAdmin) {
        authorName = t('অ্যাডমিন ম্যানেজার', 'Admin Manager');
        authorAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100';
      } else if (isLoggedInFarmer && loggedInFarmer) {
        authorName = loggedInFarmer.name;
        authorAvatar = loggedInFarmer.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100';
        authorPhone = loggedInFarmer.phone || '';
        authorId = loggedInFarmer.id;
      }

      const newPost = {
        farmerId: authorId,
        farmerName: authorName,
        farmerAvatar: authorAvatar,
        farmerPhone: authorPhone,
        body: postBody,
        img: postImg || '',
        timestamp: new Date().toISOString(),
        likes: 0,
        likedBy: [],
        comments: [],
        verified: true,
        approved: true
      };

      await addDoc(collection(db, 'farmer_posts'), newPost);
      setPostBody('');
      setPostImg('');
      alert(t('পোস্টটি সফলভাবে পাবলিশ হয়েছে!', 'Post published successfully!'));
    } catch (err: any) {
      console.error('Error creating post:', err);
      alert(t('পোস্ট করতে সমস্যা হয়েছে!', 'Failed to post!'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleLike = async (post: any) => {
    try {
      const postRef = doc(db, 'farmer_posts', post.id);
      
      const currentLikedBy = Array.isArray(post.likedBy) ? [...post.likedBy] : [];
      let nextLikedBy = [];
      let nextLikes = post.likes || 0;
      
      if (currentLikedBy.includes(visitorId)) {
        nextLikedBy = currentLikedBy.filter(id => id !== visitorId);
        nextLikes = Math.max(0, nextLikes - 1);
      } else {
        nextLikedBy = [...currentLikedBy, visitorId];
        nextLikes = nextLikes + 1;
      }

      const baseData = {
        farmerId: post.farmerId || null,
        farmerName: post.farmerName || '',
        farmerAvatar: post.farmerAvatar || '',
        body: post.body || '',
        img: post.img || '',
        timestamp: post.timestamp || new Date().toISOString(),
        likes: nextLikes,
        likedBy: nextLikedBy,
        comments: post.comments || []
      };

      await setDoc(postRef, baseData, { merge: true });
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const handleCommentSubmit = async (postId: string) => {
    const text = commentTextState[postId] || '';
    if (!text.trim()) return;

    let authorName = t('অতিথি ক্রেতা', 'Guest Customer');
    let authorAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100';

    if (isAdmin) {
      authorName = t('অ্যাডমিন ম্যানেজার', 'Admin Manager');
    } else if (isLoggedInFarmer && loggedInFarmer) {
      authorName = loggedInFarmer.name;
      authorAvatar = loggedInFarmer.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100';
    }

    const newComment = {
      id: 'com_' + Math.random().toString(36).substring(2, 9),
      author: authorName,
      avatar: authorAvatar,
      text: text,
      timestamp: new Date().toISOString()
    };

    try {
      const postRef = doc(db, 'farmer_posts', postId);
      const post = farmerPosts.find(p => p.id === postId);
      if (post) {
        const currentComments = Array.isArray(post.comments) ? [...post.comments] : [];
        const baseData = {
          farmerId: post.farmerId || null,
          farmerName: post.farmerName || '',
          farmerAvatar: post.farmerAvatar || '',
          body: post.body || '',
          img: post.img || '',
          timestamp: post.timestamp || new Date().toISOString(),
          likes: post.likes || 0,
          likedBy: post.likedBy || [],
          comments: [...currentComments, newComment]
        };

        await setDoc(postRef, baseData, { merge: true });
        setCommentTextState(prev => ({ ...prev, [postId]: '' }));
      }
    } catch (err) {
      console.error('Error post comment:', err);
    }
  };

  const formattedDate = (isoStr: string) => {
    try {
      return new Date(isoStr).toLocaleDateString(currentLang === 'bn' ? 'bn-BD' : 'en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoStr;
    }
  };

  const canPost = isAdmin || isLoggedInFarmer;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.2 }}
      className="max-w-3xl mx-auto space-y-6 text-left px-2 sm:px-4 py-4"
    >
      {/* Intro Header banner */}
      <div className="bg-gradient-to-tr from-emerald-800 to-emerald-950 text-white rounded-[24px] sm:rounded-[32px] p-6 sm:p-10 text-center space-y-3 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-44 h-44 bg-white/5 rounded-full filter blur-xl -mr-12 -mt-12" />
        <span className="text-4.5xl animate-pulse inline-block mb-1">💬</span>
        <h2 className="text-xl sm:text-2xl font-serif font-black tracking-tight select-none">
          {t('কৃষকদের মুক্ত সামাজিক ফিড ও ডায়েরি', 'Farmers Free Community Social Feed')}
        </h2>
        <p className="max-w-xl mx-auto text-xs text-emerald-150 leading-relaxed font-sans font-medium">
          {t('কৃষকদের মাঠ, ফসলের বাগান, উত্তোলন প্রক্রিয়া ও অর্গানিক জীবন নিয়ে সরাসরি শেয়ারিং ওয়াল। এখানে কৃষক ও ভোক্তারা লাইভ কমেন্টে যুক্ত থাকতে পারেন।', 
             'A direct sharing wall of farmers about fields, farms, harvest times, and organic lifestyle. Farmers and consumers can interact live here.')}
        </p>
      </div>

      {/* Post creator wall entry */}
      {canPost ? (
        <form onSubmit={handlePostSubmit} className="bg-white rounded-2xl border border-stone-200/80 shadow-xs p-4 sm:p-5 space-y-4">
          <div className="flex items-center gap-3 border-b border-stone-105 pb-3">
            <img 
              src={isAdmin ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100' : (loggedInFarmer?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100')} 
              alt="Author portrait" 
              className="w-10 h-10 rounded-full object-cover border border-emerald-100"
            />
            <div>
              <h4 className="font-serif font-black text-xs text-stone-900 leading-tight">
                {isAdmin ? t('ম্যানেজার প্যানেল অ্যাকাউন্ট', 'Manager Panel Account') : loggedInFarmer?.name}
              </h4>
              <p className="text-[10px] text-emerald-700 font-extrabold flex items-center gap-1 mt-0.5 select-none animate-pulse">
                <Tractor size={10} className="text-emerald-800" />
                <span>{t('লাইভ সামাজিক ড্যাশবোর্ড সচল', 'Live Social Dashboard Active')}</span>
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <textarea
              required
              rows={3}
              placeholder={isAdmin 
                ? t('সম্মানিত গ্রাহক ও কৃষকদের উদ্দেশ্যে নতুন ঘোষণা বা কৃষি টিপস লিখুন...', 'Write a new announcement or farm tip for customers & farmers...') 
                : t('আপনার খামারের গল্প, আজকের কাজ বা ফসলের উত্তোলনের আপডেট গ্রাহকদের সাথে শেয়ার করুন...', 'Share your farm story, today\'s action, or harvest updates with customers...')
              }
              value={postBody}
              onChange={e => setPostBody(e.target.value)}
              className="w-full text-xs font-sans p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-emerald-700 outline-none text-stone-800 leading-relaxed"
            />

            {/* Direct Image upload */}
            <div className="space-y-1">
              <ImageUploadZone 
                label={t('আপনার খামার বা ফসলের একটি ছবি যুক্ত করুন (ঐচ্ছিক আপলোড)', 'Attach a photo of your farm/crop (Optional Upload)')}
                initialImage={postImg}
                onImageUploaded={(b64) => setPostImg(b64)}
              />
              <div className="pt-1 select-none">
                <input 
                  type="text" 
                  placeholder={t('অথবা ওযেব লিঙ্ক / ইউআরএল থাকলে এখানে বসান', 'Or paste any image web link/URL here')}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg outline-none text-[11px] font-mono text-stone-700 focus:ring-1 focus:ring-emerald-700"
                  value={postImg}
                  onChange={e => setPostImg(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-emerald-800 hover:bg-emerald-900 text-white font-black text-xs px-5 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:bg-stone-200 disabled:text-stone-400"
            >
              <Send size={12} />
              <span>{isSubmitting ? t('পাবলিশ হচ্ছে...', 'Publishing...') : t('পাবলিশ করুন (Post Updates)', 'Post Updates')}</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-amber-50/70 border border-amber-200/50 rounded-2xl p-4 flex items-start gap-3 select-none">
          <span className="text-xl">👩‍🌾</span>
          <div className="text-xs space-y-1 text-amber-955">
            <span className="font-bold flex items-center gap-1">📢 {t('সামাজিক পোস্ট করার অনুমতি', 'Social Wall Permissions')}</span>
            <p className="text-[10.5px] leading-relaxed text-stone-500 font-medium">
              {t('কৃষক স্যোশাল ফিডে শুধুমাত্র যাচাইকৃত নিবন্ধিত কৃষকরা এবং অ্যাডমিনরা নতুন পোস্ট করতে পারেন। আপনি যদি একজন কৃষক হন, অনুগ্রহ করে নিজের অ্যাকাউন্ট দিয়ে লগইন করুন।', 
                 'Only verified registered farmers and admins can publish new stories on this wall. If you are a crop farmer, please log in to write.')}
            </p>
          </div>
        </div>
      )}

      {/* Vertical stream of feed cards */}
      <div className="space-y-5">
        {farmerPosts.length === 0 ? (
          <div className="bg-white rounded-2xl border p-12 text-center text-stone-450 space-y-2">
            <MessageCircle size={36} className="mx-auto opacity-20 mb-1" />
            <p className="text-xs font-bold leading-tight select-none">{t('কোনো সামাজিক পোস্ট পাওয়া যায়নি!', 'No social posts available yet!')}</p>
            <p className="text-[10px] text-stone-400 font-medium leading-none">{t('কৃষকরা পোস্ট করলে এখানে লাইভ দেখতে পাবেন।', 'When farmers post, they appear here instantly.')}</p>
          </div>
        ) : (
          farmerPosts.map(post => {
            const hasLiked = post.likedBy?.includes(visitorId);
            const showComments = activeCommentId === post.id;
            const commentsCount = post.comments?.length || 0;

            return (
              <motion.div 
                key={post.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl border border-stone-200/90 shadow-xs p-4 sm:p-5 space-y-3.5 hover:shadow-xs transition-shadow"
              >
                {/* Author row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img 
                      src={post.farmerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'} 
                      alt={post.farmerName} 
                      className="w-10 h-10 rounded-full object-cover border border-stone-200 shadow-2xs"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-serif font-bold text-xs text-stone-800 leading-tight">
                          {post.farmerName}
                        </h4>
                        <span className="bg-emerald-50 text-emerald-800 text-[8px] font-black px-1.5 py-0.5 rounded-full border border-emerald-150 inline-flex items-center gap-0.5 select-none">
                          <CheckCircle2 size={7} />
                          <span>{t('ভেরিফাইড', 'Verified')}</span>
                        </span>
                      </div>
                      <span className="text-[10px] text-stone-400 font-medium flex items-center gap-1 mt-0.5">
                        <Clock size={10} className="text-stone-300" />
                        <span>{formattedDate(post.timestamp)}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content body text */}
                <p className="text-xs text-stone-700 leading-relaxed font-sans whitespace-pre-line text-justify">
                  {post.body}
                </p>

                {/* Photo attachment if available */}
                {post.img && (
                  <div className="rounded-xl overflow-hidden aspect-video border bg-stone-50">
                    <img 
                      src={post.img} 
                      alt="Social photo detail" 
                      className="w-full h-full object-cover hover:scale-101 transition-transform" 
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}

                {/* Action buttons (Like & Comment Toggles) */}
                <div className="flex items-center gap-6 border-y border-stone-105 py-2.5 text-xs text-stone-500 select-none">
                  <button 
                    onClick={() => handleToggleLike(post)}
                    className={`flex items-center gap-1.5 font-extrabold hover:text-rose-600 transition-colors cursor-pointer ${hasLiked ? 'text-rose-600' : ''}`}
                  >
                    <Heart size={14} className={hasLiked ? 'fill-rose-600' : ''} />
                    <span>{post.likes || 0}</span>
                  </button>

                  <button 
                    onClick={() => setActiveCommentId(showComments ? null : post.id)}
                    className={`flex items-center gap-1.5 font-extrabold hover:text-emerald-800 transition-colors cursor-pointer ${showComments ? 'text-emerald-800' : ''}`}
                  >
                    <MessageCircle size={14} />
                    <span>{commentsCount} {t('কমেন্ট', 'Comments')}</span>
                  </button>
                </div>

                {/* Comments box region */}
                {showComments && (
                  <div className="space-y-4 pt-2">
                    {commentsCount > 0 && (
                      <div className="space-y-2.5 pl-2 sm:pl-4 border-l-2 border-stone-100">
                        {post.comments.map((comment: any, cIdx: number) => (
                          <div key={comment.id || cIdx} className="flex gap-2.5 items-start text-xs pt-1">
                            <img 
                              src={comment.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100'} 
                              alt={comment.author} 
                              className="w-7 h-7 rounded-full object-cover border border-stone-100"
                            />
                            <div className="bg-stone-50/80 rounded-2xl p-2.5 sm:px-3.5 flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                                <span className="font-bold text-[11px] text-stone-900 leading-none">{comment.author}</span>
                                <span className="text-[8px] text-stone-400 font-medium font-sans">
                                  {formattedDate(comment.timestamp)}
                                </span>
                              </div>
                              <p className="text-[11px] text-stone-650 leading-relaxed font-sans">{comment.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* New comment input form */}
                    <div className="flex gap-2 Items-center pt-1.5">
                      <input 
                        type="text"
                        placeholder={t('কমেন্ট লিখুন...', 'Write a response...')}
                        className="flex-1 px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none text-xs text-stone-800 focus:ring-1 focus:ring-emerald-700"
                        value={commentTextState[post.id] || ''}
                        onChange={e => {
                          const val = e.target.value;
                          setCommentTextState(prev => ({ ...prev, [post.id]: val }));
                        }}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            handleCommentSubmit(post.id);
                          }
                        }}
                      />
                      <button 
                        onClick={() => handleCommentSubmit(post.id)}
                        className="bg-emerald-800 hover:bg-emerald-900 text-white p-2.5 rounded-xl cursor-pointer"
                      >
                        <Send size={12} />
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}
