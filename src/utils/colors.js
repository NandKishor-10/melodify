import { useState, useMemo } from 'react'
import { themeFromSourceColor } from '@material/material-color-utilities'

function hexToArgb(hex) {
  const cleanHex = hex.replace('#', '')
  return parseInt(`0xFF${cleanHex}`, 16)
}

function argbToHex(argb) {
  const r = (argb >> 16) & 0xFF
  const g = (argb >> 8) & 0xFF
  const b = argb & 0xFF
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('').toUpperCase()}`
}

function getMd3Colors(seed, isDark) {
  const theme = themeFromSourceColor(hexToArgb(seed))
  return isDark ? theme.schemes.dark : theme.schemes.light
}

const seedColorHex = '#80DEEA'

export function useMd3Theme() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  const md3Colors = useMemo(() => getMd3Colors(seedColorHex, isDarkMode), [isDarkMode])

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev)
  }

  return {
    argbToHex,
    isDarkMode,
    md3Colors,
    toggleDarkMode,
  }
}
