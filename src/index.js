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
// middleware is commonly used to limit what users have access to
// app.use((req, res, next) => {
//     // console.log(req.method, req.path) // req.method to get the http request method used. req.path to get the path of the http request
//     if (req.method === 'GET') {
//         res.status(503).send('GET requests are disabled')
//     } else {
//         next() // must call next() or the request will never get sent to the run route handler ("request" will be "loading" forever)
//     }
// })
// // below is middleware used for "maintenance mode": all requests should send back an error code
// app.use((req, res, next) => {
//     res.send('Site is currently down for maintenance. Check back soon!')
// })
app.use(express.json()) // express.json() is used to parse JSON data that you are sending (only required for POST and PATCH requests, not GET or DELETE)
app.use(userRouter) // initiate routers for CRUD
app.use(taskRouter) // initiate routers for CRUD

app.listen(port, () => { // initiate a server by opening and listening to a port
    console.log(`Server is up on port ${port}`)
})

const Task = require('./models/task')
const User = require('./models/user')
const main = async () => {
    // find task by id and include owner (user that created the task) document
    // const task = await Task.findById('604969127110761c44c1b284')
    // await task.populate('owner').execPopulate() // this line uses the 'ref' property in the Task model to reference the user _id for the entire document instead of just the _id
    // now find all tasks created by a user
    const user = await User.findById('604968572c50fd1bf4b757a5')
    await user.populate('tasks').execPopulate()
    console.log(user.tasks)
}
main () // call main