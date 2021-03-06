const mongoose = require('mongoose')
const validator = require('validator')

// create a new document model
const User = mongoose.model('Users', { // mongoose.model() takes in two arguments. first argument is string name for model. second argument is the object definition with fields we want
    name: {
        type: String, // Sting and Number are constructor types from javascript. Other examples are Boolean, Dates, Arrays, etc...
        required: true,
        trim: true
    },
    email: {
        type: String,
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
    }
})

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