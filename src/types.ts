export type Category = string;

export interface Product {
  id: number;
  title: string;
  slug: string;
  price: number;
  unit: string;
  cat: Category;
  farmer: string;
  farmerId: number;
  img: string;
  gallery?: string[];
  description?: string;
  rating?: number;
  weightOptions?: string[];
  isBestSeller?: boolean;
  approved?: boolean;
  disabled?: boolean;
  housewife?: string;
  availableSoon?: boolean;
  specs?: string[];
  stock?: number;
  harvestDate?: string;
  deliveryDate?: string;
}

export interface Farmer {
  id: number;
  name: string;
  location: string;
  products: string;
  rating: number;
  sales: number;
  avatar: string;
  gender: 'male' | 'female';
  verified: boolean;
  password?: string;
  farmName?: string;
  bio?: string;
  nid?: string;
  approved?: boolean;
  phone?: string;
  disabled?: boolean;
}

export interface Video {
  id: number;
  url: string;
  title: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedWeight?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerEmail?: string;
  deliveryArea?: string;
  shippingCost?: number;
  date: string;
  status: 'pending' | 'confirmed' | 'packed' | 'shipped' | 'out_for_delivery' | 'delivered' | 'completed' | 'cancelled';
}

export interface Review {
  id: number;
  user: string;
  loc: string;
  rating: number;
  date: string;
  text: string;
  productId?: number;
}

export interface HeroBanner {
  id: number;
  img: string;
  title: string;
  subtitle: string;
  link?: string;
}

export interface PromoOffer {
  id: string;
  title: string;
  subtitle: string;
  img: string;
  linkText: string;
  categoryTag: string;
}

