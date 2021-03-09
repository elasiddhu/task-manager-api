const express = require('express') // import express module from npm to use express server methods
const User = require('../models/user') // import User model from models folder so that we can create a new user using mongoose models/validation

const router = new express.Router() // assign a new express router to router

// below is our first API route. it is used to create a new user in the db
router.post('/users', async (req, res) => { // when a client (web app or postman) send a POST request to /users, this code block will send a response to the client and do something with the request
    const user = new User(req.body)
    try {
        await user.save()
        res.status(201).send(user) // by default, express sets status codes to 200 assuming everything went well
        // code on this line will only run if the promise above is fulfilled. if not, it will go down to catch error below
    } catch (error) {
        res.status(400).send(error) // can set custom status codes with .status() method
    }
})

// create a route to fetch multiple users (read users from the db)
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({}) // per Mongoose doc. Model.find() takes in an object to find as first argument. second argument is what to do with the result
        res.send(users)
    } catch (error) {
        res.status(500).send() // sends back Status 500: Internal Server Error
    }
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
router.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update)) // .every() is an array method that takes a callback and does something to every item in the array

    if (!isValidOperation) {
        return res.status(400).send({error: 'Invalid updates!'})
    }

    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runVailidators: true }) // 3 arguments. 1 = id, 2 = object to update to, 3 = optional param. new = true means return the updated object, not the old one    
        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch (error) {
        res.status(400).send(error)
    }
})

// delete http method
router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch (error) {
        res.status(500).send()
    }
})

module.exports = router