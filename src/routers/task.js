const express = require('express') // import express module from npm to use express server methods
const Task = require('../models/task') // import Task model from models folder so that we can create a new user using mongoose models/validation
const auth = require('../middleware/auth')
const router = new express.Router() // assign a new express router to router

// create a route endpoint to add a task to the db
router.post('/tasks', auth, async (req,res) => { // adding auth middleware to this post because the user must be authenticated to create a post
    // old code // const task = new Task(req.body)
    const task = new Task({
        ...req.body, // copies all of the req.body properties to this task
        owner: req.user._id // sets the owner property of a task to the user that is logged in
    })
    try {   
        await task.save()
        res.status(200).send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})

// create a route to read all tasks
router.get('/tasks', auth, async (req, res) => {
    // old cold line // const tasks = await Task.find()
    try {
        // this line works if you do res.status(200).send(tasks). const tasks = await Task.find({ owner: req.user._id })
        await req.user.populate('tasks').execPopulate()
        res.status(200).send(req.user.tasks)
    } catch (error) {
        res.status(500).send()
    }
})

// create a route to read a single task by id
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        // old code line. cannot use because we need to find a task with user id not just ask id // const task = await Task.findById(_id)
        const task = await Task.findOne({ _id, owner: req.user._id }) // finding task by using the task id and also the id of the authenticated user
        if (!task) {
            return res.status(404).send()
        }
        res.status(200).send(task)
    } catch (error) {
        res.status(500).send()
    }
})

// update route for a task by id
router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updated!' })
    }

    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })
        // old code line. const task = await Task.findById(req.params.id)
        // modern way to update a task without using middleware //const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!task) {
            return res.status(404).send()
        }
        updates.forEach((update) => {
            task[update] = req.body[update]
        })
        await task.save()
        res.send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})

// delete a task
router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
        if (!task) {
            res.status(404).send()
        }
        res.send(task)
    } catch (error) {
        res.status(500).send()
    }
})

module.exports = router