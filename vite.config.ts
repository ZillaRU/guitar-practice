import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages 部署时，仓库名作为 base 路径
// 如果是 https://username.github.io/guitar-practice，base 就是 '/guitar-practice/'
// 如果是自定义域名，base 就是 '/'
const base = process.env.GITHUB_PAGES ? '/guitar-practice/' : '/'

export default defineConfig({
  plugins: [react()],
  base,
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})
