import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://dzqjexqdqmldhvonivvi.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6cWpleHFkcW1sZGh2b25pdnZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1NjczNTcsImV4cCI6MjA5NjE0MzM1N30.x6RLOX4uvC-5ySOlbKAwYU4Hq7c7Mgy750sZ2sAhoIQ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function uploadImageToSupabase(
  file: File,
  bucket: string = 'krishok-images',
  folder: string = 'products'
): Promise<string | null> {
  try {
    const ext = file.name.split('.').pop() || 'jpg';
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '31536000',
        upsert: false
      });

    if (error) {
      console.error('Supabase upload error:', error);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  } catch (err) {
    console.error('Image upload failed:', err);
    return null;
  }
}

export async function saveOrderToSupabase(order: any) {
  const { error } = await supabase.from('orders').upsert(order);
  if (error) console.error('Supabase order save error:', error);
  return !error;
}

export async function saveFarmerToSupabase(farmer: any) {
  const { error } = await supabase.from('farmers').upsert(farmer);
  if (error) console.error('Supabase farmer save error:', error);
  return !error;
}

export async function saveSubscriptionToSupabase(subscription: any) {
  const { error } = await supabase.from('subscriptions').upsert(subscription);
  if (error) console.error('Supabase subscription save error:', error);
  return !error;
}

export async function saveCustomerToSupabase(customer: any) {
  const { error } = await supabase.from('customers').upsert(customer);
  if (error) console.error('Supabase customer save error:', error);
  return !error;
}
