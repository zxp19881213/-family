import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 部署到 Cloudflare Pages：
// Build command: npm run build
// Build output directory: dist
export default defineConfig({
  plugins: [react()],
})
