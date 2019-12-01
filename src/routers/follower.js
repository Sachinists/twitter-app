const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const Followers = require('../models/follower')
const Tweet = require('../models/tweet')
const mongoose = require('mongoose')

router.post('/users/follow', auth, async(req, res) => {
    const { userID } = req.body
    const follower = new Followers({
        owner: req.user._id,
        otherPersonID: userID
    })
    try {
        await follower.save()
        res.status(201).send()
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/me/followings', auth, async(req, res) => {
    try {
        await req.user.populate({
            path: 'followings',
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip)
            }
        }).execPopulate()
        res.send(req.user.followings)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/me/feeds', auth, async(req, res) => {
    try {
        await req.user.populate('followings').execPopulate()
        const array = req.user.followings.map(element => element.otherPersonID);
        const tweets = await Tweet.find({
            owner: { $in: array }
        }, null, {
            limit: parseInt(req.query.limit),
            skip: parseInt(req.query.skip),
            sort: { createdAt: -1 }
        })
        res.send(tweets)
    } catch (e) {
        res.status(500).send()
    }
})

router.delete('/users/follow/:id', auth, async(req, res) => {

    try {
        const follow = await Followers.findOneAndDelete({ otherPersonID: req.params.id, owner: req.user._id })

        if (!follow) {
            return res.status(404).send()
        }

        res.send(follow)
    } catch (e) {
        return res.status(500).send(e)
    }
})

router.get('/me/followers', auth, async(req, res) => {
    try {
        const followers = await Followers.find({ otherPersonID: req.user._id })
        res.send({ followers: followers.length })
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router