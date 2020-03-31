import mongoose from 'mongoose'

import { app } from './app'

// Read port from env variablne if not exists => use default 5000
const port = process.env.PORT || '5000'
const mongo = process.env.MONGO || 'mongodb://localhost/comic_clan'

// Setup connection details
mongoose.connect(mongo, {
  useUnifiedTopology: true,
  useNewUrlParser: true
})

/*
  wait for db to open to start listening for requests
  this ensures not errors relating to db connection
*/
let db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
  app.listen(port, () => {
    console.log(`Comic Clan service listening on ${port}`)
  })
})

