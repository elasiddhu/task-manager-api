// express for server methods
const express = require('express') // import express module from npm to create a server
// mongoose for db methods
require('./db/mongoose') // import mongoose.js from db folder so that we can access the db
// http Routers for CRUD
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express() // assign a new express server to "app"
const port = process.env.PORT || 3000 // assign a port to localhost:3000 OR process.env.PORT (which is required for the heroku port)

// app.use() is middleware (meaning that it is a method used to do thing in between a processing a request and sending a response in your application)
app.use(express.json()) // express.json() is used to parse JSON data that you are sending (only required for POST and PATCH requests, not GET or DELETE)
app.use(userRouter) // initiate routers for CRUD
app.use(taskRouter) // initiate routers for CRUD

app.listen(port, () => { // initiate a server by opening and listening to a port
    console.log(`Server is up on port ${port}`)
})

const bcrypt = require('bcryptjs')

const myFunction = async () => {
    const password = 'arealpassword123'
    // note that hashing algorithms are one-way algorithms. it is impossible to get plain text password from a hashed password
    const hashedPassword = await bcrypt.hash(password, 8) // await because bcrypt.hash() method returns a promise // 2nd argument is number of rounds (# of times hash algorithm is run)
    console.log(password)
    console.log(hashedPassword)
    // now test if a given password is equal to a password in the given database
    const isMatch = await bcrypt.compare('arealpassword123', hashedPassword) // returns a boolean if passwords match
    console.log(isMatch)
}

myFunction()