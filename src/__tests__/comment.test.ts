import supertest from 'supertest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import createServer from '../utils/server'
import mongoose from 'mongoose'
import { signJwt } from '../utils/jwt.utils'

const app = createServer()

const userId = new mongoose.Types.ObjectId().toString()

const commentPayload = {
  user: userId,
  content: 'This is a test comment',
  postSlug: 'test-post'
  // Si tu esquema de comentarios incluye un parentComment, puedes añadirlo aquí
}

const userPayload = {
  _id: userId,
  email: 'john.doe@example.com',
  name: 'John Doe'
}

describe('comment', () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create()
    await mongoose.connect(mongoServer.getUri())
  })

  afterAll(async () => {
    await mongoose.disconnect()
    await mongoose.connection.close()
  })

  // Añade aquí tus pruebas para las rutas de comentarios
  describe('get comments route', () => {
    describe('given the post has no comments', () => {
      it('should return a 200 and an empty array', async () => {
        const postSlug = 'non-existing-post'

        const { body, statusCode } = await supertest(app).get(
          `/api/comments/${postSlug}`
        )

        expect(statusCode).toBe(200)
        expect(body).toEqual([])
      })
    })

    // Agrega más pruebas según sea necesario
  })

  describe('create comment route', () => {
    describe('given the user is not logged in', () => {
      it('should return a 403', async () => {
        const { statusCode } = await supertest(app)
          .post('/api/comments')
          .send(commentPayload)

        expect(statusCode).toBe(403)
      })
    })

    describe('given the user is logged in', () => {
      it('should return a 200 and create the comment', async () => {
        const jwt = signJwt(userPayload, 'accessTokenPrivateKey')

        const { statusCode, body } = await supertest(app)
          .post('/api/comments')
          .set('Authorization', `Bearer ${jwt}`)
          .send(commentPayload)

        expect(statusCode).toBe(200)
        // Agrega aquí más expectativas según la estructura de tu comentario

        expect(body).toEqual({
          __v: 0,
          _id: expect.any(String),
          content: 'This is a test comment',
          createdAt: expect.any(String),
          parentComment: null,
          postSlug: 'test-post',
          updatedAt: expect.any(String),
          user: expect.any(String)
        })
      })
    })
  })
})
