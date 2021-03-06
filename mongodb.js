// this file is no longer used in the application. it is saved for reference purposes only

const { MongoClient, ObjectID } = require('mongodb') // import mongodb modules by destructuring

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

const id = new ObjectID()
console.log('id.id', id.id.length)
console.log('id timestamp: ', id.toHexString().length)

MongoClient.connect(connectionURL, { useUnifiedTopology: true }, (error, client) => {
    if (error) {
        return console.log('Unable to connect to database!')
    }

    const db = client.db(databaseName)

    // DELETE (using .delete() methods)

    // db.collection('tasks')
    //     .deleteOne({
    //         _id: ObjectID("6041c5e0dfb9591ffcade323")
    //     })
    //     .then(() => {
    //         console.log('success')
    //     })
    //     .catch(() => {
    //         console.log('rejected')
    //     })

    // db.collection('users')
    //     .deleteMany({ name: 'Andrew' })
    //     .then(() => {
    //         console.log('Success')
    //     })
    //     .catch(() => {
    //         console.log('Error')
    //     })

    // UPDATE (using .update() methods)

    // db.collection('tasks')
    //     .updateMany({
    //         completed: false
    //     },
    //     {
    //         $set: {
    //             completed: true
    //         }
    //     })
    //     .then(() => {
    //         console.log('success')
    //     })
    //     .catch(() => {
    //         console.log('rejected')
    //     })

    // db.collection('users')
    //     .updateMany({
    //         // blank because there are no filters
    //     },
    //     {
    //         $inc: {
    //             age: 1
    //         }
    //     })
    //     .then(() => {
    //         console.log('success')
    //     })
    //     .catch(() => {
    //         console.log('rejected')
    //     })

    // db.collection('users')
    //     .updateOne({
    //         _id: ObjectID("6041950977de131a5c344f83")
    //     },
    //     {
    //         $inc: {
    //             age: 1 // increments the age by +1. use a negative number to decrement
    //         }
    //     })
    //     .then(() => {
    //         console.log('promise fulfilled')
    //     })
    //     .catch(() => {
    //         console.log('promise rejected')
    //     })

    // db.collection('users')
    //     .updateOne({ 
    //         _id: ObjectID("6041950977de131a5c344f83") 
    //     },
    //     {
    //         $set: {
    //             name: 'Bruno'
    //         }
    //     })
    //     .then((result) => {
    //         console.log(result)
    //     })
    //     .catch((result) => {
    //         console.log(result)
    //     })

    // READ (using .find() methods)

    // db.collection('tasks').findOne({ _id: ObjectID("6041c5e0dfb9591ffcade323") }, (error, result) => {
    //     console.log(result)
    // })

    // db.collection('tasks').find({ completed: false }).toArray((error, result) => {
    //     console.log(result)
    // })

    // db.collection('users').findOne({ _id: ObjectID("6041c5e0dfb9591ffcade321") }, (error, result) => {
    //     if (error) {
    //         return console.log('Unable to fetch')
    //     }
    //     console.log(result)
    // })

    // db.collection('users')
    //     .find({ age: 27 }) // .find() does not take any callbacks because it returns a cursor (a pointer to data)
    //     .toArray((error, result) => { // .toArray() is a .find() method that takes a callback and returns an array of the cursor
    //         console.log(result)
    //     })

    // db.collection('users')
    // .find({ age: 27 }) // .find() does not take any callbacks because it returns a cursor (a pointer to data)
    // .count((error, result) => { // .count is a .find() method that takes a callback and returns the number of items pointed to by the cursor
    //     console.log('count:', result)
    // })

    // CREATE (using .insert() methods)

    // db.collection('users').insertOne({
    //     name: 'Lila',
    //     age: 3
    // }, (error, result) => { // callback gets called when the operation is complete
    //     if (error) {
    //         return console.log('Unable to insert user')
    //     }
    //     console.log(result.ops) // result.ops is an array of documents inside the 'users' collection
    // })

    // db.collection('users').insertMany([ // per MongoDB docs, the first argument for insertMany is an array of docs
    //     {
    //         name: 'Jonnie',
    //         age: 29
    //     },
    //     {
    //         name: 'Gillian',
    //         age: 31
    //     }
    // ], (error, result) => {
    //     if (error) {
    //         return console.log('Unable to insert users')
    //     }
    //     console.log(result.ops)
    // })

    // db.collection('tasks').insertMany([
    //     {
    //         description: 'this is a description for task 1',
    //         completed: true
    //     },
    //     {
    //         description: 'this is a description for task 2',
    //         completed: false
    //     }
    // ], (error, result) => {
    //     if (error) {
    //         return console.log('Unable to insert tasks')
    //     }
    //     console.log(result.ops)
    // })
})