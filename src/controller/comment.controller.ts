import { Request, Response } from 'express'
import mongoose from 'mongoose'
import {
  CreateCommentInput,
  GetCommentsByPostSlugInput,
  UpdateCommentInput,
  DeleteCommentInput
} from '../schema/comment.schema'
import {
  createComment,
  findComment,
  findCommentsByPostSlug,
  findAndUpdateComment,
  deleteComment
} from '../service/comment.service'

export async function createCommentHandler(
  req: Request<object, object, CreateCommentInput['body']>,
  res: Response
) {
  const userId = res.locals.user._id // Asumiendo que tienes autenticación y el ID del usuario está en res.locals

  const { content, postSlug, parentComment } = req.body

  const parentCommentId = parentComment
    ? new mongoose.Types.ObjectId(parentComment)
    : undefined

  const comment = await createComment({
    content,
    postSlug,
    user: userId,
    parentComment: parentCommentId
  })

  return res.send(comment)
}

export async function getCommentsByPostSlugHandler(
  req: Request<GetCommentsByPostSlugInput['params']>,
  res: Response
) {
  const { postSlug } = req.params
  const comments = await findCommentsByPostSlug(postSlug)

  if (!comments) {
    return res.sendStatus(404)
  }

  return res.send(comments)
}

export async function updateCommentHandler(
  req: Request<UpdateCommentInput['params']>,
  res: Response
) {
  const userId = res.locals.user._id
  const commentId = req.params.commentId
  const update = req.body

  const comment = await findComment({ _id: commentId })

  if (!comment) {
    return res.sendStatus(404)
  }

  if (String(comment.user) !== userId) {
    return res.sendStatus(403)
  }

  const updatedComment = await findAndUpdateComment(
    { _id: commentId },
    update,
    { new: true }
  )

  return res.send(updatedComment)
}

export async function deleteCommentHandler(
  req: Request<DeleteCommentInput['params']>,
  res: Response
) {
  const userId = res.locals.user._id
  const commentId = req.params.commentId

  const comment = await findComment({ _id: commentId })

  if (!comment) {
    return res.sendStatus(404)
  }

  if (String(comment.user) !== userId) {
    return res.sendStatus(403)
  }

  await deleteComment({ _id: commentId })

  return res.sendStatus(200)
}
