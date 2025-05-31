import { useNavigate } from "react-router-dom"

export default function useNavigation() {
  const navigate = useNavigate()

  const gotoPlayer = (song, resetSearch) => {
    if (resetSearch) resetSearch()
    navigate(`/player/${song.id}`, {
      state: {
        song,
        isPlayingParam: true
      }
    })
  }
  return {
    gotoPlayer
  }
}