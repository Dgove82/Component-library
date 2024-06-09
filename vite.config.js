import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  // 定义运行端口
  server:{
    port: 8080,
  },
  // 定义环境变量
  define:{
    'process.env.self_env': JSON.stringify('ready')
  }
})
