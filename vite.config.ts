import { defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
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
