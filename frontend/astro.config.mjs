// @ts-check
import { defineConfig, envField } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import react from '@astrojs/react'

import node from '@astrojs/node'

// https://astro.build/config
export default defineConfig({
  output: 'server',
  redirects: {
    '/': '/login',
  },

  integrations: [react()],

  vite: {
    plugins: [tailwindcss()],
  },

  env: {
    schema: {
      API_URL: envField.string({
        context: 'client',
        access: 'public',
        default: 'http://127.0.0.1:8000/api',
      }),
    },
  },

  adapter: node({
    mode: 'standalone',
  }),
})
