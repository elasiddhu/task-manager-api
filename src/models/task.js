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