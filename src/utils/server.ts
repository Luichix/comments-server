import express from 'express'
import routes from '../routes'
import deserializeUser from '../middleware/deserializeUser'

function createServer() {
  const app = express()

  app.use(express.static('build'))
  app.use(express.json({ limit: '50mb' }))
  app.use(express.urlencoded({ limit: '50mb', extended: true }))

  app.use(deserializeUser)

  routes(app)

  return app
}

export default createServer
