import fs from 'fs'

import Comment from '../models/comment'
import { sortHelper } from '../utils'


async function getPosts(req) {
  // Prepared in middleware
  let comments
  const { sort } = req.query
  if (req.docsToSkip) {
    comments = await Comment.aggregate(
      [
        { $sort: { createdAt: sortHelper(sort) === 'ascending' ? 1 : -1 } },
        { $group: { _id: '$postRefId', comments: { $push: '$$ROOT' } } },
        { $sort: { _id: sortHelper(sort) === 'ascending' ? 1 : -1 } },
        { $skip: req.docsToSkip },
        { $limit: req.docsPerPage }
      ]
    )
  }
  comments = await Comment.aggregate(
    [
      { $sort: { createdAt: sortHelper(sort) === 'ascending' ? 1 : -1 } },
      { $group: { _id: '$postRefId', comments: { $push: '$$ROOT' } } },
      { $sort: { _id: sortHelper(sort) === 'ascending' ? 1 : -1 } }
    ]
  )
  return comments
}

async function getAll(req, res) {
  try {
    const comments = await getPosts(req)
    return res.status(200).json(comments)
  } catch (err) {
    const errorText = process.env.DEV ? err.stack : err.name
    return res.status(500).send(errorText)
  }
}

async function addOne(req, res, next) {
  try {
    // title and body of the post
    const data = req.body
    data.commentedBy = req.user.id
    data.createdAt = new Date()
    // create && save the document
    const comment = new Comment(data)
    if (req.file) {
      comment.image.data = fs.readFileSync(req.file.path)
      comment.image.contentType = req.file.mimetype
    }

    await comment.save()
    // To allow notification
    req.comment = comment
    return next()
  } catch (err) {
    // describe missing fields to client
    if (err.name === 'ValidationError') return res.status(400).send(err.message)
    // If an unhandled error happens I still want info depending on env
    const unhandledErrorText = process.env.DEV ? err.stack : err.name
    return res.status(500).send(unhandledErrorText)
  }
}

export default {
  getAll,
  addOne
}
