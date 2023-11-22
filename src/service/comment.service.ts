import { FilterQuery, QueryOptions, UpdateQuery } from 'mongoose'
import CommentModel, {
  CommentDocument,
  CommentInput
} from '../models/comment.model'
import { databaseResponseTimeHistogram } from '../utils/metrics'

export async function createComment(input: CommentInput) {
  const metricsLabels = {
    operation: 'createComment'
  }

  const timer = databaseResponseTimeHistogram.startTimer()
  try {
    const result = await CommentModel.create(input)
    timer({ ...metricsLabels, success: 'true' })
    return result
  } catch (e) {
    timer({ ...metricsLabels, success: 'false' })
    throw e
  }
}

export async function findComment(
  query: FilterQuery<CommentDocument>,
  options: QueryOptions = { lean: true }
) {
  const metricsLabels = {
    operation: 'findComment'
  }

  const timer = databaseResponseTimeHistogram.startTimer()
  try {
    const result = await CommentModel.findOne(query, {}, options)
    timer({ ...metricsLabels, success: 'true' })
    return result
  } catch (e) {
    timer({ ...metricsLabels, success: 'false' })
    throw e
  }
}

export async function findAndUpdateComment(
  query: FilterQuery<CommentDocument>,
  update: UpdateQuery<CommentDocument>,
  options: QueryOptions
) {
  return CommentModel.findOneAndUpdate(query, update, options)
}

export async function deleteComment(query: FilterQuery<CommentDocument>) {
  return CommentModel.deleteOne(query)
}

export async function findCommentsByPostSlug(postSlug: string) {
  const metricsLabels = {
    operation: 'findCommentsByPostSlug'
  }

  const timer = databaseResponseTimeHistogram.startTimer()
  try {
    const query: FilterQuery<CommentDocument> = {
      postSlug,
      isDeleted: { $ne: true }
    }
    const comments = await CommentModel.find(query).sort({ createdAt: -1 }) // Ordenar por fecha de creación descendente
    timer({ ...metricsLabels, success: 'true' })
    return comments
  } catch (e) {
    timer({ ...metricsLabels, success: 'false' })
    throw e
  }
}
