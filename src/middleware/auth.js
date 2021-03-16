const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
    try {
        // grab token from request header
        const token = req.header('Authorization').replace('Bearer ','') // req.header('Authorization') grabs the 'Authorization' header key that was sent with the http request from the client
        // check to make sure the token is valid
        const decoded = jwt.verify(token, process.env.JWT_SECRET) // jwt.verify() returns the _id of the user associated with the token, and a timestamp
        // check to see if user exists
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
        // if user does not exist, throw an error
        if (!user) {
            throw new Error()
        }
        // if user does exist, set the req.user (the user object in the http request) to user above (the one that includes a token) and set token to token and then go next()
        req.token = token
        req.user = user
        //console.log('auth.js req.token', req.token)
        //console.log('auth.js req.user', req.user)
        next()
    } catch (error) {
        res.status(401).send({ error: 'Please authenticate.' })
    }
}

module.exports = auth