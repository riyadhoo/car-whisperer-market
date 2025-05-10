
import { supabase } from './client';
import { Car, Part, CarComment } from '@/data/types';

// User profile functions
export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
};

export const updateProfile = async (userId: string, updates: any) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);

  if (error) throw error;
  return data;
};

// Parts functions
export const fetchParts = async ({ category, condition, minPrice, maxPrice }: { 
  category?: string;
  condition?: 'New' | 'Used' | 'Refurbished';
  minPrice?: number;
  maxPrice?: number;
}) => {
  let query = supabase.from('parts').select(`
    *,
    profiles:owner_id (id, name, is_dealer)
  `);

  if (category) {
    query = query.eq('category', category);
  }

  if (condition) {
    query = query.eq('condition', condition);
  }

  if (minPrice !== undefined) {
    query = query.gte('price', minPrice);
  }

  if (maxPrice !== undefined) {
    query = query.lte('price', maxPrice);
  }

  const { data, error } = await query;

  if (error) throw error;
  
  return data.map((part: any) => ({
    id: part.id,
    name: part.name,
    image: part.image,
    price: part.price,
    condition: part.condition,
    seller: {
      id: part.profiles.id,
      name: part.profiles.name,
      type: part.profiles.is_dealer ? 'Shop' : 'Individual',
    },
    compatibility: part.compatibility || [],
    description: part.description,
    category: part.category,
    inStock: part.in_stock,
    ownerId: part.owner_id,
  }));
};

export const createPart = async (partData: Omit<Part, 'id' | 'seller'>) => {
  const { data, error } = await supabase
    .from('parts')
    .insert([{
      name: partData.name,
      image: partData.image,
      price: partData.price,
      condition: partData.condition,
      owner_id: partData.ownerId,
      compatibility: partData.compatibility,
      description: partData.description,
      category: partData.category,
      in_stock: partData.inStock
    }])
    .select();

  if (error) throw error;
  return data[0];
};

// Comments/Ratings functions
export const fetchCommentsForCar = async (carId: string) => {
  const { data, error } = await supabase
    .from('comments')
    .select(`
      *,
      profiles:user_id (id, name, avatar_url)
    `)
    .eq('car_id', carId);

  if (error) throw error;

  return data.map((comment: any) => ({
    id: comment.id,
    user: {
      name: comment.profiles.name,
      avatar: comment.profiles.avatar_url,
    },
    date: new Date(comment.created_at).toLocaleDateString(),
    rating: comment.rating,
    content: comment.content,
    likes: comment.likes,
    dislikes: comment.dislikes,
    carId: comment.car_id
  }));
};

export const addComment = async (comment: Omit<CarComment, 'id' | 'user' | 'date' | 'likes' | 'dislikes'> & { userId: string }) => {
  const { data, error } = await supabase
    .from('comments')
    .insert([{
      user_id: comment.userId,
      car_id: comment.carId,
      rating: comment.rating,
      content: comment.content
    }])
    .select();

  if (error) throw error;
  return data[0];
};

// File upload utilities
export const uploadFile = async (file: File, path: string) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
  const filePath = `${path}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('public')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from('public').getPublicUrl(filePath);
  
  return data.publicUrl;
};
