import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/search': {
        target: 'https://saavn-api.vercel.app',
        changeOrigin: true,
      },
      '/song': {
        target: 'https://saavn-api.vercel.app',
        changeOrigin: true,
      },
    },
  }
})
