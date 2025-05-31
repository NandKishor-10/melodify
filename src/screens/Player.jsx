import { Box, Button, darken, lighten, Slider, Typography, useMediaQuery, useTheme, IconButton } from '@mui/material'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchSingleSong } from '../components/apiService'
import { formatTime } from '../components/utils'
import { Forward5Rounded, PauseRounded, PlayArrowRounded, Replay5Rounded } from '@mui/icons-material'

export default function Player({ argbToHex, isDarkMode, md3Colors }) {
  const isMobile = useMediaQuery(useTheme().breakpoints.down('md'))
  const songId = useParams().id
  const [song, setSong] = useState(null)
  const audioRef = useRef(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    fetchSingleSong(songId).then(setSong).catch(console.error)
  }, [songId])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !song) return
  
    const updateTime = () => setCurrentTime(audio.currentTime)
    const setAudioDuration = () => setDuration(audio.duration)
  
    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', setAudioDuration)
  
    // Autoplay when song loads
    audio.play().then(() => {
      setIsPlaying(true)
    }).catch((err) => {
      console.warn('Autoplay blocked:', err)
    })
  
    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', setAudioDuration)
    }
  }, [song])
  

  if (!song) return null

  const { image, artists, title, url } = song

  const handleSliderChange = (event, newValue) => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = newValue
    setCurrentTime(newValue)
  }

  const togglePlayPause = () => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      audio.play()
    } else {
      audio.pause()
    }
    setIsPlaying(!isPlaying)
  }

  const skip = (seconds) => {
    const audio = audioRef.current
    if (!audio) return
    let newTime = audio.currentTime + seconds
    newTime = Math.min(Math.max(newTime, 0), duration)
    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  return (
    <Box
      sx={{
        display: 'flex', flexDirection: 'column', height: '100%', my: 2, width: '95%',
        alignItems: 'center', justifyContent: 'center', alignSelf: 'center', justifySelf: 'end',
        overflow: 'auto', scrollbarWidth: 'none', borderRadius: '1rem',
        backgroundColor: isDarkMode
          ? darken(argbToHex(md3Colors.primaryContainer), 0)
          : lighten(argbToHex(md3Colors.primaryContainer), 0),
        color: argbToHex(md3Colors.onPrimaryContainer),
        boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
      }}
    >
      <audio ref={audioRef} src={url} />

      <span
        style={{
          display: 'flex', width: '75%', flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'center', justifyContent: 'center', gap: '10%',
        }}
      >
        <img
          src={image}
          alt='Album Cover'
          style={{
            width: isMobile ? '45vw' : '35vh',
            height: isMobile ? '45vw' : '35vh',
            objectFit: 'fill', borderRadius: '2rem',
            boxShadow: '0 8px 30px rgba(0,0,0,0.3)', marginBottom: '2rem',
          }}
        />
        <Box textAlign={isMobile ? 'center' : 'start'}>
          <Typography variant='h4' fontWeight='bold' gutterBottom>
            {title}
          </Typography>
          <Typography variant='subtitle1' color={argbToHex(md3Colors.secondary)}>
            {artists}
          </Typography>
        </Box>
      </span>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2, width: isMobile ? '80%' : '50%' }}>
        <Typography variant='caption' sx={{ alignSelf: 'flex-start' }}>{formatTime(currentTime)}</Typography>
        <Slider
          value={currentTime}
          min={0}
          max={duration}
          step={0.1}
          onChange={handleSliderChange}
          sx={{
            color: `#${md3Colors.primary}`,
            '& .MuiSlider-thumb': {
              width: 14,
              height: 14,
              bgcolor: argbToHex(md3Colors.primary),
              '&:hover': { boxShadow: `0 0 0 8px rgba(103, 80, 164, 0.2)` },
              '&.Mui-active': { width: 20, height: 20 },
            },
          }}
        />
        <Typography variant='caption' sx={{ alignSelf: 'flex-end' }}>{formatTime(duration)}</Typography>

        <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-evenly', alignItems: 'center', mt: 1 }}>
          <IconButton onClick={() => skip(-5)}
            sx={{
              color: argbToHex(md3Colors.onPrimaryContainer),
            }}><Replay5Rounded fontSize='large' /></IconButton>
          <IconButton onClick={togglePlayPause}
            sx={{
              color: argbToHex(md3Colors.onPrimaryContainer),
              width: 64,
              borderRadius: isPlaying ? '1rem' : '50%',
              height: 64,
              padding: '1rem',
              backgroundColor: argbToHex(md3Colors.inversePrimary),
            }}>
            {isPlaying ? <PauseRounded fontSize='large' /> : <PlayArrowRounded fontSize='large' />}
          </IconButton>
          <IconButton onClick={() => skip(5)}
            sx={{
              color: argbToHex(md3Colors.onPrimaryContainer)
            }}><Forward5Rounded fontSize='large' /></IconButton>
        </Box>
      </Box>
    </Box>
  )
}
