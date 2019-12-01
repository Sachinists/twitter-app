const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')

router.post('/createUser', async(req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/checkUserNameTaken', async(req, res) => {
    const { username, email } = req.body
    if (username === undefined && email === undefined) {
        return res.status(400).send()
    }
    try {
        let user
        if (username === undefined) {
            user = await User.findOne({ email })
        } else if (email === undefined) {
            user = await User.findOne({ username })
        } else {
            return res.status(400).send()
        }

        if (user) {
            return res.status(200).send({ "exists": true })
        }

        res.status(200).send()
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/login', async(req, res) => {
    try {
        const { username, password } = req.body
        const user = await User.findByCredentials(username, password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send(e.message)
    }
})

router.post('/users/logout', auth, async(req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token)
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async(req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/users/me', auth, async(req, res) => {
    res.send(req.user)
})

router.get('/users/:id', auth, async(req, res) => {
    const _id = req.params.id
    try {
        const user = await User.findOne({ _id })
        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch (e) {
        res.status(500).send()
    }
})


router.patch('/users/me', auth, async(req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'username', 'email', 'password']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid Update Request' })
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        return res.send(req.user)
    } catch (e) {
        return res.status(500).send(e)
    }
})

router.delete('/users/me', auth, async(req, res) => {
    try {
        await req.user.remove()
        return res.send(req.user)
    } catch (e) {
        return res.status(500).send(e)
    }
})

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)/)) {
            return cb(new Error('Please upload an image!'))
        }
        cb(undefined, true)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async(req, res) => {
    console.log('in upload file')
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.user.avatar = buffer
    req.user.avatarSet = true
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    // console.log(error)
    res.status(400).send({ error: error.message })
})

router.delete('/users/me/avatar', auth, async(req, res) => {
    req.user.avatar = undefined
    req.user.avatarSet = false
    await req.user.save()
    res.send()
})

router.get('/users/:id/avatar', async(req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user || !user.avatar) {
            res.status(404).send()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})

router.post('/search', auth, async(req, res) => {
    const { pattern } = req.body
    try {
        const rc = await User.find({ username: { $regex: '^' + pattern + '.*', $options: 'im' } }, null, { limit: parseInt(req.query.limit) })
        const user = rc.filter((u) => {
            return u._id.toString() !== req.user._id.toString()
        })
        if (!user || user.length === 0) {
            res.status(200).send()
        }

        res.send(user)
    } catch (e) {
        res.status(404).send()
    }
})

module.exports = router