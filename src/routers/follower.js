const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const Followers = require('../models/follower')
const Tweet = require('../models/tweet')
const mongoose = require('mongoose')

router.post('/users/follow/:id', auth, async (req, res) => {
    const follower = new Followers({
        owner: req.user._id,
        otherPersonID: req.params.id
    })
    try {
        await follower.save()
        res.status(201).send()
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/me/followings', auth, async (req, res) => {
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

router.get('/me/feeds', auth, async (req, res) => {
    try {
        await req.user.populate({
            path: 'followings',
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip)
            }
        }).execPopulate()
        const array = req.user.followings.map(element => element.otherPersonID);
        const tweets = await Tweet.find({
            'owner': { $in: array }
        })
        tweets.sort((a,b) => {
            if(a.createdAt > b.createdAt){
                return -1
            } else  if(a.createdAt < b.createdAt){
                return 1
            }
            else{
                return 0
            }
        })
        res.send(tweets)     
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router