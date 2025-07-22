import { useNavigate } from "react-router-dom"

export default function useNavigation() {
  const navigate = useNavigate()

  const gotoHome = () => navigate('/melodify/')

  const gotoPlayer = (song, resetSearch) => {
    if (resetSearch) resetSearch()
    navigate(`/melodify/player/${song.id}`, {
      state: {
        song,
        isPlayingParam: true
      }
    })
  }

  return {
    gotoHome,
    gotoPlayer
  }
}