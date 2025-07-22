import { Typography } from '@mui/material'
import React from 'react'

export default function Home({ argbToHex, isDarkMode, md3Colors }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: argbToHex(md3Colors.primary),
      }}
    >
      <Typography variant="h3" sx={{ fontWeight: '550' }} >Melodify</Typography>

      <ul style={{ fontSize: '2rem', fontWeight: '600' }} >
        <li>Search</li>
        <li>Play</li>
        <li>Vibe</li>
      </ul>

      <Typography
        variant="subtitle1"
        sx={{
          position: 'absolute',
          bottom: '1rem',
        }}
      >
        Start searching and keep vibing
      </Typography>

    </div>
  )
}