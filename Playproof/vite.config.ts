import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path' 

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      "/auth": {
        target: "https://myfit.my",
        changeOrigin: true,
        secure: true,
      },
      "/community": {
        target: "https://myfit.my",
        changeOrigin: true,
        secure: true,
      },
      "/users": {
        target: "https://myfit.my",
        changeOrigin: true,
        secure: true,
      },
      "/azits": {
        target: "https://myfit.my",
        changeOrigin: true,
        secure: true,
      },
      "/parties": {
        target: "https://myfit.my",
        changeOrigin: true,
        secure: true,
      },
    },
  },
  // resolve 설정 전체 추가
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      react: path.resolve(__dirname, './node_modules/react'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
      'react/jsx-runtime': path.resolve(__dirname, './node_modules/react/jsx-runtime.js'),
      'react/jsx-dev-runtime': path.resolve(__dirname, './node_modules/react/jsx-dev-runtime.js'),
    },
    dedupe: ['react', 'react-dom'],
  },
})
