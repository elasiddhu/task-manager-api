const express = require('express') // import express module from npm to use express server methods
const multer = require('multer') // import multer module to include file upload feature
const sharp = require('sharp') // import sharp module to provide image formatting and auto-sizing
const User = require('../models/user') // import User model from models folder so that we can create a new user using mongoose models/validation
const auth = require('../middleware/auth')
const router = new express.Router() // assign a new express router to router

// below is our first API route. it is used to create a new user in the db
router.post('/users', async (req, res) => { // when a client (web app or postman) send a POST request to /users, this code block will send a response to the client and do something with the request
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token }) // by default, express sets status codes to 200 assuming everything went well
        // code on this line will only run if the promise above is fulfilled. if not, it will go down to catch error below
    } catch (error) {
        res.status(400).send(error) // can set custom status codes with .status() method
    }
})

// route for user login
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password) // .findByCredentials is a mongoose method that will take in a user's email and password and output the user if true
        // if the await User.findbyCredentials promise is fulfilled, it will return a user
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (error) {
        res.status(400).send()
    }
})

// route for user logout
router.post('/users/logout', auth, async (req, res) => { // requires authentication to be able to logout (need to be logged in with a token to log out)
    try {
        // we are already logged in so we have req.user.token
        // set tokens array (req.user.tokens) to a filtered version of it (return true if the token is equal to the token used in auth (token.token))
        req.user.tokens = req.user.tokens.filter((token) => {
            // return only the tokens that do not equal the token that was used to log in (so that we can set this new array as the current array)
            // by returning the token that do NOT equal the token that was used, we are removing that used token and effectively logging out of that token
            return token.token !== req.token
        })
        // save req.user with updates
        await req.user.save()
        // send back updated user
        res.send()
    } catch (error) {
        res.status(500).send()
    }
})

// route for user to logout of all sessions (removes all tokens)
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        // set req.user.tokens to an empty array (remove all tokens)
        req.user.tokens = []
        // save req.user with updates
        await req.user.save()
        res.status(200).send()
    } catch (error) {
        res.status(500).send()
    }
})

// create endpoint for users to upload their avatar
const upload_avatar = multer({ // pass to multer an options object that takes in the configuration for the tool
    // dest: 'avatars', // dest = destination for the file to be uploaded to. By not including 'dest' the file gets pushed onto the next function in the series of middleware
    limits: {
        fileSize: 1000000 // in byts
    },
    // fileFilter() is a function that runs when the file is attempted to be uploaded (because upload.single() is middleware)
    // argument 1 request contains the request being made
    // argument 2 file contains information about the file being uploaded
    // argument 3 callback use callback to tell multer when we're done filtering the file
    fileFilter(req, file, cb) {
        // cb(new Error('File must be a PDF')) // call callback this way when throwing an error
        // cb(undefined, true) // call callback this way when error is undefined and true if the upload is as expected
        // cb(undefined, false) // call callback this way when we want to "silently reject the upload"
        //if (!file.originalname.endsWith('.pdf')) { // .originalname is a multer method for the name of the file on the user's computer. .endsWith('') is a vanilla JS string method
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image file'))
        }
        cb(undefined, true)
    }
})
router.post('/users/me/avatar', auth, upload_avatar.single('avatar'), async (req, res) => { // auth goes before upload avatar even though they are both middleware because the user must be authenticated before uploading an avatar. 3rd argument .single() is multer middleware. argument inside .single() is the name of the key of the file being uploaded
    // user sharp to resize avatar before saving it
    // sharp takes in the file input from the request as an argument (req.file.buffer)
    // .resize() resizes all of the images to the same size
    // .png converts all of the incoming images into png format
    // .toBuffer() is a sharp method that converts the data back to a buffer that we can access
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    // old code line // req.user.avatar = req.file.buffer // access file uploaded from multer using req.file. buffer contains buffer of all binary data of the file
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

// create a route to fetch the users profile
router.get('/users/me', auth, async (req, res) => { // middleware should be the second arugment (between the path and the callback)
    // this route will only run if the user is logged in and authenticated so we can just do something (e.g. send back the user)
    res.send(req.user)
})

// create a route to fetch a single user by id
router.get('/users/:id', async (req, res) => { // :id is a dynamic route parameter (value that changes per the get request)
    const _id = req.params.id // assign the id from the HTTP request to _id variable
    try {
        const user = await User.findById(_id)
        if (!user) { // express will always return unless there was an error. not finding data does not trigger an error so its good practice to check for a user
            return res.status(404).send()
        }
        res.send(user)
    } catch (error) {
        res.status(500).send()
    }
})

// setup url to serve up avatar image
router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user || !user.avatar) {
            throw new Error()
        }
        res.set('Content-Type', 'image/jpg') // tell requester what type of data they are getting back
        res.send(user.avatar)
    } catch (error) {
        res.status(404).send()
    }
})

// patch http resource is designed for updating resources
// this route is refactored because people should not be able to update other users information, only their own
router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update)) // .every() is an array method that takes a callback and does something to every item in the array

    if (!isValidOperation) {
        return res.status(400).send({error: 'Invalid updates!'})
    }

    try {
        // this line is not needed because we can just access req.user // const user = await User.findById(req.user._id)
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        // modern way to update but doesn't use .save() so you can't use middle ware //const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runVailidators: true }) // 3 arguments. 1 = id, 2 = object to update to, 3 = optional param. new = true means return the updated object, not the old one    
        res.send(req.user)
    } catch (error) {
        res.status(400).send(error)
    }
})

// delete http method
// path revised from /users/:id to /users/me because the user should not be able to delete OTHER peoples profiles
router.delete('/users/me', auth, async (req, res) => {
    try {
        // no longer need code to check for user because the user is already authenticated before deleting their profile
        // const user = await User.findByIdAndDelete(req.user._id)
        // if (!user) {
        //     return res.status(404).send()
        // }
        await req.user.remove() // single line that achieves the same code above
        res.send(req.user)
    } catch (error) {
        res.status(500).send()
    }
})

// endpoint to delete user avatar
router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined // set to undefined to remove buffer data
    await req.user.save()
    res.send()
})

module.exports = router