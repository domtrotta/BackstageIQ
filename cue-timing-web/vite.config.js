// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/cuetimer/', // change this to your desired folder name
  plugins: [react()],
})
