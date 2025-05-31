import React, { useEffect, useRef, useState } from 'react'
import Grid from '@mui/material/Grid'
import { Box } from '@mui/material'
import SongView from '../components/SongView'
import { fetchSongs } from '../components/apiService'

export default function Search({ query, resetSearch, argbToHex, isDarkMode, md3Colors, }) {
  const [songs, setSongs] = useState([])

  useEffect(() => {
    if (!query) {
      setSongs([])
      return
    }
    fetchSongs(query)
      .then(setSongs)
      .catch(console.error)
  }, [query])

  return (
    // <h1>Action kamen</h1>
    <Box
      sx={{
        overflow: 'auto',
        width: '100%',
        minHeight: '55vh',
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
      }}
    >
      {[0, 1, 2].map((row) => (
        <Grid
          container
          spacing={'0.8rem'}
          key={row}
          sx={{
            justifyContent: 'center',
            display: 'flex',
            flexWrap: 'nowrap',
            margin: 'auto',
            mb: '0.8rem',
            px: 3,
            width: 'max-content'
          }}
        >
          {songs.slice(row * 3, row * 3 + 3).map((song) => (
            <Grid
              key={song.id}
              sx={{
                minWidth: 200,
                flexShrink: 0
              }}
            >
              <SongView
                song={song}
                resetSearch={resetSearch}
                argbToHex={argbToHex}
                isDarkMode={isDarkMode}
                md3Colors={md3Colors}
              />
            </Grid>
          ))}
        </Grid>
      ))}
    </Box>
  )
}