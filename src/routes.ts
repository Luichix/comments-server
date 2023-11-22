import { Express, Request, Response } from 'express'

import {
  createUserSessionHandler,
  getUserSessionsHandler,
  deleteSessionHandler
} from './controller/session.controller'
import { createUserHandler } from './controller/user.controller'
import requireUser from './middleware/requireUser'
import validateResource from './middleware/validateResource'

import { createSessionSchema } from './schema/session.schema'
import { createUserSchema } from './schema/user.schema'

import {
  createCommentHandler,
  getCommentsByPostSlugHandler,
  updateCommentHandler,
  deleteCommentHandler
} from './controller/comment.controller'

import {
  createCommentSchema,
  getCommentsByPostSlugSchema,
  updateCommentSchema,
  deleteCommentSchema
} from './schema/comment.schema'

function routes(app: Express) {
  /**
   * @openapi
   * /healthcheck:
   *  get:
   *     tags:
   *     - Healthcheck
   *     description: Responds if the app is up and running
   *     responses:
   *       200:
   *         description: App is up and running
   */
  app.get('/healthcheck', (_: Request, res: Response) => res.sendStatus(200))

  /**
   * @openapi
   * '/api/users':
   *  post:
   *     tags:
   *     - User
   *     summary: Register a user
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *           schema:
   *              $ref: '#/components/schemas/CreateUserInput'
   *     responses:
   *      200:
   *        description: Success
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/CreateUserResponse'
   *      409:
   *        description: Conflict
   *      400:
   *        description: Bad request
   */
  app.post('/api/users', validateResource(createUserSchema), createUserHandler)

  /**
   * @openapi
   * '/api/sessions':
   *  get:
   *    tags:
   *    - Session
   *    summary: Get all sessions
   *    responses:
   *      200:
   *        description: Get all sessions for current user
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/GetSessionResponse'
   *      403:
   *        description: Forbidden
   *  post:
   *    tags:
   *    - Session
   *    summary: Create a session
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            $ref: '#/components/schemas/CreateSessionInput'
   *    responses:
   *      200:
   *        description: Session created
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/CreateSessionResponse'
   *      401:
   *        description: Unauthorized
   *  delete:
   *    tags:
   *    - Session
   *    summary: Delete a session
   *    responses:
   *      200:
   *        description: Session deleted
   *      403:
   *        description: Forbidden
   */
  app.post(
    '/api/sessions',
    validateResource(createSessionSchema),
    createUserSessionHandler
  )

  app.get('/api/sessions', requireUser, getUserSessionsHandler)

  app.delete('/api/sessions', requireUser, deleteSessionHandler)

  /**
   * @openapi
   * '/api/comments':
   *  post:
   *    tags:
   *    - Comments
   *    summary: Create a new comment
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            $ref: '#/components/schemas/CreateCommentInput'
   *    responses:
   *      201:
   *        description: Comment created successfully
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/Comment'
   *      400:
   *        description: Bad request
   *      401:
   *        description: Unauthorized
   *
   */
  app.post(
    '/api/comments',
    [requireUser, validateResource(createCommentSchema)],
    createCommentHandler
  )

  /**
   * @openapi
   * '/api/comments/{postSlug}':
   *  get:
   *    tags:
   *    - Comments
   *    summary: Get all comments for a specific post
   *    parameters:
   *      - name: postSlug
   *        in: path
   *        required: true
   *        schema:
   *          type: string
   *    responses:
   *      200:
   *        description: List of comments retrieved successfully
   *        content:
   *          application/json:
   *            schema:
   *              type: array
   *              items:
   *                $ref: '#/components/schemas/Comment'
   *      404:
   *        description: Post not found
   *
   */
  app.get(
    '/api/comments/:postSlug',
    validateResource(getCommentsByPostSlugSchema),
    getCommentsByPostSlugHandler
  )

  /**
   * @openapi
   * '/api/comments/{commentId}':
   *  put:
   *   tags:
   *   - Comments
   *   summary: Update a comment
   *   parameters:
   *     - in: path
   *       name: commentId
   *       required: true
   *       schema:
   *         type: string
   *   requestBody:
   *     required: true
   *     content:
   *       application/json:
   *         schema:
   *           $ref: '#/components/schemas/UpdateCommentInput'
   *   responses:
   *     200:
   *       description: Comment updated successfully
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Comment'
   *     400:
   *       description: Bad request
   *     401:
   *       description: Unauthorized
   *     404:
   *       description: Comment not found
   *
   */
  app.put(
    '/api/comments/:commentId',
    [requireUser, validateResource(updateCommentSchema)],
    updateCommentHandler
  )

  /**
   * @openapi
   * '/api/comments/{commentId}':
   *  delete:
   *    tags:
   *    - Comments
   *    summary: Delete a comment
   *    parameters:
   *      - in: path
   *        name: commentId
   *        required: true
   *        schema:
   *          type: string
   *    responses:
   *      200:
   *        description: Comment deleted successfully
   *      401:
   *        description: Unauthorized
   *      404:
   *        description: Comment not found
   *
   */

  app.delete(
    '/api/comments/:commentId',
    [requireUser, validateResource(deleteCommentSchema)],
    deleteCommentHandler
  )
}

export default routes
