// express for server methods
const express = require('express') // import express module from npm to create a server
// mongoose for db methods
require('./db/mongoose') // import mongoose.js from db folder so that we can access the db
// http Routers for CRUD
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express() // assign a new express server to "app"
const port = process.env.PORT // assign a port from process.env.PORT

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