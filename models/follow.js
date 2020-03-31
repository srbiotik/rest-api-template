import { Schema, model } from 'mongoose'

const schema = new Schema(
  {
    postRefId: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    notify: [ String ]
  }
)

export default model('Follow', schema)
