import { Box, IconButton, lighten, Typography, useMediaQuery, useTheme } from '@mui/material'
import useNavigation from './Navigation'
import { formatTime } from './utils'


function SongView({ song, resetSearch, argbToHex, isDarkMode, md3Colors }) {
  const { gotoPlayer } = useNavigation()
  const artists = song.artists
  const title = song.title
  const image = song.image

  return (
    <Box
      onClick={() => gotoPlayer(song, resetSearch)}
      padding={'0.5rem'}
      display={'flex'}
      justifyContent={'space-between'}
      alignItems={'center'}
      boxShadow={'2px 5px 5px rgba(0, 0, 0, 0.20)'}
      backgroundColor={isDarkMode
        ? argbToHex(md3Colors.primaryContainer)
        : lighten(argbToHex(md3Colors.primaryContainer), 0.5)}
      color={argbToHex(md3Colors.onPrimaryContainer)}
      gap={'1rem'}
      borderRadius={'1rem'}
      sx={{
        '@media (hover: hover)': {
          '&:hover': {
            backgroundColor: isDarkMode
              ? lighten(argbToHex(md3Colors.primaryContainer), 0.1)
              : lighten(argbToHex(md3Colors.primaryContainer), 0.6),
            transform: 'scale(1.05)',
          }
        },
      }}
    >
      <img
        src={image}
        height={60}
        alt='Image'
        style={{
          borderRadius: '0.75rem',
        }}
      />
      <Box display='flex' flexDirection='column' justifyContent='space-around'>
        <Typography
          variant='h6'
          fontWeight='bold'
          color={argbToHex(md3Colors.primary)}
          sx={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '180px',
          }}
        >
          {title}
        </Typography>

        <Box display='flex' justifyContent='center' alignItems='center' maxWidth='180px'>
          <Typography
            variant='body2'
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
            {artists}
          </Typography>
          <Typography
            variant='body2'
            color={argbToHex(md3Colors.secondary)}
            sx={{ fontSize: '0.85rem', marginLeft: '0.5rem', whiteSpace: 'nowrap' }}
          >
            • {formatTime(song.duration)}
          </Typography>
        </Box>
      </Box>
    </Box >
  )
}

export default SongView