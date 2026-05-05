import { supabase } from '../lib/supabase'

const SONG_BUCKET = 'songs'
const COVER_BUCKET = 'covers'

export async function listSongs(userId) {
  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function uploadSongFile(userId, file) {
  const ext = file.name.split('.').pop()
  const path = `${userId}/${crypto.randomUUID()}.${ext}`
  const { error } = await supabase.storage.from(SONG_BUCKET).upload(path, file)
  if (error) throw error
  return path
}

export async function uploadCoverFile(userId, file) {
  const ext = file.name.split('.').pop()
  const path = `${userId}/${crypto.randomUUID()}.${ext}`
  const { error } = await supabase.storage.from(COVER_BUCKET).upload(path, file)
  if (error) throw error
  return path
}

export function getStoragePublicUrl(bucket, path) {
  if (!path) return ''
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

export async function createSong(payload) {
  const { data, error } = await supabase
    .from('songs')
    .insert(payload)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateSong(songId, updates) {
  const { data, error } = await supabase
    .from('songs')
    .update(updates)
    .eq('id', songId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteSong(songId) {
  const { error } = await supabase.from('songs').delete().eq('id', songId)
  if (error) throw error
}

export async function deleteStorageObject(bucket, path) {
  if (!path) return
  const { error } = await supabase.storage.from(bucket).remove([path])
  if (error) throw error
}

export { SONG_BUCKET, COVER_BUCKET }
