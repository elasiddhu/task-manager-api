require('../src/db/mongoose') // import db
const Task = require('../src/models/task') // import Task model

// task document object id 6042829b66da9f366c3b1eb7

Task.findByIdAndDelete('6042829b66da9f366c3b1eb7')
    .then(() => {
        return Task.countDocuments({ completed: false })
    })
    .then((result) => {
        console.log(result)
    })
    .catch((error) => {
        console.log(error)
    })