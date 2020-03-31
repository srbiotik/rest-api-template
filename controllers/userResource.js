import blake from 'blakejs'
import jose from 'jose'

import User from '../models/user'

const { JWT, JWK } = jose
const SECRET = process.env.SECRET_KEY || 'super+secret-mega*key/'
const TOKEN_EXIPIRES_IN = process.env.TOKEN_EXIPIRES_IN || '2 hours'


function encryptPassword(password) {
  return blake.blake2bHex(password, '', 12)
}

function getToken(username, password) {
  const key = JWK.asKey({
    kty: 'oct',
    k: SECRET
  })
  const token = JWT.sign(
    { username, password },
    key,
    {
      expiresIn: TOKEN_EXIPIRES_IN,
      header: {
        typ: 'JWT'
      }
    }
  )
  return `Bearer ${token}`
}

async function authenticate(req, res) {
  const {
    username,
    password
  } = req.body
  // Registering skips auth
  const encryptedPassword = encryptPassword(password)
  const user = await User.findOne({
    username,
    password: encryptedPassword
  })
  if (!user) return res.status(404).send('User not found')
  const token = getToken(user.username, user.password)
  return res.status(200).send(token)
}

async function register(req, res) {
  // Extract query arguments
  const { email, username, password } = req.body
  try {
    const user = new User({ email, username, password: encryptPassword(password) })
    await user.save()
    return res.status(201).send(`User ${username} succcesfully created`)
  } catch (err) {
    if (err.code === 11000) {
      const [ key, ] = Object.entries(err.keyValue)[0]
      return res.status(400).send(`${key} not unique`)
    }
    if (err.name === 'ValidationError') return res.status(400).send(err.message)
    return res.status(500).send(err.name)
  }
}

export default {
  authenticate,
  register
}
