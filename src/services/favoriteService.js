import { supabase } from '../lib/supabase'

export async function listFavorites(userId) {
  const { data, error } = await supabase
    .from('favorites')
    .select('id, song_id')
    .eq('user_id', userId)
  if (error) throw error
  return data
}

export async function addFavorite(userId, songId) {
  const { data, error } = await supabase
    .from('favorites')
    .insert({ user_id: userId, song_id: songId })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function removeFavorite(userId, songId) {
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('song_id', songId)
  if (error) throw error
}
