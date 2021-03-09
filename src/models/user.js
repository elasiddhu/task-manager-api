const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// create user schema
const userSchema = new mongoose.Schema({
    name: {
        type: String, // Sting and Number are constructor types from javascript. Other examples are Boolean, Dates, Arrays, etc...
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true, // must wipe out database before this can be implemented
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid.')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 7,
        validate(value) {
            if(value.toLowerCase().includes('password')) {
                throw new Error(`Cannot have 'password' inside password`)
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number.')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

// setting up token creation when logging in
// .methods methods are accessible on the instances. they are sometimes called instance methods
userSchema.methods.generateAuthToken = async function () { // not using ES6 arrow function because we need access to "this" keyword
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'secrettoken')
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

// .statics methods are accessible on the model. they are sometimes called model methods
// setting up a value on a schema.statics() allows us to set up middleware to check for email and password before running .findByCredentials
userSchema.statics.findByCredentials = async (email, password) => {
    // check if user with the inputted email is an active user
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error('Unable to login')
    }
    // check is password matches by comparing encrypted password to the entered password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('Unable to login')
    }
    // if user is active and password is correct, return the user
    return user
}

// mongoose schema .pre() method is a method that does something BEFORE the model is saved (e.g. bcrypt the password before saving it into the db)
// Hash the plain text password
userSchema.pre('save', async function (next) { // .pre() method: first argument is the name of the event that this happens before. second argument is what to do (it must be function(){} and not an arrow function because the "this" keyword is import here)
    const user = this // "this" gives us access to the user that is about to be saved
    if (user.isModified('password')) { // .isModified() is a mongoose method that checks if a key was modified in a patch
        user.password = await bcrypt.hash(user.password, 8) // overriding plain text password with the hashed password
    }
    next() // next gets called when the function is over, so that the .pre() middleware knows that everything is done
})

// create a new document model
const User = mongoose.model('Users', userSchema)  // mongoose.model() takes in two arguments. first argument is string name for model. second argument is the object definition with fields we want (i.e. Schema)

module.exports = User

// const bad_user = new User({
//     name: 'Test Name',
//     email: 'test@email.com',
//     password: 'passwordtest'
// })

// bad_user.save().then((result) => console.log('result: ', result)).catch((result) => {console.log(result.message)})

// const good_user = new User({
//     name: 'Test Name',
//     email: 'test@email.com',
//     password: 'passw0rd'
// })

// good_user.save().then((result) => {console.log('result: ', result)}).catch(() => {console.log('rejected promise')})

// const me = new User({
//     name: '         Jonathan ',
//     email: 'MYEMAIL@definitelyanemail.gg'
// })
// me.save().then((result) => {console.log('result')}).catch(() => {console.log('rejected')})

// // if I wanted to create a new User
// const me = new User({
//     name: 'Jonnie',
//     age: 29
// })

// // to save a new document to the database
// me.save()
//     .then((result) => {
//         console.log('Success! ', result)
//     })
//     .catch((result) => {
//         console.log('Error! ', result)
//     })