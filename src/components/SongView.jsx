import { Box, IconButton, lighten, Typography, useMediaQuery, useTheme } from '@mui/material'
import useNavigation from '../utils/Navigation'
import formatTime from '../utils/formatTime'
import formateString from '../utils/formatString'

function SongView({ song, resetSearch, argbToHex, isDarkMode, md3Colors }) {
  const { gotoPlayer } = useNavigation()
  const image = song.image[0].url
  const title = formateString(song.name)
  const artistNames = song.artists.primary.map(a => a.name).join(', ');

  return (
    <Box
      onClick={() => gotoPlayer(song, resetSearch)}
      sx={{
        p: '0.5rem',
        display: 'flex',
        alignItems: 'center',
        boxShadow: '2px 5px 5px rgba(0, 0, 0, 0.20)',
        color: argbToHex(md3Colors.onPrimaryContainer),
        backgroundColor: isDarkMode
          ? argbToHex(md3Colors.primaryContainer)
          : lighten(argbToHex(md3Colors.primaryContainer), 0.5),
        gap: '1rem',
        borderRadius: '1rem',
        transition: 'transform 0.2s ease-in-out',

        '@media (hover: hover)': {
          '&:hover': {
            backgroundColor: isDarkMode
              ? lighten(argbToHex(md3Colors.primaryContainer), 0.1)
              : lighten(argbToHex(md3Colors.primaryContainer), 0.6),
            transform: 'scale(1.05)',
          },
        },
      }}
    >
      <img
        src={image}
        alt='Image'
        style={{
          height: '4rem',
          borderRadius: '0.75rem',
        }}
      />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-around',
          maxWidth: '240px',
        }}>
        <Typography
          variant='h6'
          fontWeight='bold'
          color={argbToHex(md3Colors.primary)}
          sx={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {title}
        </Typography>

        <Box
          display="flex"
          alignItems="center"
          sx={{
            overflow: 'hidden',
            gap: '0.5rem',
          }}
        >
          <Typography
            variant="body2"
            color={argbToHex(md3Colors.secondary)}
            sx={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              flex: 1,
              fontSize: '0.85rem',
              fontWeight: 500,
            }}
          >
            {artistNames}
          </Typography>

          <Typography
            variant="body2"
            color={argbToHex(md3Colors.secondary)}
            sx={{
              whiteSpace: 'nowrap',
              fontSize: '0.85rem',
              flexShrink: 0,
            }}
          >
            • {formatTime(song.duration)}
          </Typography>
        </Box>
      </Box>
    </Box >
  )
}

export default SongView