import { Schema, model } from 'mongoose'

const schema = new Schema(
  {
    body: { type: String, required: true },
    postRefId: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    commentedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    image: { data: Buffer, contentType: String },
    createdAt: Date,
  }
)

export default model('Comment', schema)
