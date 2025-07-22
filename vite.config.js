import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/melodify/',
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
  },
})
