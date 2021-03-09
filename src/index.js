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


const jwt = require('jsonwebtoken')
const myFunction = async () => {
    // create a token
    // return value from jwt method .sign() is your token that can be used later on
     // .sign() first argument is id of user singing in. second argument is a random series of characters used to generate the token via an algorithm. third argument is optional to make it expire
    const token = jwt.sign({ _id: 'abc123' }, 'thisismynewcourse', { expiresIn: '7 days' })
    // jwt token has (3) parts, each separate by a "."
    // part 1 is: base 64 encoded json string. known as header. contains metadata about the token and the algorithm used to generate the token
    // part 2 is: base 64 encoded json string. know as payload or body. contains the data that we provided (e.g. _id that we provided)
    // part 3 is: known as the signature. used to verify the token.
    console.log(token)
    // now verify a token
    const data = jwt.verify(token, 'thisismynewcourse') // .verify() first argument is the token, second argument is the same string used when creating the token
    console.log(data)
}
myFunction()