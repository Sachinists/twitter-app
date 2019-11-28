const mongoose = require('mongoose')

const tweetSchema = new mongoose.Schema({
    tweet: {
        type: String,
        required: true,
        trim: true,
    },
    likes: {
        type: Number,
        default: 0
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

tweetSchema.methods.toJSON = function () {
    const tweet = this

    const tweetObject = tweet.toObject()

    return tweetObject
}

const Tweet = mongoose.model('Tweet', tweetSchema)

module.exports = Tweet