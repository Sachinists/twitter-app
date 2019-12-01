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
    },
    ownerName: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        lowercase: true
    },
    hasTags: [{
        type: String,
        trim: true,
        lowercase: true
    }]
}, {
    timestamps: true
})

tweetSchema.methods.toJSON = function() {
    const tweet = this

    const tweetObject = tweet.toObject()

    return tweetObject
}

const Tweet = mongoose.model('Tweet', tweetSchema)

module.exports = Tweet