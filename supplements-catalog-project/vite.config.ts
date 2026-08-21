import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Se despliega en Vercel (como tus otros proyectos), que sirve el sitio en
// la raíz de su propio dominio, así que no hace falta un "base" especial.
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
