const express = require('express') // import express module from npm to use express server methods
const Task = require('../models/task') // import Task model from models folder so that we can create a new user using mongoose models/validation

const router = new express.Router() // assign a new express router to router

// create a route to add a task to the db
router.post('/tasks', async (req,res) => {
    const task = new Task(req.body)
    try {   
        await task.save()
        res.status(200).send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})

// create a route to read all tasks
router.get('/tasks', async (req, res) => {
    const tasks = await Task.find()
    try {
        if (!tasks) {
            return res.status(404).send()
        }
        res.status(200).send(tasks)
    } catch (error) {
        res.status(500).send()
    }
})

// create a route to read a single task
router.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id
    const task = await Task.findById(_id)
    try {
        if (!task) {
            return res.status(404).send()
        }
        res.status(200).send(task)
    } catch (error) {
        res.status(500).send()
    }
})

// update route for a task
router.patch('/tasks/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updated!' })
    }

    try {
        const task = await Task.findById(req.params.id)
        updates.forEach((update) => {
            task[update] = req.body[update]
        })
        await task.save()
        // modern way to update a task without using middleware //const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})

// delete a task
router.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id)
        if (!task) {
            res.status(404).send()
        }
        res.send(task)
    } catch (error) {
        res.status(500).send()
    }
})

module.exports = router