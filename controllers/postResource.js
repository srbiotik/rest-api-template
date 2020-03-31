import fs from 'fs'

import Post from '../models/post'
import Follow from '../models/follow'
import { sortHelper } from '../utils'

async function getAll(req, res) {
  const { sort } = req.query
  try {
    const posts = await Post.find()
      .sort([ [ 'createdAt', sortHelper(sort) ] ])
      .skip(req.docsToSkip)
      .limit(req.docsPerPage)
    return res.status(200).json(posts)
  } catch (err) {
    const unhandledErrorText = process.env.DEV ? err.stack : err.name
    return res.status(500).send(unhandledErrorText)
  }
}

async function addOne(req, res) {
  // TODO: Poster automatically follows the post
  /*
  assign the id of the user making the request
  populated in the authorization step
  assign very nearly the point in time of creation
  */
  try {
    const data = req.body
    data.postedBy = req.user.id
    data.createdAt = new Date()
    // title and body of the post
    // create && save the document
    const post = new Post(data)
    if (req.file) {
      post.image.data = fs.readFileSync(req.file.path)
      post.image.contentType = req.file.mimetype
    }

    await post.save()
    const { _id, createdAt } = post
    const message = `User ${req.user.username} successfully creted a post`
    return res.status(201).json({ _id, createdAt, message })
  } catch (err) {
    // describe missing fields to client
    if (err.name === 'ValidationError') res.status(400).send(err.message)
    // If an unhandled error happens I still want info depending on env
    const unhandledErrorText = process.env.DEV ? err.stack : err.name
    return res.status(500).send(unhandledErrorText)
  }
}

async function follow(req, res) {
  const { postRefId } = req.body
  if (!postRefId) return res.status(400).send('Bad Request')
  try {
    await Follow.findOneAndUpdate(
      { postRefId },
      {
        $set: { postRefId },
        $push: { notify: req.user.email }
      },
      { new: true, upsert: true }
    )
    return res.status(201).send(`${req.user.username} following ${postRefId}`)
  } catch (err) {
    return res.status(400).send('Bad request')
  }
}

export default {
  getAll,
  addOne,
  follow
}
