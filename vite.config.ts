import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import AutoImport from 'unplugin-auto-import/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    AutoImport({
      imports: [
        'react',
        'react-router-dom',
        {
          axios: [['default', 'axios']],
          zustand: ['create'],
          'react-dom/client': ['createRoot'],
          'react-router-dom': ['BrowserRouter'],
        },
      ],
      dts: 'src/auto-imports.d.ts',
      include: [/\.[tj]sx?$/],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
