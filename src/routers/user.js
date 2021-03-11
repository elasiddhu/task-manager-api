const express = require('express') // import express module from npm to use express server methods
const User = require('../models/user') // import User model from models folder so that we can create a new user using mongoose models/validation
const auth = require('../middleware/auth')
const { response } = require('express')
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

module.exports = router