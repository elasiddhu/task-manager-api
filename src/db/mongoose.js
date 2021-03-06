const mongoose = require('mongoose') // mongoose is a module that wraps around mongodb and makes it easier to use

// mongoose.connect() connects a mongodb server to a specific path/port
// initiate the db with the code below. (path to mongod.exe) --dbpath=(path where mongodb data lives)
// /Users/Jonnie/Desktop/coding/mongodb/mongodb/bin/mongod.exe --dbpath=/Users/Jonnie/Desktop/coding/mongodb/mongodb-data
mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', { // url ends with the database name
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})
