import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import dynamicImport from 'vite-plugin-dynamic-import'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react({
    babel: {
      plugins: [
        'babel-plugin-macros'
      ]
    }
  }),
  dynamicImport()],
  assetsInclude: ['**/*.md'],
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src'),
    },
  },
  build: {
    outDir: 'build'
  },
  server:{
    proxy:{
      // change your backend endpoint here
      '/api/v1': {
                // config the target url based on your backend server
                target: 'http://localhost:8080/api/', //this is from nginx don't edit
                // target: 'http://localhost:3000', //TODO remove this when you want to go to production.
                changeOrigin: true,
                secure: false,
            }
    }
  }
});
