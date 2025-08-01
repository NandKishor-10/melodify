import { useEffect, useRef, useState } from 'react'
import { Box, darken, IconButton, lighten, TextField, useMediaQuery, useTheme } from '@mui/material'
import { DarkModeRounded, LightModeRounded } from '@mui/icons-material'
import Search from '../screens/Search'
import logoIcon from '../assets/logo_icon.png'
import useNavigation from '../utils/Navigation'

function Header({ argbToHex, isDarkMode, md3Colors, toggleDarkMode }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const inputRef = useRef(null)
  const [searchQuery, setSearchQuery] = useState('')
  const resetSearch = () => setSearchQuery('')
  const { gotoHome } = useNavigation()

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 's' && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <Box
      sx={{
        width: isMobile ? '100%' : '85%',
        backgroundColor: argbToHex(md3Colors.primaryContainer),
        alignSelf: 'center',
        justifyItems: 'center',
        borderBottomLeftRadius: '32px',
        borderBottomRightRadius: '32px',
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.20)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          width: '90%',
          alignSelf: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: '1rem',
        }}
      >
        <img
          src={logoIcon}
          alt='Logo'
          style={{
            height: '50px',
            borderRadius: '16px',
            cursor: 'pointer',          
          }}
          onClick={() => {
            resetSearch()
            gotoHome()
          }}
        />

        <Box sx={{
          position: 'relative',
          width: '62.5%'
        }}>
          <TextField
            inputRef={inputRef}
            id='searchField'
            label='Search for a song'
            variant='filled'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              width: '100%',
              fontSize: '1.5rem',
              '& .MuiFilledInput-root': {
                borderRadius: '16px',
                overflow: 'hidden',
                backgroundColor: isDarkMode
                  ? lighten(argbToHex(md3Colors.primaryContainer), 0.1)
                  : null,
                '&:hover': {
                  backgroundColor: isDarkMode
                    ? lighten(argbToHex(md3Colors.primaryContainer), 0.2)
                    : null,
                },
                '&.Mui-focused': {
                  backgroundColor: isDarkMode
                    ? lighten(argbToHex(md3Colors.primaryContainer), 0.1)
                    : null,
                },
              },
              '& .MuiFilledInput-input': {
                color: argbToHex(md3Colors.onPrimaryContainer),
                padding: '16px 10px 10px',
                paddingRight: '40px',
              },
              '& .MuiInputLabel-root': {
                color: darken(argbToHex(md3Colors.onPrimaryContainer), 0.3),
                fontSize: '1.1rem',
                '&.Mui-focused': {
                  color: darken(argbToHex(md3Colors.onPrimaryContainer), 0.2),
                  fontSize: '1rem',
                },
              },
            }}
          />
          {!isMobile &&
            <Box
              sx={{
                position: 'absolute',
                right: 12,
                top: '60%',
                transform: 'translateY(-75%)',
                color: argbToHex(md3Colors.onPrimaryContainer),
                fontSize: '0.8rem',
                padding: '4px 6px',
                borderRadius: '4px',
                border: `1px solid ${argbToHex(md3Colors.secondary)}`,
              }}
            >
              S
            </Box>
          }
        </Box>

        <IconButton
          onClick={() => toggleDarkMode()}
          sx={{
            backgroundColor: argbToHex(md3Colors.secondaryContainer),
            color: argbToHex(md3Colors.onSecondaryContainer),
            padding: 0,
            height: '50px',
            width: '50px',
            overflow: 'hidden',
            borderRadius: '1rem',
          }}
        >
          {isDarkMode ? <LightModeRounded /> : <DarkModeRounded />}
        </IconButton>
      </Box>

      {searchQuery &&
        <Search
          query={searchQuery}
          resetSearch={resetSearch}
          argbToHex={argbToHex}
          isDarkMode={isDarkMode}
          md3Colors={md3Colors}
        />
      }
    </Box>
  )
}

export default Header