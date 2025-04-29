import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
  base: '/oops11234.github.io/', // ← 這一定要加！
  plugins: [react(),tailwindcss(),],
  server: {
    host: '0.0.0.0'
  }
},
)
