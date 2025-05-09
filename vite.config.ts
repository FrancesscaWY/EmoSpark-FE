import { defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src') // 👈 配置 @ 指向 src 目录
    }
  },
  server:{
    port: 3004,
    proxy:{
      '/api':{
        target: 'http://localhost:3004',
        changeOrigin: true,
        rewrite: (path)=> path.replace(/^\/api/,'')
      }
    },
    host:true
  }
})
