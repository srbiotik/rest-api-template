const request = require('supertest')

const { app } = require('../app')
import { setupDB } from './test-setup'
import Post from '../models/post'

async function getToken() {
  let res = await request(app)
    .post('/authenticate')
    .send({
      username: 'raasol',
      password: 'kiloleba'
    })
  return res.text
}

describe('Test Comic Clan RESTful API endpoits', () => {
  setupDB('comic_clan_test')
  // User register and authenticate
  it('POST /register should create a new user', async(done) => {
    const res = await request(app)
      .post('/register')
      .send({
        username: 'srbiotik',
        password: 'kiloleba',
        email: 'srbiotik@gmail.com'
      })
    expect(res.statusCode).toEqual(201)
    done()
  })
  it('POST /authenticate return Bearer Token JWT', async(done) => {
    const res = await request(app)
      .post('/authenticate')
      .send({
        username: 'raasol',
        password: 'kiloleba'
      })
    expect(res.statusCode).toEqual(200)
    done()
  })
  // Create Post
  it('POST /post creates post document', async(done) => {
    const token = await getToken()
    const res = await request(app)
      .post('/post')
      .set('Authorization', token)
      .send({
        title: 'A post made by raasol',
        body: 'This is the body of the post made by raasol'
      })
    expect(res.statusCode).toEqual(201)
    expect(res.body).toHaveProperty('_id')
    expect(res.body).toHaveProperty('createdAt')
    expect(res.body).toHaveProperty('message')
    done()
  })
  // Create Comment
  it('POST /comment creates comment document', async(done) => {
    const token = await getToken()
    const post = await Post.findOne()
    const res = await request(app)
      .post('/comment')
      .set('Authorization', token)
      .send({
        body: 'This is the body of the post made by raasol',
        postRefId: post._id
      })
    expect(res.statusCode).toEqual(201)
    expect(res.body).toHaveProperty('_id')
    expect(res.body).toHaveProperty('createdAt')
    expect(res.body).toHaveProperty('message')
    done()
  })
  // Create Follower
  it('POST /follow creates/updates follow document', async(done) => {
    const token = await getToken()
    const post = await Post.findOne()
    const res = await request(app)
      .post('/post/follow')
      .set('Authorization', token)
      .send({
        postRefId: post._id
      })
    expect(res.statusCode).toEqual(201)
    done()
  })
  // Get comments
  it('GET /comments/:page gets all the comments', async(done) => {
    const token = await getToken()
    const res = await request(app)
      .get('/comments/0')
      .set('Authorization', token)
      .query({
        sort: 'descending',
        docsPerPage: '1'
      })
    expect(res.statusCode).toEqual(200)
    done()
  })
  // Get posts
  it('GET /posts/:page gets all the posts', async(done) => {
    const token = await getToken()
    const res = await request(app)
      .get('/posts/1')
      .set('Authorization', token)
      .query({
        sort: 'descending',
        docsPerPage: '0'
      })
    expect(res.statusCode).toEqual(200)
    done()
  })
})
