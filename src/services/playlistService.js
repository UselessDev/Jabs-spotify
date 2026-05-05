import { supabase } from '../lib/supabase'

export async function listPlaylists(userId) {
  const { data, error } = await supabase
    .from('playlists')
    .select('*, playlist_songs(id, song_id, position, songs(*))')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data.map((playlist) => ({
    ...playlist,
    playlist_songs: [...(playlist.playlist_songs ?? [])].sort(
      (a, b) => a.position - b.position,
    ),
  }))
}

export async function createPlaylist(payload) {
  const { data, error } = await supabase
    .from('playlists')
    .insert(payload)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updatePlaylist(playlistId, updates) {
  const { data, error } = await supabase
    .from('playlists')
    .update(updates)
    .eq('id', playlistId)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deletePlaylist(playlistId) {
  const { error } = await supabase.from('playlists').delete().eq('id', playlistId)
  if (error) throw error
}

export async function addSongToPlaylist(playlistId, songId, position) {
  const { error } = await supabase
    .from('playlist_songs')
    .insert({ playlist_id: playlistId, song_id: songId, position })
  if (error) throw error
}

export async function removeSongFromPlaylist(playlistSongId) {
  const { error } = await supabase
    .from('playlist_songs')
    .delete()
    .eq('id', playlistSongId)
  if (error) throw error
}

export async function reorderPlaylistSongs(playlistId, orderedRows) {
  const updates = orderedRows.map((row, idx) => ({
    id: row.id,
    playlist_id: playlistId,
    song_id: row.song_id,
    position: idx,
  }))
  const { error } = await supabase.from('playlist_songs').upsert(updates)
  if (error) throw error
}
