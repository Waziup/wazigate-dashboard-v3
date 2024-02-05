import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  server:{
    // host:true,
    open:true,
    https:false,
    origin:'*',
    port:8080,
    host:'localhost',
  },
})
