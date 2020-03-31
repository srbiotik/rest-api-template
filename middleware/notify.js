import nodemailer from 'nodemailer'

import Follow from '../models/follow'

async function send(email) {
  const { EMAIL_SERVICE, EMAIL_PORT, EMAIL_USER, EMAIL_PASSWORD } = process.env
  let transporter = nodemailer.createTransport({
    host: EMAIL_SERVICE,
    port: EMAIL_PORT,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASSWORD

    }
  })
  let mailOptions = {
    from: EMAIL_USER,
    to: email,
    subject: 'Post you are following has a new comment',
    text: ''
  }
  try {
    const info = await transporter.sendMail(mailOptions)
    return null, info
  } catch (err) {
    console.log(err)
    return err, null
  }
}


export default async function(req, res) {
  const { comment } = req
  const { _id, createdAt, postRefId } = comment
  try {
    const followers = await Follow.findOne({ postRefId })
    const emails = followers ? followers.notify : []
    for (const email of emails) {
      // Don't notify the user that made the comment, thats just silly!
      if (req.user.email !== email) send(email)
    }
    const message = `User ${req.user.username} successfully posted a comment`
    return res.status(201).json({ _id, createdAt, postRefId, message })
  } catch (err) {
    return res.status(400).send(`Bad request ${err.name}`)
  }
}
