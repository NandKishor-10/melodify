import React, { useEffect, useRef, useState } from 'react';
import {
  Box, IconButton, Slider, Typography, MenuItem,
  darken, lighten, useMediaQuery, useTheme, Select
} from '@mui/material';
import { Forward5Rounded, PauseRounded, PlayArrowRounded, Replay5Rounded, RestartAltRounded } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { fetchSingleSong } from '../http/api';
import formatTime from '../utils/formatTime';
import formateString from '../utils/formatString';

export default function Player({ argbToHex, isDarkMode, md3Colors }) {
  const isMobile = useMediaQuery(useTheme().breakpoints.down('sm'));
  const songId = useParams().id;
  const [song, setSong] = useState(null);
  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState('');
  const [hasEnded, setHasEnded] = useState(false);


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
    });
  }, [songId]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !selectedQuality) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const onPlay = () => {
      setHasEnded(false);
      setIsPlaying(true);
    };
    const onPause = () => setIsPlaying(false);
    const onEnded = () => {
      setIsPlaying(false);
      setHasEnded(true);
    };

    audio.src = selectedQuality;
    audio.load();
    audio.play().catch(() => setIsPlaying(false));

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
    };
  }, [selectedQuality]);


  if (!song) return null;

  const image = song.image[song.image.length - 1].url;
  const title = formateString(song.name);
  const artists = song.artists.primary.map(a => a.name).join(', ');
  const duration = song.duration;

  const handleSliderChange = (event, newValue) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = newValue;
    setCurrentTime(newValue);
  };

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (hasEnded) {
      audio.currentTime = 0;
      audio.play();
      setHasEnded(false);
      return;
    }

    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }

    setIsPlaying(!audio.paused);
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
        display: 'flex', flexDirection: 'column', height: isMobile ?'65%' : '100%', 
        py: 4, my: 3, width: isMobile? '95%' : '62.5%',
        alignItems: 'center', justifyContent: 'center', alignSelf: 'center',
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
          display: 'flex', width: '62.5%', flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'center', justifyContent: 'center', gap: '10%',
        }}
      >
        <img
          src={image}
          alt='Album Cover'
          style={{
            width: isMobile ? '62.5%' : '35%',
            // height: isMobile ? '45vw' : '35vh',
            objectFit: 'fill', borderRadius: '2rem',
            boxShadow: '0 8px 30px rgba(0,0,0,0.3)', marginBottom: '2rem',
          }}
        />
        <Box textAlign={isMobile ? 'center' : 'start'}>
          <Typography variant='h4' fontWeight='bold' color={argbToHex(md3Colors.primary)} gutterBottom >
            {title}
          </Typography>
          <Typography variant='h6' color={argbToHex(md3Colors.secondary)}>
            {artists}
          </Typography>
        </Box>
      </span>

      {/* Slider and controls */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2, width: isMobile ? '80%' : '50%' }}>
        <Typography variant='caption' sx={{ alignSelf: 'flex-start' }}>{formatTime(currentTime)}</Typography>
        <Slider
          value={currentTime}
          min={0}
          max={duration}
          step={0.1}
          onChange={handleSliderChange}
          sx={{
            color: argbToHex(md3Colors.primary),
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
          <IconButton onClick={() => skip(-5)} sx={{ color: argbToHex(md3Colors.secondary) }}>
            <Replay5Rounded fontSize='large' />
          </IconButton>
          <IconButton onClick={togglePlayPause}
            sx={{
              color: argbToHex(md3Colors.primary),
              width: 64,
              borderRadius: isPlaying ? '1rem' : '50%',
              height: 64,
              padding: '1rem',
              backgroundColor: argbToHex(md3Colors.inversePrimary),
            }}>
            {hasEnded ? (
              <RestartAltRounded fontSize='large' sx={{
                rotate: '-45deg',
              }} />
            ) : isPlaying ? (
              <PauseRounded fontSize='large' />
            ) : (
              <PlayArrowRounded fontSize='large' />
            )}

          </IconButton>
          <IconButton onClick={() => skip(5)} sx={{ color: argbToHex(md3Colors.secondary) }}>
            <Forward5Rounded fontSize='large' />
          </IconButton>
        </Box>
      </Box>

      {/* Quality Dropdown - bottom right */}
      <Box sx={{
        position: 'absolute',
        top: '1rem',
        right: '1rem',
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
