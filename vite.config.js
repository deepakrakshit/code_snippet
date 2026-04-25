import aiHandler from './api/ai'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import process from 'node:process'

function localAiApiPlugin() {
  return {
    name: 'local-ai-api',
    configureServer(server) {
      server.middlewares.use('/api/ai', async (req, res, next) => {
        const sendJson = (statusCode, payload) => {
          if (res.writableEnded) {
            return res
          }

          res.statusCode = statusCode
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(payload))
          return res
        }

        res.status = (statusCode) => ({
          json: (payload) => sendJson(statusCode, payload),
        })

        try {
          await aiHandler(req, res)
        } catch (error) {
          next(error)
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  if (env.GROQ_API_KEY && !process.env.GROQ_API_KEY) {
    process.env.GROQ_API_KEY = env.GROQ_API_KEY
  }

  return {
    plugins: [react(), tailwindcss(), localAiApiPlugin()],
  }
})
