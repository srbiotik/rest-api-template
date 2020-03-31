
import path from 'path'

import cors from 'cors'
import multer from 'multer'
import express from 'express'


import { replacer } from './utils'
import notify from './middleware/notify'
import authorize from './middleware/authorize'
import pagination from './middleware/pagination'


import user from './controllers/userResource'
import post from './controllers/postResource'
import comment from './controllers/commentResource'

export const app = new express()


/*
  setup CORS options
  whitelisted domains should be included in .env file
*/
const whitelistString = process.env.WHITELIST || ''
const whitelist = whitelistString.split(',') || ''
const corsOptions = {
  origin(origin, callback) {
    if (whitelist.includes(origin) || !origin) return callback(null, true)
    return callback(new Error('Not allowed by CORS'))
  }
}

/*
  setup Upload options
*/

const upload = multer({ dest: path.resolve(__dirname, 'uploads') })


// Enable CORS requsts
app.use(cors(corsOptions))
// Enable parsing of json bodies, where needed
app.use(express.json())
app.set('json replacer', replacer)

app.use(express.urlencoded())

/*
    authorize each req.path that fails regex with .env SKIP_AUTH
    verify JWT token
    retreive the coresponding user
    assign user to req
  */

app.use(authorize)

// AUTHENTICATION & REGISTRATION
/*
    verify JWT token signed with an env var SECRET_KEY
  */
app.post('/authenticate', user.authenticate)

/*
   create new user with password encrypted to blake2b
 */
app.post('/register', user.register)

// POST RESOURCES
/*
    add new post with date and user id
  */
app.post('/post', upload.single('image'), post.addOne)

/*
   follows (notifies by email) post for user making the request
  */
app.post('/post/follow', post.follow)


/*
    get all the posts sorted by date,
    optionally pass descending or ascending to query and paginated
  */
app.get('/posts/:page', pagination, post.getAll)

// COMMENT RESOURCES
/*
   get all the comments grouped by post
  */
app.post('/comment', upload.single('image'), comment.addOne, notify)

/*
    get all the comments grouped by post,
    optionally pass descending or ascending to query and paginated
  */
app.get('/comments/:page', pagination, comment.getAll)

/*
    serve documentation
  */
app.get('/docs', (_, res) => {
  res.redirect('https://documenter.getpostman.com/view/6750002/SzYW2zzp?version=latest')
})
