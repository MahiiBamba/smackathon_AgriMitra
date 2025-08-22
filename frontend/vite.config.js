import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react' // or your chosen framework plugin

export default defineConfig({
  plugins: [
    react(), // or your chosen framework plugin
    tailwindcss(),
  ],
})