const express = require('express')
const cors = require('cors')
const rateLimit = require("express-rate-limit");
const path = require('path')
require('./db/mongoose')

const userRouter = require('./routers/user')
const tweetRouter = require('./routers/tweet')
const followerRouter = require('./routers/follower')

const app = express()
const port = process.env.PORT

const limiter = rateLimit({
    max: 100
});

app.use(cors())
app.use(express.json())
app.use(userRouter)
app.use(tweetRouter)
app.use(followerRouter)
app.use(limiter)

app.use(express.static(path.join(__dirname, 'views')))

app.listen(port, () => {
    console.log('Server listening on port: ', port)
})