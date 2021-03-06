const express = require('express') // import express module from npm to create a server
require('./db/mongoose') // import mongoose.js from db folder so that we can access the db
const User = require('./models/user') // import User model from models folder so that we can create a new user using mongoose models/validation
const Task = require('./models/task')

const app = express() // assign a new express server to "app"
const port = process.env.PORT || 3000 // assign a port to localhost:3000 OR process.env.PORT (which is required for the heroku port)

app.use(express.json())

// below is our first API route. it is used to create a new user in the db
app.post('/users', async (req, res) => { // when a client (web app or postman) send a POST request to /users, this code block will send a response to the client and do something with the request
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
app.get('/users', async (req, res) => {
    try {
        const users = await User.find({}) // per Mongoose doc. Model.find() takes in an object to find as first argument. second argument is what to do with the result
        res.send(users)
    } catch (error) {
        res.status(500).send() // sends back Status 500: Internal Server Error
    }
})

// create a route to fetch a single user by id
app.get('/users/:id', async (req, res) => { // :id is a dynamic route parameter (value that changes per the get request)
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

// create a route to add a task to the db
app.post('/tasks', async (req,res) => {
    const task = new Task(req.body)
    try {   
        await task.save()
        res.status(200).send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})

// create a route to read all tasks
app.get('/tasks', async (req, res) => {
    const tasks = await Task.find()
    try {
        if (!tasks) {
            return res.status(404).send()
        }
        res.status(200).send(tasks)
    } catch (error) {
        res.status(500).send()
    }
})

// create a route to read a single task
app.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id
    const task = await Task.findById(_id)
    try {
        if (!task) {
            return res.status(404).send()
        }
        res.status(200).send(task)
    } catch (error) {
        res.status(500).send()
    }
})

app.listen(port, () => { // initiate a server by opening and listening to a port
    console.log(`Server is up on port ${port}`)
})