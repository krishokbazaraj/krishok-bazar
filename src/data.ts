import { Product, Farmer, Video, Review, HeroBanner, PromoOffer } from './types';

// Exactly 50 Verified Farmers (representing both genders with locations and specific specialties)
export const INITIAL_FARMERS: Farmer[] = [
  { id: 1, name: 'করিম মিয়া', location: 'বগুড়া', products: 'আলু, গাজর, লাউ', rating: 4.9, sales: 1250, avatar: 'male_1', gender: 'male', verified: true },
  { id: 2, name: 'রহিমা বেগম', location: 'যশোর', products: 'মিষ্টি কুমড়া, বেগুন, লাল শাক', rating: 4.8, sales: 980, avatar: 'female_1', gender: 'female', verified: true },
  { id: 3, name: 'শামীম আহমেদ', location: 'নরসিংদী', products: 'বেগুন, করলা, ঝিঙা', rating: 4.7, sales: 540, avatar: 'male_2', gender: 'male', verified: true },
  { id: 4, name: 'মিনারা বেগম', location: 'দিনাজপুর', products: 'লিচু, আম, আনারস', rating: 4.9, sales: 720, avatar: 'female_2', gender: 'female', verified: true },
  { id: 5, name: 'আলमগীর হোসেন', location: 'সুনামগঞ্জ', products: 'শিং মাছ, মাগুর, বোয়াল', rating: 4.6, sales: 310, avatar: 'male_3', gender: 'male', verified: true },
  { id: 6, name: 'রেজাউল করিম', location: 'বাগেরহাট', products: 'চিংড়ি, ইলিশ, পাবদা', rating: 4.8, sales: 1100, avatar: 'male_4', gender: 'male', verified: true },
  { id: 7, name: 'সুলতানা রাজিয়া', location: 'মৌলভীবাজার', products: 'চা পাতা, জাম্বুরা, মধু', rating: 4.9, sales: 420, avatar: 'female_3', gender: 'female', verified: true },
  { id: 8, name: 'আকরাম আলী', location: 'রাজশাহী', products: 'ফজলি আম, হিমসাগর, ল্যাংড়া', rating: 4.9, sales: 1560, avatar: 'male_5', gender: 'male', verified: true },
  { id: 9, name: 'ফারহানা ইয়াসমিন', location: 'নাটোর', products: 'লিচু ফুলের মধু, কাটারিভোগ চাল', rating: 4.8, sales: 640, avatar: 'female_4', gender: 'female', verified: true },
  { id: 10, name: 'আব্দুর রহিম', location: 'শেরপুর', products: 'লাল চাল, চিনিগুঁড়া চাল', rating: 4.7, sales: 830, avatar: 'male_6', gender: 'male', verified: true },
  { id: 11, name: 'সেলিনা পারভীন', location: 'মুন্সিগঞ্জ', products: 'আলু, মিষ্টি দই, দুধ', rating: 4.8, sales: 910, avatar: 'female_5', gender: 'female', verified: true },
  { id: 12, name: 'দুলাল শেখ', location: 'ফরিদপুর', products: 'পেঁয়াজ, রসুন, মসলা গুঁড়া', rating: 4.6, sales: 750, avatar: 'male_7', gender: 'male', verified: true },
  { id: 13, name: 'রাবেয়া খাতুন', location: 'কুষ্টিয়া', products: 'তিল তেল, ঘি, খাটি বাখন', rating: 4.9, sales: 480, avatar: 'female_6', gender: 'female', verified: true },
  { id: 14, name: 'জাহাঙ্গীর আলম', location: 'রংপুর', products: 'হাঁসের ডিম, দেশি মুরগির ডিম', rating: 4.7, sales: 620, avatar: 'male_8', gender: 'male', verified: true },
  { id: 15, name: 'আসমা বেগম', location: 'পাবনা', products: 'গরুর তরল দুধ, মিষ্টি দই, টক দই', rating: 4.9, sales: 1340, avatar: 'female_7', gender: 'female', verified: true },
  { id: 16, name: 'রফিকুল ইসলাম', location: 'টাঙ্গাইল', products: 'চামচাম, সরিষা মধু, আটাশ চাল', rating: 4.8, sales: 880, avatar: 'male_9', gender: 'male', verified: true },
  { id: 17, name: 'খাদিজা আক্তার', location: 'ময়মনসিংহ', products: 'কলমি শাক, পুঁই শাক, সর্ষে শাক', rating: 4.7, sales: 390, avatar: 'female_8', gender: 'female', verified: true },
  { id: 18, name: 'মিলন মন্ডল', location: 'সাতক্ষীরা', products: 'সুন্দরবনের খলিশা মধু, চাকের মধু', rating: 4.9, sales: 1050, avatar: 'male_10', gender: 'male', verified: true },
  { id: 19, name: 'তাসলিমা আক্তার', location: 'কুমিল্লা', products: 'দেশি মুরগির ডিম, কোয়েলের ডিম', rating: 4.8, sales: 510, avatar: 'female_9', gender: 'female', verified: true },
  { id: 20, name: 'সাইফুল ইসলাম', location: 'জামালপুর', products: 'লাল চাল, মসলা গুঁড়া, হলুদ', rating: 4.6, sales: 430, avatar: 'male_11', gender: 'male', verified: true },
  { id: 21, name: 'মনোয়ারা বেগম', location: 'পটুয়াখালী', products: 'রূপচাঁদা মাছ, পাবদা, ইলিশ', rating: 4.9, sales: 670, avatar: 'female_10', gender: 'female', verified: true },
  { id: 22, name: 'আব্দুল ওদুদ', location: 'ভোলা', products: 'মহিষের দুধ, খাঁটি দই', rating: 4.8, sales: 780, avatar: 'male_12', gender: 'male', verified: true },
  { id: 23, name: 'মর্জিনা বেগম', location: 'কক্সবাজার', products: 'শুটকি মাছ, চিংড়ি, লাল চাল', rating: 4.7, sales: 520, avatar: 'female_11', gender: 'female', verified: true },
  { id: 24, name: 'লোকমান হাকিম', location: 'বান্দরবান', products: 'পাহাড়ি বুনো মধু, আদা, হলুদ', rating: 4.9, sales: 360, avatar: 'male_13', gender: 'male', verified: true },
  { id: 25, name: 'সালমা খাতুন', location: 'সিলেট', products: 'গ্রিন টি, খাঁটি মসলা, লেবু', rating: 4.8, sales: 440, avatar: 'female_12', gender: 'female', verified: true },
  { id: 26, name: 'হাবিবুর রহমান', location: 'পঞ্চগড়', products: 'মধু, অর্গানিক চা পাতা, কালোজিরা', rating: 4.7, sales: 490, avatar: 'male_14', gender: 'male', verified: true },
  { id: 27, name: 'শাহনাজ পারভীন', location: 'নারায়ণগঞ্জ', products: 'সালাদ কম্বো, গাজর, শসা', rating: 4.8, sales: 820, avatar: 'female_13', gender: 'female', verified: true },
  { id: 28, name: 'মাসুদ রানা', location: 'কুড়িগ্রাম', products: 'দেশি পেঁয়াজ, রসুন, আটাশ চাল', rating: 4.6, sales: 590, avatar: 'male_15', gender: 'male', verified: true },
  { id: 29, name: 'পারুল বেগম', location: 'নীলফামারী', products: 'কোয়েল ডিম, পাট শাক, বেগুন', rating: 4.7, sales: 310, avatar: 'female_14', gender: 'female', verified: true },
  { id: 30, name: 'বাবলু মিয়া', location: 'গাইবান্ধা', products: 'বাদাম, সরিষার তেল, মিষ্টি কুমড়া', rating: 4.8, sales: 680, avatar: 'male_16', gender: 'male', verified: true },
  { id: 31, name: 'শেফালী বেগম', location: 'চাঁদের কোণা', products: 'ছাগলের দুধ, খাঁটি ঘি, বাখন', rating: 4.9, sales: 410, avatar: 'female_15', gender: 'female', verified: true },
  { id: 32, name: 'আনিসুর রহমান', location: 'ব্রাহ্মণবাড়িয়া', products: 'ধানের চাল, ছানা, রসমালাই', rating: 4.7, sales: 530, avatar: 'male_17', gender: 'male', verified: true },
  { id: 33, name: 'কোহিনূর বেগম', location: 'কিশোরগঞ্জ', products: 'হাঁসের ডিম, পুঁই শাক, লাল শাক', rating: 4.8, sales: 740, avatar: 'female_16', gender: 'female', verified: true },
  { id: 34, name: 'জাফর ইকবাল', location: 'চাঁদপুর', products: 'ইলিশ মাছ, চিংড়ি, রুই', rating: 4.9, sales: 1390, avatar: 'male_18', gender: 'male', verified: true },
  { id: 35, name: 'লিপি খাতুন', location: 'ঝিনাইদহ', products: 'পেয়ারা, তরমুজ, কলা', rating: 4.8, sales: 610, avatar: 'female_17', gender: 'female', verified: true },
  { id: 36, name: 'মফিজ উদ্দিন', location: 'মেহেরপুর', products: 'বাঁধাকপি, ফুলক cauliflower, পটল', rating: 4.6, sales: 490, avatar: 'male_19', gender: 'male', verified: true },
  { id: 37, name: 'রোকেয়া বেগম', location: 'চুয়াডাঙ্গা', products: 'পেঁপে, লেবু, লাউ শাক', rating: 4.7, sales: 370, avatar: 'female_18', gender: 'female', verified: true },
  { id: 38, name: 'সিরাজুল ইসলাম', location: 'ঝালকাঠি', products: 'বোয়াল মাছ, শিং মাছ, চিতল', rating: 4.8, sales: 500, avatar: 'male_20', gender: 'male', verified: true },
  { id: 39, name: 'জেসমিন আরা', location: 'পিরোজপুর', products: 'নারকেল তেল, পেয়ারা, ডাব', rating: 4.9, sales: 580, avatar: 'female_19', gender: 'female', verified: true },
  { id: 40, name: 'আবুল কাশেম', location: 'বরগুনা', products: 'চিংড়ি মাছ, রুই মাছ, কোরাল', rating: 4.7, sales: 790, avatar: 'male_21', gender: 'male', verified: true },
  { id: 41, name: 'ফাতেমা তুজ জোহরা', location: 'গোপালগঞ্জ', products: 'মিষ্টি কুমড়া, চাল, হাসের ডিম', rating: 4.8, sales: 630, avatar: 'female_20', gender: 'female', verified: true },
  { id: 42, name: 'গোলাম মোস্তফা', location: 'নড়াইল', products: 'দেশি বাটার, গরুর খাঁটি দুধ', rating: 4.9, sales: 1110, avatar: 'male_22', gender: 'male', verified: true },
  { id: 43, name: 'রাশেদা আক্তার', location: 'শরীয়তপুর', products: 'পেঁয়াজ, মরিচ, হলুদ গুঁড়া', rating: 4.7, sales: 460, avatar: 'female_21', gender: 'female', verified: true },
  { id: 44, name: 'নুরুল ইসলাম', location: 'মাদারীপুর', products: 'সরিষার খাঁটি তেল, হলুদ, মরিচ', rating: 4.8, sales: 850, avatar: 'male_23', gender: 'male', verified: true },
  { id: 45, name: 'সাবিনা ইয়াসমিন', location: 'মুন্সীগঞ্জ', products: 'আলু, শাক, ডিম', rating: 4.9, sales: 1220, avatar: 'female_22', gender: 'female', verified: true },
  { id: 46, name: 'হারুন উর রশিদ', location: 'খাগড়াছড়ি', products: 'পাহাড়ি হলুদ, পাহাড়ি আদা, মধু', rating: 4.8, sales: 390, avatar: 'male_24', gender: 'male', verified: true },
  { id: 47, name: 'শাহিদা আক্তার', location: 'রাঙ্গামাটি', products: 'কলা, কাজুবাদাম, পাহাড়ি মধু', rating: 4.8, sales: 430, avatar: 'female_23', gender: 'female', verified: true },
  { id: 48, name: 'ফজলুল হক', location: 'শেরপুর', products: 'চিনিগুড় চাল, ব্রি-২৮ চাল', rating: 4.7, sales: 690, avatar: 'male_25', gender: 'male', verified: true },
  { id: 49, name: 'মরিয়ম বেগম', location: 'লালমনিরহাট', products: 'মরিচ, তামাক পাতা, লাল শাক', rating: 4.8, sales: 530, avatar: 'female_24', gender: 'female', verified: true },
  { id: 50, name: 'কামাল উদ্দিন', location: 'ফেনী', products: 'খাঁটি গরুর দুধ, ঘি, মাখন', rating: 4.9, sales: 960, avatar: 'male_26', gender: 'male', verified: true }
];

// Helper to generate distinct products per Category
// 10 categories, each containing exactly 15 highly realistic premium products. Total 150 products!
const RAW_PRODUCTS_METADATA = [
  // --- Category: VEGETABLES (vege) - 15 items ---
  { cat: 'vege', items: [
    { title: 'আলু', slug: 'alu-potato', price: 35, unit: 'কেজি', farmerId: 1, img: 'https://images.unsplash.com/photo-1518977676601-b53f02ac6d5d?auto=format&fit=crop&q=80&w=400', weightOptions: ['১ কেজি', '২ কেজি', '৫ কেজি'], best: true },
    { title: 'টমেটো', slug: 'tomato-fresh', price: 60, unit: 'কেজি', farmerId: 2, img: 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&q=80&w=400', weightOptions: ['৫০০ গ্রাম', '১ কেজি', '২ কেজি'], best: true },
    { title: 'পেঁয়াজ', slug: 'peyaj-onion', price: 75, unit: 'কেজি', farmerId: 12, img: 'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&q=80&w=400', weightOptions: ['১ কেজি', '৫ কেজি', '১০ কেজি'], best: true },
    { title: 'রসুন', slug: 'rosun-garlic', price: 120, unit: 'কেজি', farmerId: 12, img: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&q=80&w=400', weightOptions: ['২৫০ গ্রাম', '৫০০ গ্রাম', '১ কেজি'] },
    { title: 'বেগুন', slug: 'begun-eggplant', price: 50, unit: 'কেজি', farmerId: 3, img: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=400', weightOptions: ['১ কেজি', '২ কেজি'] },
    { title: 'করলা', slug: 'korola-bittergourd', price: 55, unit: 'কেজি', farmerId: 3, img: 'https://images.unsplash.com/photo-1582515073490-39981397c445?auto=format&fit=crop&q=80&w=400', weightOptions: ['৫০০ গ্রাম', '১ কেজি'] },
    { title: 'চিচিঙ্গা', slug: 'chichinga-snakegourd', price: 40, unit: 'কেজি', farmerId: 1, img: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=400', weightOptions: ['১ কেজি', '৩ কেজি'] },
    { title: 'ঝিঙা', slug: 'jhinga-ridgegourd', price: 45, unit: 'কেজি', farmerId: 3, img: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=400', weightOptions: ['১ কেজি', '২ কেজি'] },
    { title: 'মিষ্টি কুমড়া', slug: 'misti-kumra-pumpkin', price: 65, unit: 'পিস', farmerId: 2, img: 'https://images.unsplash.com/photo-1506477331477-33d5d8b3dc85?auto=format&fit=crop&q=80&w=400', weightOptions: ['১ পিস (মাঝারি)', '১ পিস (বড়)'] },
    { title: 'শসা', slug: 'shosa-cucumber', price: 40, unit: 'কেজি', farmerId: 27, img: 'https://images.unsplash.com/photo-1449339044511-311738bb1a7d?auto=format&fit=crop&q=80&w=400', weightOptions: ['১ কেজি', '২ কেজি'] },
    { title: 'গাজর', slug: 'gajor-carrot', price: 80, unit: 'কেজি', farmerId: 1, img: 'https://images.unsplash.com/photo-1598170845058-32b996a6957b?auto=format&fit=crop&q=80&w=400', weightOptions: ['৫০০ গ্রাম', '১ কেজি'] },
    { title: 'লাউ', slug: 'lau-bottlegourd', price: 45, unit: 'পিস', farmerId: 1, img: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=400', weightOptions: ['১ পিস', '২ পিস'] },
    { title: 'ঢেঁড়স', slug: 'dherosh-okra', price: 35, unit: 'কেজি', farmerId: 3, img: 'https://images.unsplash.com/photo-1444464666168-49d633b867ad?auto=format&fit=crop&q=80&w=400', weightOptions: ['৫০০ গ্রাম', '১ কেজি'] },
    { title: 'ফুলকপি', slug: 'fulkopi-cauliflower', price: 40, unit: 'পিস', farmerId: 36, img: 'https://images.unsplash.com/photo-1568584711271-e302495987f2?auto=format&fit=crop&q=80&w=400', weightOptions: ['১ পিস', '৩ পিস'] },
    { title: 'বাঁধাকপি', slug: 'badhakopi-cabbage', price: 35, unit: 'পিস', farmerId: 36, img: 'https://images.unsplash.com/photo-1550142411-12551379abfd?auto=format&fit=crop&q=80&w=400', weightOptions: ['১ পিস', '২ পিস'] }
  ]},

  // --- Category: LEAFY GREENS (leafy) - 15 items ---
  { cat: 'leafy', items: [
    { title: 'লাল শাক', slug: 'lal-shak-redspinach', price: 20, unit: 'আটি', farmerId: 2, img: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=400', weightOptions: ['১ আটি', '৩ আটি', '৫ আটি'] },
    { title: 'পালং শাক', slug: 'palong-shak-spinach', price: 22, unit: 'আটি', farmerId: 17, img: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=400', weightOptions: ['১ আটি', '৩ আটি'] },
    { title: 'পুঁই শাক', slug: 'pui-shak', price: 25, unit: 'আটি', farmerId: 17, img: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=400', weightOptions: ['১ আটি', '২ আটি'] },
    { title: 'ডাঁটা শাক', slug: 'data-shak', price: 18, unit: 'আটি', farmerId: 17, img: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=400', weightOptions: ['১ আটি', '৩ আটি'] },
    { title: 'কলমি শাক', slug: 'kolmi-shak', price: 15, unit: 'আটি', farmerId: 17, img: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=400', weightOptions: ['১ আটি', '৪ আটি'] },
    { title: 'পাট শাক', slug: 'pat-shak', price: 15, unit: 'আটি', farmerId: 29, img: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=400', weightOptions: ['১ আটি', '৩ আটি'] },
    { title: 'লাউ শাক', slug: 'lau-shak', price: 30, unit: 'আটি', farmerId: 37, img: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=400', weightOptions: ['১ আটি', '২ আটি'] },
    { title: 'সর্ষে শাক', slug: 'shorshe-shak', price: 20, unit: 'আটি', farmerId: 17, img: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=400', weightOptions: ['১ আটি', '৩ আটি'] },
    { title: 'নোটে শাক', slug: 'note-shak', price: 18, unit: 'আটি', farmerId: 17, img: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=400', weightOptions: ['১ আটি'] },
    { title: 'মেথি শাক', slug: 'methi-shak', price: 25, unit: 'আটি', farmerId: 17, img: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=400', weightOptions: ['১ আটি', '৩ আটি'] },
    { title: 'হেলেঞ্চা শাক', slug: 'helancha-shak', price: 20, unit: 'আটি', farmerId: 17, img: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=400', weightOptions: ['১ আটি'] },
    { title: 'থানকুনি পাতা', slug: 'thankuni-pata', price: 30, unit: 'আটি', farmerId: 17, img: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=400', weightOptions: ['১ আটি', '২ আটি'] },
    { title: 'ব্রাহ্মী শাক', slug: 'brahmi-shak', price: 28, unit: 'আটি', farmerId: 17, img: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=400', weightOptions: ['১ আটি'] },
    { title: 'কচু শাক', slug: 'kochu-shak', price: 15, unit: 'আটি', farmerId: 45, img: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=400', weightOptions: ['১ আটি', '৩ আটি'] },
    { title: 'সাজনা পাতা', slug: 'sojna-pata', price: 35, unit: 'আটি', farmerId: 45, img: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=400', weightOptions: ['১০০ গ্রাম', '২৫০০ গ্রাম'] }
  ]},

  // --- Category: FRUITS (fruit) - 15 items ---
  { cat: 'fruit', items: [
    { title: 'রাজশাহী ফজলি আম', slug: 'fazli-mango', price: 140, unit: 'কেজি', farmerId: 8, img: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=400', weightOptions: ['১ কেজি', '৫ কেজি', '১০ কেজি'], best: true },
    { title: 'হিমসাগর আম', slug: 'himsagor-mango', price: 160, unit: 'কেজি', farmerId: 8, img: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=400', weightOptions: ['১ কেজি', '৫ কেজি', '১০ কেজি'], best: true },
    { title: 'দিনাজপুরী লিচু', slug: 'misti-lichu', price: 280, unit: '১০০পিস', farmerId: 4, img: 'https://images.unsplash.com/photo-1563245464-90a618e8832a?auto=format&fit=crop&q=80&w=400', weightOptions: ['১০০ পিস', '২০০ পিস', '৫০০ পিস'], best: true },
    { title: 'মিষ্টি পেয়ারা', slug: 'guava-peara', price: 70, unit: 'কেজি', farmerId: 4, img: 'https://images.unsplash.com/photo-1536511118081-37cdb79b9423?auto=format&fit=crop&q=80&w=400', weightOptions: ['১ কেজি', '২ কেজি'] },
    { title: 'আনারস (জলডুঙ্গি)', slug: 'pineapple-anarosh', price: 50, unit: 'পিস', farmerId: 4, img: 'https://images.unsplash.com/photo-1550258114-68bd2a4819bd?auto=format&fit=crop&q=80&w=400', weightOptions: ['১ পিস', '৪ পিস'] },
    { title: 'জাম্বুরা', slug: 'jambura-pomelo', price: 60, unit: 'পিস', farmerId: 7, img: 'https://images.unsplash.com/photo-1550258114-68bd2a4819bd?auto=format&fit=crop&q=80&w=400', weightOptions: ['১ পিস', '২ পিস'] },
    { title: 'মিষ্টি মাল্টা', slug: 'malta-orange', price: 180, unit: 'কেজি', farmerId: 4, img: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&q=80&w=400', weightOptions: ['১ কেজি', '২ কেজি', '৫ কেজি'] },
    { title: 'সবরি কলা', slug: 'banana-sobri', price: 90, unit: 'ডজন', farmerId: 35, img: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&q=80&w=400', weightOptions: ['১ ডজন', '২ ডজন'] },
    { title: 'তরমুজ', slug: 'tormuj-watermelon', price: 250, unit: 'পিস', farmerId: 35, img: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=400', weightOptions: ['১ পিস (৫ কেজি+)', '১ পিস (৮ কেজি+)'] },
    { title: 'ডাব', slug: 'dab-coconut', price: 110, unit: 'পিস', farmerId: 39, img: 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?auto=format&fit=crop&q=80&w=400', weightOptions: ['১ পিস', '৪ পিস'] },
    { title: 'কালো জাম', slug: 'kalojam-berry', price: 220, unit: 'কেজি', farmerId: 35, img: 'https://images.unsplash.com/photo-1563245464-90a618e8832a?auto=format&fit=crop&q=80&w=400', weightOptions: ['৫০০ গ্রাম', '১ কেজি'] },
    { title: 'কামরাঙা', slug: 'kamranga', price: 90, unit: 'কেজি', farmerId: 35, img: 'https://images.unsplash.com/photo-1536511118081-37cdb79b9423?auto=format&fit=crop&q=80&w=400', weightOptions: ['৫০০ গ্রাম', '১ কেজি'] },
    { title: 'আমড়া', slug: 'amra', price: 80, unit: 'কেজি', farmerId: 35, img: 'https://images.unsplash.com/photo-1536511118081-37cdb79b9423?auto=format&fit=crop&q=80&w=400', weightOptions: ['১ কেজি'] },
    { title: 'জলপাই', slug: 'jolpai-olive', price: 120, unit: 'কেজি', farmerId: 35, img: 'https://images.unsplash.com/photo-1536511118081-37cdb79b9423?auto=format&fit=crop&q=80&w=400', weightOptions: ['১ কেজি', '২ কেজি'] },
    { title: 'মিষ্টি বরই', slug: 'boroi-plum', price: 100, unit: 'কেজি', farmerId: 35, img: 'https://images.unsplash.com/photo-1536511118081-37cdb79b9423?auto=format&fit=crop&q=80&w=400', weightOptions: ['১ কেজি'] }
  ]},

  // --- Category: FISH (fish) - 15 items ---
  { cat: 'fish', items: [
    { title: 'পদ্মার তাজা ইলিশ', slug: 'padma-ilish', price: 950, unit: 'কেজি', farmerId: 6, img: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=400', weightOptions: ['১ পিস (৮০০ গ্রাম)', '১ পিস (১ কেজি)', '১ পিস (১.২ কেজি)'], best: true },
    { title: 'বিল খাঁটি রুই মাছ', slug: 'bill-rui', price: 320, unit: 'কেজি', farmerId: 34, img: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=400', weightOptions: ['১.৫ - ২ কেজি পিস', '২.৫+ কেজি পিস'] },
    { title: 'নদীর বড় কাতলা', slug: 'katla-fish', price: 380, unit: 'কেজি', farmerId: 34, img: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=400', weightOptions: ['২ কেজি+ পিস', '৩ কেজি+ পিস'] },
    { title: 'বিল শিং মাছ', slug: 'shing-fish', price: 420, unit: 'কেজি', farmerId: 5, img: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=400', weightOptions: ['৫০০ গ্রাম', '১ কেজি'] },
    { title: 'জ্যান্ত মাগুর মাছ', slug: 'magur-fish', price: 480, unit: 'কেজি', farmerId: 5, img: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=400', weightOptions: ['১ কেজি'] },
    { title: 'নদীর টেংরা মাছ', slug: 'tengra-fish', price: 280, unit: 'কেজি', farmerId: 5, img: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=400', weightOptions: ['৫০০ গ্রাম', '১ কেজি'] },
    { title: 'হাওরের বোয়াল মাছ', slug: 'boal-fish', price: 650, unit: 'কেজি', farmerId: 5, img: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=400', weightOptions: ['২ কেজি সাইজ', '৩ কেজি সাইজ'] },
    { title: 'নরম পাবদা মাছ', slug: 'pabda-fish', price: 350, unit: 'কেজি', farmerId: 6, img: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=400', weightOptions: ['৫০০ গ্রাম', '১ কেজি'] },
    { title: 'গলদা চিংড়ি', slug: 'golda-chingri', price: 780, unit: 'কেজি', farmerId: 6, img: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=400', weightOptions: ['৫০০ গ্রাম', '১ কেজি'], best: true },
    { title: 'লবণাক্ত রূপচাঁদা', slug: 'rupchanda-fish', price: 850, unit: 'কেজি', farmerId: 21, img: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=400', weightOptions: ['১ কেজি'] },
    { title: 'হাওরের শোল মাছ', slug: 'shol-fish', price: 400, unit: 'কেজি', farmerId: 38, img: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=400', weightOptions: ['১ কেজি'] },
    { title: 'নদীর চিতল মাছ', slug: 'chitol-fish', price: 700, unit: 'কেজি', farmerId: 38, img: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=400', weightOptions: ['১ কেজি (মাঝারি)', '২ কেজি (বড়)'] },
    { title: 'দেশি পুঁটি মাছ', slug: 'puti-fish', price: 160, unit: 'কেজি', farmerId: 34, img: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=400', weightOptions: ['৫০০ গ্রাম', '১ কেজি'] },
    { title: 'নদীয়া বেলে মাছ', slug: 'bele-fish', price: 500, unit: 'কেজি', farmerId: 34, img: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=400', weightOptions: ['৫০০ গ্রাম', '১ কেজি'] },
    { title: 'কুরাল মাছ (কোরাল)', slug: 'koral-fish', price: 750, unit: 'কেজি', farmerId: 40, img: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=400', weightOptions: ['২ কেজি+', '৩ কেজি+'] }
  ]},

  // --- Category: RICE (rice) - 15 items ---
  { cat: 'rice', items: [
    { title: 'প্রিমিয়াম মিনিকেট চাল', slug: 'premium-miniket', price: 68, unit: 'কেজি', farmerId: 9, img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400', weightOptions: ['৫ কেজি', '১০ কেজি', '২৫ কেজি', '৫০ কেজি'], best: true },
    { title: 'জিরা রাইস নাজিরশাইল', slug: 'nazirshail-rice', price: 72, unit: 'কেজি', farmerId: 9, img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400', weightOptions: ['৫ কেজি', '১০ কেজি', '২৫ কেজি', '৫০ কেজি'] },
    { title: 'ব্রি-২৮ ধানের চাল', slug: 'bri28-rice', price: 58, unit: 'কেজি', farmerId: 16, img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400', weightOptions: ['১০ কেজি', '২৫ কেজি', '৫০ কেজি'] },
    { title: 'ব্রি-২৯ ধানের চাল', slug: 'bri29-rice', price: 56, unit: 'কেজি', farmerId: 16, img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400', weightOptions: ['১০ কেজি', '২৫ কেজি', '৫০ কেজি'] },
    { title: 'কাটারিভোগ আতপ চাল', slug: 'kataribhoge-rice', price: 95, unit: 'কেজি', farmerId: 9, img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400', weightOptions: ['৫ কেজি', '১০ কেজি', '২৫ কেজি'], best: true },
    { title: 'চিনিগুঁড়া পোলাও চাল', slug: 'chinigura-rice', price: 135, unit: 'কেজি', farmerId: 10, img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400', weightOptions: ['১ কেজি', '২ কেজি', '৫ কেজি'], best: true },
    { title: 'বাসমতি সুগন্ধি চাল', slug: 'basmati-rice', price: 220, unit: 'কেজি', farmerId: 9, img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400', weightOptions: ['১ কেজি', '৫ কেজি'] },
    { title: 'লাল চাল (অর্গানিক)', slug: 'brown-red-rice', price: 85, unit: 'কেজি', farmerId: 10, img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400', weightOptions: ['১ কেজি', '৫ কেজি', '১০ কেজি'] },
    { title: 'হরি ধানের পাইজাম চাল', slug: 'paijam-rice', price: 62, unit: 'কেজি', farmerId: 10, img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400', weightOptions: ['১০ কেজি', '২৫ কেজি', '৫০ কেজি'] },
    { title: 'কালোজিরা সুগন্ধি চাল', slug: 'kalojira-shugondhi', price: 140, unit: 'কেজি', farmerId: 10, img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400', weightOptions: ['১ কেজি', '২ কেজি', '৫ কেজি'] },
    { title: 'বালাম প্রাচীন চাল', slug: 'balam-rice', price: 78, unit: 'কেজি', farmerId: 10, img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400', weightOptions: ['৫ কেজি', '১০ কেজি'] },
    { title: 'ইরি বায়ান্ন ধানের চাল', slug: 'iri-rice', price: 54, unit: 'কেজি', farmerId: 10, img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400', weightOptions: ['২৫ কেজি', '৫০ কেজি'] },
    { title: 'লতা ধানের চাল', slug: 'lota-rice', price: 60, unit: 'কেজি', farmerId: 28, img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400', weightOptions: ['১০ কেজি', '৫০ কেজি'] },
    { title: 'দুধরাজ ঐতিহ্যবাহী চাল', slug: 'dudhraj-rice', price: 80, unit: 'কেজি', farmerId: 32, img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400', weightOptions: ['৫ কেজি', '১০ কেজি'] },
    { title: 'চিনি আতপ চাল', slug: 'chini-atop-rice', price: 110, unit: 'কেজি', farmerId: 48, img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400', weightOptions: ['১ কেজি', '৫ কেজি'] }
  ]},

  // --- Category: EGGS (egg) - 15 items ---
  { cat: 'egg', items: [
    { title: 'দেশি মুরগির খাঁটি ডিম', slug: 'deshi-murgi-dim', price: 65, unit: 'হালি', farmerId: 14, img: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&q=80&w=400', weightOptions: ['১ হালি', '৩ হালি (১২টি)', '৬ হালি (২৪টি)'], best: true },
    { title: 'খাসি হাসের বড় ডিম', slug: 'haser-dim', price: 70, unit: 'হালি', farmerId: 14, img: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&q=80&w=400', weightOptions: ['১ হালি', '৩ হালি (১২টি)'], best: true },
    { title: 'পুষ্টিকর কোয়েল পাখির ডিম', slug: 'quail-egg', price: 30, unit: 'ডজন', farmerId: 19, img: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&q=80&w=400', weightOptions: ['১ ডজন (১২টি)', '২ ডজন (২৪টি)'] },
    { title: 'অর্গানিক মুরগির ডিম', slug: 'organic-eggs', price: 55, unit: 'হালি', farmerId: 14, img: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&q=80&w=400', weightOptions: ['১ হালি', '৩ হালি', '১০ হালি'] },
    { title: 'খামারের লাল ডিম', slug: 'farm-red-egg', price: 44, unit: 'হালি', farmerId: 14, img: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&q=80&w=400', weightOptions: ['১ হালি', '৩ হালি', '১ ক্যাসেট (৩০টি)'] },
    { title: 'খামারের সাদা ডিম', slug: 'farm-white-egg', price: 42, unit: 'হালি', farmerId: 14, img: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&q=80&w=400', weightOptions: ['১ হালি', '৩ হালি', '১ ক্যাসেট (৩০টি)'] },
    { title: 'দেশি হাঁসের ডিম (হ্যান্ডপিকড)', slug: 'native-duck-eggs', price: 72, unit: 'হালি', farmerId: 33, img: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&q=80&w=400', weightOptions: ['১ হালি', '৩ হালি'] },
    { title: 'সোনালী মুরগির তাজা ডিম', slug: 'sonali-murgi-egg', price: 50, unit: 'হালি', farmerId: 19, img: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&q=80&w=400', weightOptions: ['১ হালি', '৩ হালি'] },
    { title: 'ওমেগা-৩ সমৃদ্ধ প্রিমিয়াম ডিম', slug: 'omega3-eggs', price: 80, unit: 'হালি', farmerId: 14, img: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&q=80&w=400', weightOptions: ['১ হালি', '৩ হালি'] },
    { title: 'টার্কি মুরগির বড় ডিম', slug: 'turkey-eggs', price: 150, unit: 'হালি', farmerId: 14, img: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&q=80&w=400', weightOptions: ['১ হালি'] },
    { title: 'তিতির পাখির ডিম', slug: 'titir-eggs', price: 120, unit: 'হালি', farmerId: 14, img: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&q=80&w=400', weightOptions: ['১ হালি'] },
    { title: 'রাজহাঁসের প্রকাণ্ড ডিম', slug: 'rajhash-eggs', price: 200, unit: 'হালি', farmerId: 33, img: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&q=80&w=400', weightOptions: ['১ হালি', '২ হালি'] },
    { title: 'কোয়েল পাখির খাঁটি ডিম (১০০টি)', slug: 'quail-eggs-bulk', price: 220, unit: 'বক্স', farmerId: 19, img: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&q=80&w=400', weightOptions: ['৫০টি বক্স', '১০০টি বক্স'] },
    { title: 'কড়া ডিম (দ্বি-কুসুম)', slug: 'double-yolk-eggs', price: 90, unit: 'হালি', farmerId: 14, img: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&q=80&w=400', weightOptions: ['১ হালি'] },
    { title: 'কবুতরের পুষ্টিকর ডিম', slug: 'pigeon-eggs', price: 160, unit: 'জোড়া', farmerId: 19, img: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&q=80&w=400', weightOptions: ['১ জোড়া', '২ জোড়া'] }
  ]},

  // --- Category: DAIRY/MILK (milk) - 15 items ---
  { cat: 'milk', items: [
    { title: 'খাঁটি তরল গরুর দুধ', slug: 'pure-cow-milk', price: 80, unit: 'লিটার', farmerId: 15, img: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=400', weightOptions: ['১ লিটার', '২ লিটার', '৫ লিটার'], best: true },
    { title: 'খাঁটি তরল মহিষের দুধ', slug: 'pure-buffalo-milk', price: 120, unit: 'লিটার', farmerId: 22, img: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=400', weightOptions: ['১ লিটার', '২ লিটার'] },
    { title: 'ছাগলের পুষ্টিকর দুধ', slug: 'goat-milk', price: 140, unit: 'লিটার', farmerId: 31, img: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=400', weightOptions: ['৫০০ মিলি', '১ লিটার'] },
    { title: 'খাঁটি মাখন (হোমমেড)', slug: 'homemade-butter', price: 950, unit: 'কেজি', farmerId: 13, img: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&q=80&w=400', weightOptions: ['২৫০ গ্রাম', '৫০০ গ্রাম', '১ কেজি'] },
    { title: 'গাভী গরুর খাঁটি ঘি', slug: 'pure-cow-ghee', price: 1450, unit: 'কেজি', farmerId: 13, img: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&q=80&w=400', weightOptions: ['২৫০ গ্রাম', '৫০০ গ্রাম', '১ কেজি'], best: true },
    { title: 'ঐতিহ্যবাহী টক দই', slug: 'sweet-curd-sour', price: 180, unit: 'কেজি', farmerId: 15, img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=400', weightOptions: ['৫০০ গ্রাম', '১ কেজি'] },
    { title: 'বগুড়ার মিষ্টি দই', slug: 'bogura-misti-doi', price: 260, unit: 'কেজি', farmerId: 11, img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=400', weightOptions: ['১ হাড়ি (১ কেজি)', '১ হাড়ি (২ কেজি)'], best: true },
    { title: 'খাঁটি গরুর দুধের ছানা', slug: 'milk-paneer-chana', price: 350, unit: 'কেজি', farmerId: 32, img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=400', weightOptions: ['৫০০ গ্রাম', '১ কেজি'] },
    { title: 'ঐতিহ্যবাহী মাঠা', slug: 'matha-buttermilk', price: 80, unit: 'লিটার', farmerId: 15, img: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=400', weightOptions: ['১ লিটার', '২ লিটার'] },
    { title: 'দুধের ক্ষীর', slug: 'milk-kheer', price: 450, unit: 'কেজি', farmerId: 15, img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=400', weightOptions: ['৫০০ গ্রাম', '১ কেজি'] },
    { title: 'খাঁটি রসমালাই', slug: 'pure-roshomalai', price: 380, unit: 'কেজি', farmerId: 32, img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=400', weightOptions: ['৫০০ গ্রাম', '১ কেজি'] },
    { title: 'হোমমেড পনির (Cheese)', slug: 'homemade-paneer', price: 600, unit: 'কেজি', farmerId: 42, img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=400', weightOptions: ['২৫০০ গ্রাম', '১ কেজি'] },
    { title: 'দুধের ঘন রাবড়ি', slug: 'milk-rabri', price: 550, unit: 'কেজি', farmerId: 15, img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=400', weightOptions: ['৫০০ গ্রাম', '১ কেজি'] },
    { title: 'দুধের মালাই (cream)', slug: 'milk-malai', price: 650, unit: 'কেজি', farmerId: 15, img: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=400', weightOptions: ['২৫০ গ্রাম', '৫০০ গ্রাম'] },
    { title: 'মহিষের দই (হাঁড়িতে)', slug: 'buffalo-curd', price: 290, unit: 'কেজি', farmerId: 22, img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=400', weightOptions: ['১ হাঁড়ি'] }
  ]},

  // --- Category: HONEY (honey) - 15 items ---
  { cat: 'honey', items: [
    { title: 'সুন্দরবনের খলিশা মধু', slug: 'sundarban-kholisha-honey', price: 800, unit: 'কেজি', farmerId: 18, img: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=400', weightOptions: ['২৫০ গ্রাম', '৫০০ গ্রাম', '১ কেজি'], best: true },
    { title: 'খাঁটি চুন ভাঙ্গার মধু', slug: 'organic-pure-honey', price: 650, unit: 'কেজি', farmerId: 18, img: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=400', weightOptions: ['৫০০ গ্রাম', '১ কেজি'], best: true },
    { title: 'সরিষা ফুলের খাঁটি মধু', slug: 'shorshe-honey', price: 450, unit: 'কেজি', farmerId: 16, img: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=400', weightOptions: ['৫০০ গ্রাম', '১ কেজি', '২ কেজি'] },
    { title: 'কালোজিরা ফুলের মধু', slug: 'kalojira-flower-honey', price: 950, unit: 'কেজি', farmerId: 9, img: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=400', weightOptions: ['৫০০ গ্রাম', '১ কেজি'], best: true },
    { title: 'লিচু ফুলের সুস্বাদু মধু', slug: 'lichu-flower-honey', price: 500, unit: 'কেজি', farmerId: 9, img: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=400', weightOptions: ['৫০০ গ্রাম', '১ কেজি'] },
    { title: 'সুন্দরবনের গরান বুনো মধু', slug: 'sundarban-goran-honey', price: 850, unit: 'কেজি', farmerId: 18, img: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=400', weightOptions: ['৫০০ গ্রাম', '১ কেজি'] },
    { title: 'পাহাড়ি খাঁটি বুনো মধু', slug: 'hill-forest-honey', price: 1100, unit: 'কেজি', farmerId: 24, img: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=400', weightOptions: ['২৫০ গ্রাম', '৫০০ গ্রাম', '১ কেজি'] },
    { title: 'বরই ফুলের খাঁটি মধু', slug: 'boroi-flower-honey', price: 550, unit: 'কেজি', farmerId: 18, img: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=400', weightOptions: ['৫০০ গ্রাম', '১ কেজি'] },
    { title: 'ধনিয়া ফুলের খাঁটি মধু', slug: 'dhonia-flower-honey', price: 480, unit: 'কেজি', farmerId: 18, img: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=400', weightOptions: ['১ কেজি'] },
    { title: 'সূর্যমুখী ফুলের মধু', slug: 'sunflower-honey', price: 600, unit: 'কেজি', farmerId: 18, img: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=400', weightOptions: ['১ কেজি'] },
    { title: 'আম পাতা রসে মধু', slug: 'mango-leaf-honey', price: 700, unit: 'কেজি', farmerId: 18, img: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=400', weightOptions: ['১ কেজি'] },
    { title: 'নিম ফুলের ওষুধি মধু', slug: 'neem-flower-honey', price: 900, unit: 'কেজি', farmerId: 18, img: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=400', weightOptions: ['২৫০ গ্রাম', '৫০০ গ্রাম', '১ কেজি'] },
    { title: 'তুলসী ফুলের খাঁটি মধু', slug: 'tulsi-flower-honey', price: 1000, unit: 'কেজি', farmerId: 18, img: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=400', weightOptions: ['৫০০ গ্রাম', '১ কেজি'] },
    { title: 'বহুমাত্রিক ফুলের মধু', slug: 'multiflower-honey', price: 580, unit: 'কেজি', farmerId: 26, img: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=400', weightOptions: ['১ কেজি', '২ কেজি'] },
    { title: 'চাক ভাঙ্গা তাজা কাঁচা মধু', slug: 'raw-chak-honey', price: 900, unit: 'কেজি', farmerId: 18, img: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=400', weightOptions: ['৫০০ গ্রাম', '১ কেজি'] }
  ]},

  // --- Category: SPICES (spice) - 15 items ---
  { cat: 'spice', items: [
    { title: 'খাঁটি আস্ত হলুদ', slug: 'pure-turmeric-root', price: 210, unit: 'কেজি', farmerId: 12, img: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=400', weightOptions: ['২৫০ গ্রাম', '৫০০ গ্রাম', '১ কেজি'] },
    { title: 'সরিষার খাঁটি তেল (ঘানি)', slug: 'mustard-oil-ghani', price: 240, unit: 'লিটার', farmerId: 44, img: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=400', weightOptions: ['১ লিটার', '২ লিটার', '৫ লিটার'], best: true },
    { title: 'পাথরভাঙ্গা শুকনো মরিচ', slug: 'pure-chili-dry', price: 320, unit: 'কেজি', farmerId: 12, img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=400', weightOptions: ['২৫০ গ্রাম', '৫০০ গ্রাম', '১ কেজি'] },
    { title: 'হলুদ গুঁড়া (অর্গানিক)', slug: 'turmeric-powder', price: 280, unit: 'কেজি', farmerId: 20, img: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=400', weightOptions: ['২৫০ গ্রাম', '৫০০ গ্রাম', '১ কেজি'] },
    { title: 'মরিচ গুঁড়া (অর্গানিক)', slug: 'chili-powder', price: 340, unit: 'কেজি', farmerId: 20, img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=400', weightOptions: ['২৫০ গ্রাম', '৫০০ গ্রাম', '১ কেজি'] },
    { title: 'হাতে গুঁড়া জিরা মসলা', slug: 'cumin-powder', price: 680, unit: 'কেজি', farmerId: 20, img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=400', weightOptions: ['১০০ গ্রাম', '২৫০০ গ্রাম', '১ কেজি'], best: true },
    { title: 'ধনে গুঁড়া (অর্গানিক)', slug: 'coriander-powder', price: 220, unit: 'কেজি', farmerId: 20, img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=400', weightOptions: ['২৫০ গ্রাম', '৫০০ গ্রাম', '১ কেজি'] },
    { title: 'খাঁটি সংগৃহীত মেথি', slug: 'methi-seed', price: 180, unit: 'কেজি', farmerId: 44, img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=400', weightOptions: ['২৫০ গ্রাম', '৫০০ গ্রাম'] },
    { title: 'কালোজিরা ওষুধি দানা', slug: 'kalojira-seed', price: 380, unit: 'কেজি', farmerId: 26, img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=400', weightOptions: ['১০০ গ্রাম', '২৫০ গ্রাম', '৫০০ গ্রাম'] },
    { title: 'রান্ধুনী বিশেষ মসলা', slug: 'randhuni-spice', price: 300, unit: 'কেজি', farmerId: 20, img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=400', weightOptions: ['১০০ গ্রাম', '২৫০ গ্রাম'] },
    { title: 'সুগন্ধি এলাচ', slug: 'elachi-cardamom', price: 2800, unit: 'কেজি', farmerId: 25, img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=400', weightOptions: ['৫০ গ্রাম', '১০০ গ্রাম', '২৫০ গ্রাম'] },
    { title: 'আস্ত দারুচিনি', slug: 'daruchini-cinnamon', price: 450, unit: 'কেজি', farmerId: 25, img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=400', weightOptions: ['১০০ গ্রাম', '২৫০ গ্রাম', '৫০০ গ্রাম'] },
    { title: 'সুগন্ধি লবঙ্গ', slug: 'lobongo-cloves', price: 1200, unit: 'কেজি', farmerId: 25, img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=400', weightOptions: ['১০০ গ্রাম', '২৫০ গ্রাম'] },
    { title: 'পাঁচফোড়ন বিশেষ দানা', slug: 'panchphoron', price: 200, unit: 'কেজি', farmerId: 20, img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=400', weightOptions: ['২৫০ গ্রাম', '৫০০ গ্রাম'] },
    { title: 'প্রিমিয়াম গরম মসলা গুঁড়া', slug: 'gorom-morich-powder', price: 450, unit: 'কেজি', farmerId: 20, img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=400', weightOptions: ['১০০ গ্রাম', '২৫০ গ্রাম', '৫০০ গ্রাম'] }
  ]},

  // --- Category: OTHER/COMBOS (other) - 15 items ---
  { cat: 'other', items: [
    { title: 'সাপ্তাহিক প্রিমিয়াম ফ্যামিলি বাস্কেট', slug: 'weekly-family-basket', price: 499, unit: 'প্যাকেজ', farmerId: 27, img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400', weightOptions: ['১ প্যাকেজ (ছোট)', '১ প্যাকেজ (বড়)'], best: true },
    { title: 'সবজি কম্বো বাস্কেট (৭ প্রকার)', slug: 'vegetable-combo-box', price: 299, unit: 'বাস্কেট', farmerId: 27, img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400', weightOptions: ['১ বাস্কেট'], best: true },
    { title: 'সালাদ কম্বো বক্স', slug: 'salad-combo-box', price: 150, unit: 'বক্স', farmerId: 27, img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400', weightOptions: ['১ বক্স'] },
    { title: 'দেশি ডাল কম্বো প্যাক', slug: 'dal-combo-pack', price: 340, unit: 'প্যাক', farmerId: 20, img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400', weightOptions: ['৩ কেজি প্যাক'] },
    { title: 'অর্গানিক লাল আটা', slug: 'organic-red-flour', price: 75, unit: 'কেজি', farmerId: 20, img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=400', weightOptions: ['১ কেজি', '২ কেজি', '৫ কেজি'] },
    { title: 'সরিষার খাঁটি খৈল', slug: 'mustard-cake-fertilizer', price: 50, unit: 'কেজি', farmerId: 44, img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400', weightOptions: ['১ কেজি', '৫ কেজি', '১০ কেজি'] },
    { title: 'কাঠের ঘানির তাজা সরিষার তেল', slug: 'wood-pressed-mustard-oil', price: 280, unit: 'লিটার', farmerId: 44, img: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=400', weightOptions: ['১ লিটার', '২ লিটার', '৫ লিটার'], best: true },
    { title: 'দেশি পেঁয়াজ পাতা তেল', slug: 'onion-hair-oil', price: 220, unit: 'বোতল', farmerId: 12, img: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=400', weightOptions: ['১০০ মিলি', '২০০ মিলি'] },
    { title: 'তাজা অ্যালোভেরা জেল (ন্যাচারাল)', slug: 'aloe-vera-gel', price: 150, unit: 'পিস', farmerId: 27, img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400', weightOptions: ['২ পিস পাতা', '৫ পিস পাতা'] },
    { title: 'নিম পাউডার (অর্গানিক)', slug: 'neem-powder', price: 120, unit: 'প্যাক', farmerId: 26, img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400', weightOptions: ['১০০ গ্রাম', '২৫০ গ্রাম'] },
    { title: 'খাঁটি মুলতানি মাটি গুঁড়া', slug: 'multani-mati', price: 130, unit: 'প্যাক', farmerId: 26, img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400', weightOptions: ['১০০ গ্রাম', '২৫০ গ্রাম'] },
    { title: 'উপকারী তুলসী চা পাতা', slug: 'tulsi-tea', price: 160, unit: 'প্যাক', farmerId: 26, img: 'https://images.unsplash.com/photo-1508020963904-3fea3788a45a?auto=format&fit=crop&q=80&w=400', weightOptions: ['১০০ গ্রাম'] },
    { title: 'অর্গানিক মাশরুম পাউডার', slug: 'mushroom-powder', price: 240, unit: 'প্যাক', farmerId: 26, img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400', weightOptions: ['১০০ গ্রাম'] },
    { title: 'সিলেটের খাঁটি গ্রিন টি', slug: 'sylhet-green-tea', price: 190, unit: 'প্যাক', farmerId: 25, img: 'https://images.unsplash.com/photo-1508020963904-3fea3788a45a?auto=format&fit=crop&q=80&w=400', weightOptions: ['১০০ গ্রাম', '২৫০ গ্রাম'] },
    { title: 'হাতে বাটা অর্গানিক হলুদ বাটা', slug: 'organic-turmeric-paste', price: 150, unit: 'জার', farmerId: 43, img: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=400', weightOptions: ['২৫০ গ্রাম'] }
  ]},

  // --- Category: WEEKLY COMBO (weekly-combo) - 4 items ---
  { cat: 'weekly-combo', items: [
    { 
      title: 'সাপ্তাহিক লাইট কাম্বো প্যাক (৳৫০০)', 
      slug: 'weekly-light-basket', 
      price: 500, 
      unit: 'প্যাকেজ', 
      farmerId: 27, 
      img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600', 
      weightOptions: ['১ বাস্কেট (বাজেট প্যাক)'], 
      best: false,
      gallery: [
        'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1610348725531-843dff14a9da?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1506477331477-33d5d8b3dc85?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=600'
      ],
      specs: [
        'আলু (৩ কেজি)',
        'দেশি পেঁয়াজ (১ কেজি)',
        'রসুন (২৫০ গ্রাম)',
        'কাঁচামরিচ (২৫০ গ্রাম)',
        'তাজা লাল শাক (১ আটি)'
      ]
    },
    { 
      title: 'সাপ্তাহিক স্ট্যান্ডার্ড কম্বো প্যাক (৳১০০০)', 
      slug: 'weekly-standard-basket', 
      price: 1000, 
      unit: 'প্যাকেজ', 
      farmerId: 3, 
      img: 'https://images.unsplash.com/photo-1610348725531-843dff14a9da?auto=format&fit=crop&q=80&w=600', 
      weightOptions: ['১ বাস্কেট (স্ট্যান্ডার্ড)'], 
      best: true,
      gallery: [
        'https://images.unsplash.com/photo-1610348725531-843dff14a9da?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1506477331477-33d5d8b3dc85?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=600'
      ],
      specs: [
        'আলু (৫ কেজি)',
        'দেশি পেঁয়াজ (২ কেজি)',
        'রসুন (৫০০ গ্রাম)',
        'কাঁচা আদা (৫০০ গ্রাম)',
        'তাজা গোল বেগুন (১ কেজি)',
        'পালং শাক (২ আটি)',
        'কাঁচামরিচ (৫০০ গ্রাম)',
        'মিষ্টি কুমড়া (১ পিস)'
      ]
    },
    { 
      title: 'সাপ্তাহিক প্রিমিয়াম ফ্যামিলি কম্বো (৳১৫০০)', 
      slug: 'weekly-premium-basket', 
      price: 1500, 
      unit: 'প্যাকেজ', 
      farmerId: 2, 
      img: 'https://images.unsplash.com/photo-1506477331477-33d5d8b3dc85?auto=format&fit=crop&q=80&w=600', 
      weightOptions: ['১ বাস্কেট (প্রিমিয়াম)'], 
      best: true,
      gallery: [
        'https://images.unsplash.com/photo-1506477331477-33d5d8b3dc85?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1610348725531-843dff14a9da?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=600'
      ],
      specs: [
        'আলু (৭ কেজি)',
        'দেশি পেঁয়াজ (৩ কেজি)',
        'রসুন (১ কেজি)',
        'কাঁচা আদা (১ কেজি)',
        'তাজা গোল বেগুন (১.৫ কেজি)',
        'অর্গানিক ফুলকপি (২ পিস)',
        'বাঁধাকপি (২ পিস)',
        'লাল ও পালং শাক (৫ আটি)',
        'কাঁচামরিচ (৫০০ গ্রাম)',
        'তাজা লাল টমেটো (২ কেজি)',
        'কচি লাউ (১ পিস)'
      ]
    },
    { 
      title: 'সাপ্তাহিক মেগা লাক্সারি কম্বো (৳২০০০)', 
      slug: 'weekly-mega-basket', 
      price: 2000, 
      unit: 'প্যাকেজ', 
      farmerId: 1, 
      img: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=600', 
      weightOptions: ['১ বাস্কেট (মেগা লাক্সারি)'], 
      best: false,
      gallery: [
        'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1610348725531-843dff14a9da?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1506477331477-33d5d8b3dc85?auto=format&fit=crop&q=80&w=600'
      ],
      specs: [
        'আলু (১০ কেজি)',
        'দেশি পেঁয়াজ (৫ কেজি)',
        'রসুন (১.৫ কেজি)',
        'কাঁচা আদা (১.৫ কেজি)',
        'তাজা গোল বেগুন (২ কেজি)',
        'জলপাইগুড়ির কচি লাউ (২ পিস)',
        'অর্গানিক ফুলকপি (৪ পিস)',
        'তাজা লাল টমেটো (৩ কেজি)',
        'লাল ও পালং শাক (৮ আটি)',
        'কাঁচামরিচ (১ কেজি)',
        'কাগজি লেবু (১ হালি)',
        'উপহার: দেশি গাভীর খাঁটি ঘি (২৫০ গ্রাম)'
      ]
    }
  ]}
];

// Add ready-to-cook products directly to standard meta
export const READY_TO_COOK_METADATA = [
  {
    title: 'ভেজিটেবল মিক্স রেডি-টু-কুক (Vegetable Ready-to-Cook)',
    slug: 'vegetable-ready-cook',
    price: 499,
    unit: '১ বাস্কেট',
    farmerId: 1,
    best: true,
    stock: 45,
    img: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=400',
    gallery: [
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=600'
    ],
    specs: ['বানানোর সময় কমায়', '১০০% তাজা সবজি', 'ধুয়ে কাটা ও পরিষ্কার করা']
  },
  {
    title: 'ভেজিটেবল প্লাস মিট মিক্স রেডি-টু-কুক (Vegetable & Meat Ready-to-Cook)',
    slug: 'vegetable-plus-meat',
    price: 999,
    unit: '১ বাস্কেট',
    farmerId: 2,
    best: true,
    stock: 35,
    img: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=400',
    gallery: [
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=600'
    ],
    specs: ['দেশি চিকেন স্লাইস', 'মশলাপাতি সহ প্রস্তুত', 'হাইজিন গ্রেড কাটিং']
  },
  {
    title: 'ফিশ মিক্স রেডি-টু-কুক (Fish Mix Ready-to-Cook)',
    slug: 'fish-mix-ready-cook',
    price: 1499,
    unit: '১ বাস্কেট',
    farmerId: 6,
    best: true,
    stock: 25,
    img: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=400',
    gallery: [
      'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=600'
    ],
    specs: ['নদীয়া চিংড়ি ও পাবদা', 'সম্পূর্ণ আঁশ ও কাঁটা কাটা', 'মশলার নিখুঁত কম্বো']
  },
  {
    title: 'খাসি ও ভেড়ার মাংসের মিক্স রেডি-টু-কুক (Lamb & Goat Meat Mix)',
    slug: 'lamb-goat-ready-cook',
    price: 1999,
    unit: '১ বাস্কেট',
    farmerId: 13,
    best: true,
    stock: 20,
    img: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&q=80&w=400',
    gallery: [
      'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&q=80&w=600'
    ],
    specs: ['প্রিমিয়াম খাসি ও ভেড়া', 'হাড় ছাড়া সলিড মিট', 'বাবুর্চি স্পেশাল গরম মশলা']
  },
  {
    title: 'সব একসাথে অল-ইন-ওয়ান মিক্স রেডি-টু-কুক (All Mixed Together Ready-to-Cook)',
    slug: 'all-mixed-together-ready-cook',
    price: 1999,
    unit: '১ বাস্কেট',
    farmerId: 15,
    best: true,
    stock: 15,
    img: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=400',
    gallery: [
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=600'
    ],
    specs: ['মাছ, মাংস ও সবজির মহা মিলন', 'মেগা লাইফস্টাইল কম্বো ফ্যামিলি প্যাক', 'সরাসরি ফ্রাই বা কারির জন্য প্রস্তুত']
  }
];

// Helper to compile metadata into 150 comprehensive type-safe Product instances
const generateProducts = (): Product[] => {
  const pList: Product[] = [];
  let globalId = 1;

  RAW_PRODUCTS_METADATA.forEach(catGroup => {
    catGroup.items.forEach(item => {
      // Find matching farmer
      const farmerObj = INITIAL_FARMERS.find(f => f.id === item.farmerId) || INITIAL_FARMERS[0];
      
      // Compute beautiful custom Bengali descriptions based on name
      const customDescription = `কৃষক বাজার সরাসরি গ্রাহক সম্পর্কের উদাহরণ। এই ${item.title} উৎপাদন করেছেন আমাদের প্রকৃত মাঠ পর্যায়ের নিবন্ধিত দক্ষ কৃষক ${farmerObj.name}। কোনো কৃত্রিম রাসায়নিক স্প্রে অথবা কৃত্রিম প্রিজারভেটিভ ব্যবহার ছাড়াই সম্পূর্ণ প্রাকৃতিক উপায়ে উর্বর জৈব সারে এই ফসল ফলানো হয়েছে। সরাসরি মাঠ থেকে তোলার মাত্র ১২ ঘণ্টার মধ্যে এটি আমাদের ঢাকা প্রধান কার্যালয়ে আনা হয় এবং সম্পূর্ণ ও হাইজিন কন্ট্রোল প্যাকেজিঙে আমরা পৌঁছে দেই আপনার রান্নাঘরে। তরতাজা ঘ্রাণ এবং শতভাগ পুষ্টির গ্যারান্টি!`;

      pList.push({
        id: globalId++,
        title: item.title,
        slug: item.slug,
        price: item.price,
        unit: item.unit,
        cat: catGroup.cat as any,
        farmer: farmerObj.name,
        farmerId: farmerObj.id,
        img: item.img,
        // High fidelity gallery with 3 additional variations/closeups to maintain high premium standard
        gallery: (item as any).gallery || [
          item.img,
          item.img.replace('q=80', 'q=80&sat=-15'), // custom saturation shifts for different view feel
          item.img.replace('q=80', 'q=80&contrast=110'),
          item.img.replace('q=80', 'q=80&brightness=95')
        ],
        description: customDescription,
        specs: (item as any).specs || [],
        // Generating premium ratings between 4.5 and 5.0
        rating: Number((4.5 + Math.random() * 0.5).toFixed(1)),
        weightOptions: item.weightOptions || ['৫০০ গ্রাম', '১ কেজি', '২ কেজি'],
        isBestSeller: item.best || false,
        stock: (item as any).stock || Math.floor(15 + Math.random() * 75)
      });
    });
  });

  // Compile ready-to-cook
  READY_TO_COOK_METADATA.forEach(item => {
    const farmerObj = INITIAL_FARMERS.find(f => f.id === item.farmerId) || INITIAL_FARMERS[0];
    const customDescription = `কৃষক বাজার সরাসরি গ্রাহক সম্পর্কের উদাহরণ। এই সুস্বাদু প্রিমিয়াম ${item.title} উৎপাদন করেছেন আমাদের নিবন্ধিত প্রান্তিক দক্ষ কৃষক ${farmerObj.name}। সম্পূর্ণ স্বাস্থ্যসম্মত পদ্ধতিতে সরাসরি মাঠের তাজা শাকসবজি ও মাংসের সমন্বয়ে এই রেডি-টু-কুক বাটি প্রস্তুত। জাস্ট প্যানে ঢেলে দিন আর উপভোগ করুন গরম গরম খাবারের আসল স্বাদ!`;

    pList.push({
      id: globalId++,
      title: item.title,
      slug: item.slug,
      price: item.price,
      unit: item.unit,
      cat: 'ready-to-cook',
      farmer: farmerObj.name,
      farmerId: farmerObj.id,
      img: item.img,
      gallery: item.gallery,
      description: customDescription,
      specs: item.specs,
      rating: Number((4.7 + Math.random() * 0.3).toFixed(1)), // top rated
      weightOptions: ['১ বাস্কেট'],
      isBestSeller: true,
      stock: item.stock
    });
  });

  // 1. Overwrite and correct images for existing products with official Shopify links
  pList.forEach(p => {
    if (p.title === 'বেগুন') {
      const u = 'https://cdn.shopify.com/s/files/1/0991/0717/6761/files/download.jpg?v=1778788778';
      p.img = u;
      p.gallery = [u, u, u, u, u];
    } else if (p.title === 'লাউ') {
      const u = 'https://cdn.shopify.com/s/files/1/0991/0717/6761/files/download_2.jpg?v=1778788779';
      p.img = u;
      p.gallery = [u, u, u, u, u];
    } else if (p.title === 'পুঁই শাক') {
      const u = 'https://cdn.shopify.com/s/files/1/0991/0717/6761/files/download.jpg?v=1778788778';
      p.img = u;
      p.gallery = [u, u, u, u, u];
    } else if (p.title === 'জ্যান্ত মাগুর মাছ') {
      const u = 'https://cdn.shopify.com/s/files/1/0991/0717/6761/files/download_6.jpg?v=1778788778';
      p.img = u;
      p.gallery = [u, u, u, u, u];
    } else if (p.slug === 'magur-fish') {
      const u = 'https://cdn.shopify.com/s/files/1/0991/0717/6761/files/download_6.jpg?v=1778788778';
      p.img = u;
      p.gallery = [u, u, u, u, u];
    }
  });

  // 2. Append all new products dynamically below the existing ones as required, each with 5 images in gallery
  const newProductsList = [
    {
      title: 'মিক্স সবজি প্যাক',
      slug: 'mix-vege-pack',
      price: 120,
      unit: 'প্যাক',
      cat: 'vege',
      farmer: 'রহিমা বেগম',
      farmerId: 2,
      img: 'https://cdn.shopify.com/s/files/1/0991/0717/6761/files/download_7.jpg?v=1778788779',
      desc: 'তাজা ও গুণগত মানসম্পন্ন কাটা শীতকালীন ৫ রকম সবজির মিক্স প্যাক। জাস্ট রান্না করার জন্য প্রস্তুত।'
    },
    {
      title: 'মুলা শাক',
      slug: 'mula-shak-fresh',
      price: 15,
      unit: 'আটি',
      cat: 'leafy',
      farmer: 'খাদিজา আক্তার',
      farmerId: 17,
      img: 'https://cdn.shopify.com/s/files/1/0991/0717/6761/files/images_21.jpg?v=1778788778',
      desc: 'জমির কচি তাজা স্বাস্থ্যকর মুলা শাক। কোনো সার ক্ষতিকারক স্প্রে ছাড়াই অর্গানিক উপায়ে উৎপাদিত।'
    },
    {
      title: 'কাটা পেঁয়াজ প্যাক',
      slug: 'kata-peyaj-pack',
      price: 95,
      unit: 'প্যাক',
      cat: 'ready-to-cook',
      farmer: 'দুলাল শেখ',
      farmerId: 12,
      img: 'https://cdn.shopify.com/s/files/1/0991/0717/6761/files/images_20.jpg?v=1778788779',
      desc: 'ধোয়া ও হাইজেনিক উপায়ে নিখুঁতভাবে কাটা দেশি লাল পেঁয়াজের খোসা ছাড়ানো প্যাক। রান্নার ঝামেলা এড়াতে সহায়ক।'
    },
    {
      title: 'কালো মাগুর মাছ',
      slug: 'black-magur-fish',
      price: 650,
      unit: 'কেজি',
      cat: 'fish',
      farmer: 'আলमগীর হোসেন',
      farmerId: 5,
      img: 'https://cdn.shopify.com/s/files/1/0991/0717/6761/files/download_6.jpg?v=1778788778',
      desc: 'বিল ও খামারের সম্পূর্ণ তাজা জ্যান্ত কালো কালচে মখমলি জীবন্ত মাগুর মাছ। রক্ত ও শক্তি বৃদ্ধিতে দারুন পুষ্টিকর।'
    },
    {
      title: 'দেশি শিং মাছ',
      slug: 'native-shing-fish',
      price: 550,
      unit: 'কেজি',
      cat: 'fish',
      farmer: 'আলमগীর হোসেন',
      farmerId: 5,
      img: 'https://cdn.shopify.com/s/files/1/0991/0717/6761/files/images_19.jpg?v=1778788778',
      desc: 'সুনামগঞ্জের হাওড়ের বিখ্যাত জ্যান্ত দেশি লালচে শিং মাছ। রোগ প্রতিরোধক্ষমতা বৃদ্ধিতে অতুলনীয়।'
    },
    {
      title: 'দেশি লাউ',
      slug: 'deshi-lau-gourd',
      price: 55,
      unit: 'পিস',
      cat: 'vege',
      farmer: 'করিম মিয়া',
      farmerId: 1,
      img: 'https://cdn.shopify.com/s/files/1/0991/0717/6761/files/download_2.jpg?v=1778788779',
      desc: 'মাটির ও বাঁশের মাচায় ফলে উঠা কচি ভেজালহীন মিষ্টি পানিময় দেশি তরতাজা লাউ।'
    }
  ];

  newProductsList.forEach(np => {
    const mainImg = np.img;
    pList.push({
      id: globalId++,
      title: np.title,
      slug: np.slug,
      price: np.price,
      unit: np.unit,
      cat: np.cat as any,
      farmer: np.farmer,
      farmerId: np.farmerId,
      img: np.img,
      gallery: [mainImg, mainImg, mainImg, mainImg, mainImg],
      description: np.desc + ' কৃষক বাজার সরাসরি গ্রাহক সম্পর্কের উদাহরণ। কোনো কৃত্রিম রাসায়নিক স্প্রে অথবা কৃত্রিম প্রিজারভেটিভ ব্যবহার ছাড়াই সম্পূর্ণ প্রাকৃতিক উপায়ে উর্বর জৈব সারে এই ফসল ফলানো হয়েছে।',
      specs: ['শতভাগ তাজা গ্যারান্টি', 'সরাসরি খামারের ফসল'],
      rating: 4.8,
      weightOptions: np.unit === 'পিস' ? ['১ পিস'] : ['১ কেজি', '২ কেজি'],
      isBestSeller: true,
      stock: 45
    });
  });

  return pList;
};

// Export calculated products
export const INITIAL_PRODUCTS: Product[] = generateProducts();

export const INITIAL_VIDEOS: Video[] = [
  { id: 1, url: '5RE2Gx6643U', title: 'খেতে টাটকা সবজি সংগ্রহ' },
  { id: 2, url: 'NRveNHaYbVU', title: 'আমাদের কৃষকের সোনালী ধানের খেত' },
  { id: 3, url: 'Qd1SfGJxPk8', title: 'বিলাত ধনে ফসল তোলার দৃশ্য' },
  { id: 4, url: '8WOd3SfGXt0', title: 'রাসায়নিক মুক্ত তাজা টমেটো বাগান' },
  { id: 5, url: 'd-lmVLO9I-M', title: 'দালাল শোষণ মুক্ত কৃষকের সকাল' },
  { id: 6, url: 'Lp4F9gNm1zk', title: 'সুন্দরবনের খলিশা মধু সংগ্রহ পর্ব' },
  { id: 7, url: 'HIHkgZezJus', title: 'পদ্মার জ্যান্ত ইলিশ ধরার লাইভ দৃশ্য' },
  { id: 8, url: '116Yti89CKI', title: 'খাঁটি গরুর দুধ দোহন পদ্ধতি' },
  { id: 9, url: '5RE2Gx6643U', title: 'ভেজালমুক্ত মসলা গুঁড়াকরণ কারখানা' },
  { id: 10, url: 'NRveNHaYbVU', title: 'সাপ্তাহিক বাস্কেট প্যাকিং লাইভ' }
];

export const INITIAL_REVIEWS: Review[] = [
  { id: 1, user: 'হাসান রিফাত', loc: 'মিরপুর, ঢাকা', rating: 5, date: '১-২ দিন আগে', text: 'সবজিগুলো খুবই ফ্রেশ ছিল এবং একদম সরাসরি মাটির সতেজ গন্ধ আসছিল! দামও অনেক সাশ্রয়ী। ধন্যবাদ কৃষক বাজারকে।' },
  { id: 2, user: 'নুসরাত জাহান', loc: 'উত্তরা, ঢাকা', rating: 5, date: '৩ দিন আগে', text: 'সরাসরি কৃষকদের পণ্য কিনতে পেরে খুব ভালো লাগছে। দالاলের অন্যায় শোষণ মুক্ত ব্যবসা আমাদের একান্ত কাম্য।' },
  { id: 3, user: 'মোহাম্মদ সাঈদ', loc: 'ধানমন্ডি, ঢাকা', rating: 5, date: '৫ দিন আগে', text: 'চাল এবং খাঁটি সরিষার তেল নিয়েছিলাম। মানের দিক দিয়ে কোনো আপস নেই। বগুড়া দই আর ঘিও অসাধারণ ছিল।' },
  { id: 4, user: 'ডলি বড়ুয়া', loc: 'বনানী, ঢাকা', rating: 5, date: '৬ দিন আগে', text: 'রেডি টু কুক শাক আর কাটা আলু খুবই হেল্পফুল আমাদের মতো চাকরীজীবী নারীদের জন্য। ডেলিভারিও সময়ে হয়েছে!' },
  { id: 5, user: 'আফজাল হোসেন', loc: 'খিলগাঁও, ঢাকা', rating: 4, date: '৭ দিন আগে', text: 'শাক সবজি একদম সতেজ ছিল। ডেলিভারি বয় অনেক ভদ্র এবং অর্গানিক উপায়ের সত্যতা প্রশংসনীয়!' },
  { id: 6, user: 'ফারহানা ইয়াসমিন', loc: 'গুলশান, ঢাকা', rating: 5, date: '৮ দিন আগে', text: 'ফ্যামিলি সোপ বাস্কেট ৫ কেজি অর্ডার করেছিলাম। অনেক তাজা মরিচ আর ধনেপাতা ছিল। বাস্কেটের দাম অত্যন্ত জুতসই।' }
];

export const INITIAL_BANNERS: HeroBanner[] = [
  {
    id: 1,
    img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200',
    title: 'মাঠের তাজা সবজি সরাসরি',
    subtitle: 'বগুড়া ও যশোরের জমি থেকে সংগৃহীত নিরাপদ সুষম খাবার'
  },
  {
    id: 2,
    img: 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?auto=format&fit=crop&q=80&w=1200',
    title: 'মধ্যস্বত্বভোগী ছাড়া খাঁটি বাজার',
    subtitle: '১০০% অরগানিক সার প্রয়োগ করা স্বাস্থ্যকর সবজি ও ফলমূল'
  },
  {
    id: 3,
    img: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=1200',
    title: 'ফ্যামিলি কম্বো ও বাস্কেট অফার',
    subtitle: 'সারা সপ্তাহের রান্নাঘরের তাজা সবজির কম্বো প্যাকেজ'
  }
];

export const INITIAL_OFFERS: PromoOffer[] = [
  {
    id: 'enjoy',
    title: 'Enjoy Free Delivery (ফ্রি ডেলিভারি)',
    subtitle: '৳ ৫০০ টাকার প্রিমিয়াম বাস্কেট অর্ডারে সম্পূর্ণ জিরো ডেলিভারি চার্জ!',
    img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=400',
    linkText: 'প্রিমিয়াম নিন ➔',
    categoryTag: 'ফ্রি ডেলিভারি'
  },
  {
    id: 'do-good',
    title: 'Do Good Farmers (কৃষকের মুখে হাসি)',
    subtitle: 'ন্যায্যমূল্যে সরাসরি কৃষকদের উৎপাদিত তাজা ফসল কিনে দালালের শোষণ রোধ করুন।',
    img: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&q=80&w=400',
    linkText: 'অর্ডার করুন ➔',
    categoryTag: 'ন্যায্য মূল্য'
  },
  {
    id: 'ready-to-cook',
    title: 'Ready To Cook (রান্নার জন্য প্রস্তুত)',
    subtitle: 'সব ধুয়ে ও মচমচে সতেজ করে কাটা মিক্স সবজি বাটি, জাস্ট প্যানে ঢেলে দিন!',
    img: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=400',
    linkText: 'মেন্যু দেখুন ➔',
    categoryTag: 'রেডি টু কুক'
  }
];


