import {
  Box, IconButton, Slider, Typography,
  darken, lighten, useMediaQuery, useTheme, MenuItem, Select
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchSingleSong } from '../components/apiService';
import { formatTime } from '../components/utils';
import { Forward5Rounded, PauseRounded, PlayArrowRounded, Replay5Rounded } from '@mui/icons-material';

export default function Player({ argbToHex, isDarkMode, md3Colors }) {
  const isMobile = useMediaQuery(useTheme().breakpoints.down('md'));
  const songId = useParams().id;
  const [song, setSong] = useState(null);
  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState('');

  useEffect(() => {
    fetchSingleSong(songId).then((data) => {
      const s = data.data[0];
      setSong(s);

      const available = s.downloadUrl;
      const defaultUrl =
        available.find(q => q.quality === '96kbps')?.url ||
        available.find(q => q.quality === '160kbps')?.url ||
        available.find(q => q.quality === '48kbps')?.url ||
        available[0]?.url;

      setSelectedQuality(defaultUrl);
    }).catch(console.error);
  }, [songId]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !selectedQuality) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const setAudioDuration = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', setAudioDuration);

    audio.load();
    audio.play().then(() => setIsPlaying(true)).catch(console.warn);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', setAudioDuration);
    };
  }, [selectedQuality]);

  if (!song) return null;

  const image = song.image[song.image.length - 1].url;
  const title = song.name;
  const artists = song.artists.primary.map(a => a.name).join(', ');

  const handleSliderChange = (event, newValue) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = newValue;
    setCurrentTime(newValue);
  };

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
    setIsPlaying(!isPlaying);
  };

  const skip = (seconds) => {
    const audio = audioRef.current;
    if (!audio) return;
    let newTime = audio.currentTime + seconds;
    newTime = Math.min(Math.max(newTime, 0), duration);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleQualityChange = (event) => {
    const quality = event.target.value;
    const selected = song.downloadUrl.find(q => q.quality === quality);
    if (selected) {
      setSelectedQuality(selected.url);
      setIsPlaying(false);
    }
  };

  const selectedQualityLabel = song.downloadUrl.find(q => q.url === selectedQuality)?.quality;

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
        position: 'relative',
      }}
    >
      <audio ref={audioRef} src={selectedQuality} />

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
          <IconButton onClick={() => skip(-5)} sx={{ color: argbToHex(md3Colors.onPrimaryContainer) }}>
            <Replay5Rounded fontSize='large' />
          </IconButton>
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
          <IconButton onClick={() => skip(5)} sx={{ color: argbToHex(md3Colors.onPrimaryContainer) }}>
            <Forward5Rounded fontSize='large' />
          </IconButton>
        </Box>
      </Box>

      {/* Quality Dropdown - bottom right */}
      <Box sx={{
        position: 'absolute',
        bottom: '2rem',
        right: 20,
      }}>
        <Select
          size="small"
          value={selectedQualityLabel || ''}
          onChange={handleQualityChange}
          displayEmpty
          variant="outlined"
          sx={{
            backgroundColor: isDarkMode 
            ? lighten(argbToHex(md3Colors.tertiaryContainer), 0.2)
            : lighten(argbToHex(md3Colors.tertiaryContainer), 0.5),
            color: argbToHex(md3Colors.onTertiaryContainer),
            borderRadius: '1rem',
            fontSize: '0.8rem',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',

            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: argbToHex(md3Colors.primary),
              borderWidth: '2px',
            },
            
            '& .MuiSelect-icon': {
              color: argbToHex(md3Colors.onSecondaryContainer),
            },
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                backgroundColor: isDarkMode
                  ? darken(argbToHex(md3Colors.surface), 0.4)
                  : lighten(argbToHex(md3Colors.tertiaryContainer), 0.4),
                color: isDarkMode
                  ? argbToHex(md3Colors.onSurfaceVariant)
                  : argbToHex(md3Colors.onSurface),
                borderRadius: '1rem',
              },
            },
          }}
        >
          {song.downloadUrl.map((item) => (
            <MenuItem
              key={item.quality}
              value={item.quality}
              sx={{
                fontSize: '0.8rem',
                '&.Mui-selected': {
                  backgroundColor: `${argbToHex(md3Colors.secondary)} !important`,
                  color: argbToHex(md3Colors.onSecondary),
                },
                '&:hover': {
                  backgroundColor: argbToHex(md3Colors.secondaryContainer),
                },
              }}
            >
              {item.quality}
            </MenuItem>
          ))}
        </Select>
      </Box>
    </Box>
  );
}
