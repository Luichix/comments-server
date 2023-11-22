import { object, string, TypeOf } from 'zod'

/**
 * @openapi
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       required:
 *         - content
 *         - user
 *         - postSlug
 *       properties:
 *         content:
 *           type: string
 *         user:
 *           type: string
 *           format: uuid
 *         postSlug:
 *           type: string
 *         parentComment:
 *           type: string
 *           format: uuid
 *           nullable: true
 *
 */

const commentPayload = {
  body: object({
    content: string({
      required_error: 'Content is required'
    }).min(1, 'Content should not be empty'),
    user: string({
      required_error: 'User ID is required'
    }),
    postSlug: string({
      required_error: 'Post Slug is required'
    }),
    parentComment: string().optional()
  })
}

const params = {
  params: object({
    commentId: string({
      required_error: 'Comment ID is required'
    })
  })
}

const postSlug = {
  params: object({
    postSlug: string({
      required_error: 'Post Slug is required'
    })
  })
}

export const createCommentSchema = object({
  ...commentPayload
})

export const updateCommentSchema = object({
  ...commentPayload,
  ...params
})
export const deleteCommentSchema = object({
  ...params
})

export const getCommentsByPostSlugSchema = object({
  ...postSlug
})

export type CreateCommentInput = TypeOf<typeof createCommentSchema>
export type UpdateCommentInput = TypeOf<typeof updateCommentSchema>
export type DeleteCommentInput = TypeOf<typeof deleteCommentSchema>
export type GetCommentsByPostSlugInput = TypeOf<
  typeof getCommentsByPostSlugSchema
>
