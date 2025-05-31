export async function fetchSongs(query) {
  const response = await fetch(`/search/${query}?count=10`)
  return await response.json()
}


export async function fetchSingleSong(query) {
  const response = await fetch(`/song/${query}`)
  return await response.json()
}

