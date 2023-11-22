import mongoose, { Schema, Document } from 'mongoose'

import { UserDocument } from './user.model'

export interface CommentInput {
  content: string
  user: mongoose.Types.ObjectId | UserDocument
  postSlug: string
  parentComment?: mongoose.Types.ObjectId | CommentDocument
}

export interface CommentDocument extends CommentInput, Document {
  createdAt: Date
  updatedAt: Date
}

const commentSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    postSlug: { type: String, required: true },
    parentComment: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
      default: null
    }
  },
  {
    timestamps: true
  }
)

const CommentModel = mongoose.model<CommentDocument>('Comment', commentSchema)

export default CommentModel
