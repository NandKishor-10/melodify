const API_URL = import.meta.env.VITE_API_URL

export async function fetchSongs(query) {  
  const response = await fetch(`${API_URL}/search/songs?query=${query}&limit=10`)
  return await response.json()
}

export async function fetchSingleSong(query) {
  const response = await fetch(`${API_URL}/songs?ids=${query}`)
  return await response.json()
}

