const mongoose = require('mongoose')
const validator = require('validator')

// create task Schema
const taskSchema = ({
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: { // to create a relationship between user and task, we are adding the user's id here. another alternative is to add task id to the user but it will end up in a very long document
        type: mongoose.Schema.Types.ObjectId, // this is saying the type being stored in owner is an object id
        required: true,
        ref: 'Users' // create a reference relationship to the 'Users' model created in /models/user.js
    }
})

// middleware would go here
//

// create a new document model
const Task = mongoose.model('Tasks', taskSchema)

module.exports = Task

// const task = new Task({
//     description: 'task number 1',
//     completed: false
// })
// task.save().then(() => {console.log('Success')}).catch(()=> console.log('Rejected!'))