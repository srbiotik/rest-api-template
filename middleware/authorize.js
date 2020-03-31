import jose from 'jose'

import User from '../models/user'

const { JWT, JWK } = jose
const SECRET = process.env.SECRET_KEY || 'super+secret-mega*key/'
const TOKEN_EXIPIRES_IN = process.env.TOKEN_EXIPIRES_IN || '2 hours'
const SKIP_AUTH = process.env.SKIP_AUTH || '/register,/authenticate'


function getDataFromToken(auth) {
  const token = auth.split(' ')[1]
  const key = JWK.asKey({
    kty: 'oct',
    k: SECRET
  })
  const credentials = JWT.verify(
    token,
    key, {
      expiresIn: TOKEN_EXIPIRES_IN,
      header: {
        typ: 'JWT'
      }
    }
  )
  return credentials
}

export default async function(req, res, next) {
  // Test if route in skip authorization
  const regex = new RegExp(req.path)
  if (regex.test(SKIP_AUTH)) return next()
  // Check if authorization is present
  const auth = req.get('authorization')
  if (!auth) return res.status(401).send('Not authorized.')

  try {
    const { username, password } = getDataFromToken(auth)
    const user = await User.findOne({ username, password })
    if (!user) return res.status(404).send('Not authorized.')
    req.user = user
    return next()
  } catch (err) {
    if (err.name === 'JWTExpired') return res.status(404).send('Not authorized.')
    return res.status(500).send(err.name)
  }
}
