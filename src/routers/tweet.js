const express = require('express')
const router = new express.Router()
const Tweet = require('../models/tweet')
const auth = require('../middleware/auth')

router.post('/addTweet', auth, async (req, res) => {
    const tweet = new Tweet({
        ...req.body,
        owner: req.user._id
    })
    try {
        await tweet.save()
        res.status(201).send({ tweet })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/tweets/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const tweet = await Tweet.findOne({ _id, owner: req.user._id })
        if(!tweet){
            return res.status(404).send()
        }
        res.send(tweet)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/tweets', auth, async (req, res) => {
    try {
        await req.user.populate({
            path: 'tweets',
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort: {
                    createdAt: -1
                }
            }
        }).execPopulate()
        res.send(req.user.tweets)
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
})

router.patch('/tweets/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = [ 'tweet' ]
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid Update Request' })
    }

    try {
        const tweet =  await Tweet.findOne({ _id: req.params.id, owner: req.user._id })
        
        if(!tweet){
            return res.status(404).send()
        }
        
        updates.forEach((update) => tweet[update] = req.body[update])
        await tweet.save()
        res.send(tweet)
    } catch (e) {
        return res.status(500).send(e)
    }
})

router.delete('/tweets/:id', auth, async (req, res) => {

    try {
        const tweet =  await Tweet.findByIdAndDelete({ _id: req.params.id, owner: req.user._id })
        
        if(!tweet){
            return res.status(404).send()
        }

        res.send(tweet)
    } catch (e) {
        return res.status(500).send(e)
    }
})

module.exports = router