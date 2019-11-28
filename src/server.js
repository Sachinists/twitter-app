const express = require('express')
require('./db/mongoose')

const userRouter = require('./routers/user')
const tweetRouter = require('./routers/tweet')

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(userRouter)
app.use(tweetRouter)

app.listen(port, () => {
    console.log('Server listening on port: ', port)
})