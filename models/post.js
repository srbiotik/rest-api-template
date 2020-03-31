import { Schema, model } from 'mongoose'

const schema = new Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    postedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    image: { data: Buffer, contentType: String },
    createdAt: Date
  }
)

export default model('Post', schema)
