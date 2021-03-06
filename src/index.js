const express = require('express') // import express module from npm to create a server
require('./db/mongoose') // import mongoose.js from db folder so that we can access the db
const User = require('./models/user') // import User model from models folder so that we can create a new user using mongoose models/validation
const Task = require('./models/task')

const app = express() // assign a new express server to "app"
const port = process.env.PORT || 3000 // assign a port to localhost:3000 OR process.env.PORT (which is required for the heroku port)

app.use(express.json())

// below is our first API route. it is used to create a new user in the db
app.post('/users', (req, res) => { // when a client (web app or postman) send a POST request to /users, this code block will send a response to the client and do something with the request
    const user = new User(req.body)
    user.save().then(() => {
        res.status(201).send(user) // by default, express sets status codes to 200 assuming everything went well
    }).catch((error) => {
        res.status(400).send(error) // can set custom status codes with .status() method
    })
})

// create a route to fetch multiple users (read users from the db)
app.get('/users', (req, res) => {
    User.find({}).then((users) => { // per Mongoose doc. Model.find() takes in an object to find as first argument. second argument is what to do with the result
        res.send(users)
    }).catch((error) => {
        res.status(500).send() // sends back Status 500: Internal Server Error
    })
})

// create a route to fetch a single user by id
app.get('/users/:id', (req, res) => { // :id is a dynamic route parameter (value that changes per the get request)
    const _id = req.params.id // assign the id from the HTTP request to _id variable
    User.findById(_id).then((user) => {
        if (!user) { // express will always return unless there was an error. not finding data does not trigger an error so its good practice to check for a user
            return res.status(404).send()
        }
        res.send(user)
    }).catch((error) => {
        res.status(500).send()
    })
})

// create a route to add a task to the db
app.post('/tasks', (req,res) => {
    const task = new Task(req.body)
    task.save().then(() => {
        res.status(200).send(task)
    }).catch((error) => {
        res.status(400).send(error)
    })
})

// create a route to read all tasks
app.get('/tasks', (req, res) => {
    Task.find().then((tasks) => {
        if (!tasks) {
            return res.send(404).send()
        }
        res.status(200).send(tasks)
    }).catch(() => {
        res.status(500).send()
    })
})

// create a route to read a single task
app.get('/tasks/:id', (req, res) => {
    const _id = req.params.id
    Task.findById(_id).then((task) => {
        if (!task) {
            return res.status(404).send()
        }
        res.status(200).send(task)
    }).catch((error) => {
        res.status(500).send()
    })
})

app.listen(port, () => { // initiate a server by opening and listening to a port
    console.log(`Server is up on port ${port}`)
})