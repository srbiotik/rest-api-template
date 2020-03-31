import blake from 'blakejs'

import User from '../models/user'
import Post from '../models/post'
import Comment from '../models/comment'
// import Follow from '../models/follow'

const USERS = []
const POSTS = []
const usersData = [
  {
    username: 'raasol',
    password: 'kiloleba',
    email: 'uber.smeker@gmail.com'
  },
  {
    username: 'uri.ezra',
    password: 'uri.ezra',
    email: 'uri.ezra@vettio.intercom-mail.com'
  },
  {
    username: 'dror.cohen',
    password: 'dror.cohen',
    email: 'dror.cohen@vettio.intercom-mail.com'
  }
]

function encryptPassword(password) {
  return blake.blake2bHex(password, '', 12)
}

async function createComments() {
  for (const POST of POSTS) {
    for (const USER of USERS) {
      const comment = new Comment({
        body: `A comment has been made by ${USER.username}.`,
        postRefId: POST._id,
        commentedBy: USER._id,
        createdAt: new Date()
      })
      await comment.save()
    }
  }
}
async function createPosts() {
  for (const USER of USERS) {
    const post = new Post({
      title: `Title of ${USER.username}`,
      body: `The body of the post has been made by ${USER.username}.`,
      postedBy: USER._id,
      createdAt: new Date()
    })
    await post.save()
    POSTS.push(post)
  }
  await createComments()
}
async function seedDB() {
  for (const userData of usersData) {
    userData.password = encryptPassword(userData.password)
    const user = new User(userData)
    await user.save()
    USERS.push(user)
  }
  await createPosts()
}

module.exports = {
  seedDB
}
