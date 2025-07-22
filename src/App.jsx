import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Player from './screens/Player'
import Error from './screens/Error'
import Header from './components/Header'
import { useMd3Theme } from './components/colors'
import { lighten, darken } from '@mui/material'
import Home from './screens/Home'

export default function App() {
  const { argbToHex, isDarkMode, md3Colors, toggleDarkMode } = useMd3Theme()
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
        overflow: 'auto',
        scrollbarWidth: 'none',
        backgroundColor: isDarkMode
          ? darken(argbToHex(md3Colors.primaryContainer), 0.2)
          : lighten(argbToHex(md3Colors.primaryContainer), 0.2),
        color: argbToHex(md3Colors.onPrimaryContainer),
        userSelect: 'none',
      }}
    >
      <Header argbToHex={argbToHex} isDarkMode={isDarkMode}
        md3Colors={md3Colors} toggleDarkMode={toggleDarkMode} />
      <Routes>

        <Route path="/melodify/" element={<Home argbToHex={argbToHex}
          isDarkMode={isDarkMode} md3Colors={md3Colors} />} />

        <Route path='/melodify/player/:id' element={<Player argbToHex={argbToHex}
          isDarkMode={isDarkMode} md3Colors={md3Colors} />} />

        <Route path="/melodify/*"
          element={
            <Error argbToHex={argbToHex} isDarkMode={isDarkMode} md3Colors={md3Colors} />
          // <div><h1>404 - Not Found</h1><p>The page you're looking for doesn't exist.</p></div>
        }
        />

      </Routes>
    </div>
  )
}
